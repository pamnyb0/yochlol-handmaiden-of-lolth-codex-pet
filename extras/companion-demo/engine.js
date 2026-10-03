(function (root) {
  'use strict';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const MOOD_LABELS = { calm: 'At ease', observant: 'Observing', amused: 'Amused', curious: 'Curious', pleased: 'Quietly pleased', irritated: 'Irritated', angry: 'Out of patience' };
  class Companion {
    constructor(dialogue, options = {}) {
      this.dialogue = dialogue;
      this.now = options.now || Date.now;
      this.random = options.random || Math.random;
      const at = this.now();
      const saved = options.saved || {};
      this.state = {
        irritation: clamp(Number(saved.irritation) || 0, 0, 100),
        familiarity: clamp(Number(saved.familiarity) || 0, 0, 100),
        lastMoodAt: Number(saved.lastMoodAt) || at,
        lastSeen: Number(saved.lastSeen) || at,
        startedAt: at,
        lastActivityAt: at,
        lastClickAt: 0,
        lastDragAt: 0,
        clickCount: 0,
        dragCount: 0,
        failureCount: 0,
        identicalFailures: 0,
        lastFailure: null,
        lastSpeechAt: -Infinity,
        lastRareAt: Number(saved.lastRareAt) || -Infinity,
        lastTopicAt: Number(saved.lastTopicAt) || -Infinity,
        transientMood: null,
        transientUntil: 0,
        ambientEnabled: saved.ambientEnabled !== false,
        used: this.sanitizeUsed(saved.used),
        recent: Array.isArray(saved.recent) ? saved.recent.filter(id => typeof id === 'string').slice(-18) : [],
        history: []
      };
      this.tick();
    }
    sanitizeUsed(used) {
      const allowed = new Set(Object.values(this.dialogue.pools).flat().map(line => line.id));
      return Object.fromEntries(Object.entries(used && typeof used === 'object' ? used : {}).filter(([id, at]) => allowed.has(id) && Number.isFinite(at)));
    }
    tick() {
      const s = this.state, at = this.now();
      const elapsed = Math.max(0, at - s.lastMoodAt);
      s.irritation = Math.max(0, s.irritation - elapsed / 1000 * 0.045);
      s.lastMoodAt = at;
      if (at >= s.transientUntil) s.transientMood = null;
      return this.snapshot();
    }
    snapshot() {
      const s = this.state;
      const mood = s.irritation >= 66 ? 'angry' : s.irritation >= 28 ? 'irritated' : s.transientMood || (s.familiarity >= 12 ? 'observant' : 'calm');
      return { mood, label: MOOD_LABELS[mood], irritation: Math.round(s.irritation), familiarity: Math.round(s.familiarity), clickCount: s.clickCount, failureCount: s.failureCount, ambientEnabled: s.ambientEnabled };
    }
    transient(mood, seconds = 45) {
      this.state.transientMood = mood;
      this.state.transientUntil = this.now() + seconds * 1000;
    }
    choose(pool, options = {}) {
      const s = this.state, at = this.now();
      const eligible = (this.dialogue.pools[pool] || []).filter(line => {
        const cooldown = this.dialogue.cooldowns[line.rarity];
        const usedAt = s.used[line.id];
        return !s.recent.includes(line.id) && (usedAt === undefined || at - usedAt >= cooldown) &&
          (line.rarity !== 'rare' || at - s.lastRareAt >= this.dialogue.cooldowns.rare);
      });
      if (!eligible.length) return null;
      const total = eligible.reduce((sum, line) => sum + line.weight, 0);
      let draw = clamp(this.random(), 0, 0.999999) * total;
      let selected = eligible[eligible.length - 1];
      for (const line of eligible) { draw -= line.weight; if (draw < 0) { selected = line; break; } }
      s.used[selected.id] = at;
      s.recent.push(selected.id);
      s.recent = s.recent.slice(-18);
      s.lastSpeechAt = at;
      if (selected.rarity === 'rare') s.lastRareAt = at;
      return { ...selected, pool, delivery: options.telepathic ? 'telepathic' : selected.rarity === 'rare' ? 'low' : 'spoken' };
    }
    event(type, payload = {}) {
      this.tick();
      const s = this.state, at = this.now();
      let pool = null, animation = 'idle', hold = false;
      if (type !== 'ambient' && type !== 'greeting') { s.lastActivityAt = at; s.familiarity = clamp(s.familiarity + 0.12, 0, 100); }
      switch (type) {
        case 'greeting': pool = 'greeting'; break;
        case 'click': {
          s.clickCount = at - s.lastClickAt <= 20000 && s.lastClickAt !== 0 ? Math.min(6, s.clickCount + 1) : 1;
          s.lastClickAt = at;
          s.irritation = clamp(s.irritation + [0, 0, 7, 13, 21, 26, 18][s.clickCount], 0, 100);
          pool = 'click' + s.clickCount;
          animation = s.clickCount <= 2 ? 'waving' : s.clickCount <= 4 ? 'review' : 'idle';
          hold = s.clickCount >= 5;
          if (s.clickCount === 1) this.transient('curious', 25);
          break;
        }
        case 'drag':
          s.dragCount = at - s.lastDragAt <= 90000 && s.lastDragAt !== 0 ? Math.min(3, s.dragCount + 1) : 1;
          s.lastDragAt = at;
          s.irritation = clamp(s.irritation + [0, 5, 16, 25][s.dragCount], 0, 100);
          pool = 'drag' + s.dragCount; animation = 'review'; break;
        case 'work': pool = 'work'; animation = 'running'; this.transient('observant', 90); break;
        case 'failure': {
          s.failureCount++;
          const signature = String(payload.signature || s.lastFailure || 'same-attempt').slice(0, 160);
          const changed = payload.changed === true || (s.lastFailure !== null && signature !== s.lastFailure);
          s.identicalFailures = changed ? 1 : s.identicalFailures + 1;
          s.lastFailure = signature;
          pool = s.failureCount === 1 ? 'failure' : changed ? 'changedFailure' : 'repeatedFailure';
          if (!changed && s.identicalFailures > 1) s.irritation = clamp(s.irritation + 7, 0, 100);
          else this.transient('curious', 60);
          animation = 'failed'; break;
        }
        case 'success':
          pool = payload.understood === false ? 'accidentalSuccess' : s.failureCount ? 'earnedSuccess' : 'success';
          s.failureCount = 0; s.identicalFailures = 0; s.lastFailure = null;
          s.irritation = Math.max(0, s.irritation - 10);
          this.transient('pleased', 65); animation = 'review'; break;
        case 'return':
          if (Number(payload.awayMs) >= 120000) {
            pool = Number(payload.awayMs) >= 3 * 3600000 ? 'longReturn' : 'return';
            this.transient('amused', 55);
          }
          animation = 'waiting'; break;
        case 'compliment': pool = 'compliment'; this.transient('curious'); animation = 'review'; break;
        case 'cute': pool = 'cute'; s.irritation = clamp(s.irritation + 12, 0, 100); animation = 'review'; break;
        case 'insult': pool = 'insult'; s.irritation = clamp(s.irritation + 15, 0, 100); animation = 'review'; break;
        case 'lolth':
          if (at - s.lastTopicAt >= 60000) { pool = 'lolth'; s.lastTopicAt = at; }
          this.transient('amused'); animation = 'review'; break;
        case 'certainty': pool = 'certainty'; this.transient('amused'); animation = 'review'; break;
        case 'correction': pool = 'correction'; this.transient('pleased'); animation = 'review'; break;
        case 'question': pool = 'curious'; this.transient('curious'); animation = 'waiting'; break;
        case 'unknown': pool = 'uncertainty'; this.transient('observant'); animation = 'review'; break;
        case 'rest': pool = 'farewell'; animation = 'idle'; break;
        case 'fatigue': pool = 'fatigue'; animation = 'waiting'; break;
        case 'late': pool = 'late'; animation = 'waiting'; break;
        case 'ambient': {
          if (!s.ambientEnabled || at - s.lastSpeechAt < 90000 || this.random() < 0.62) break;
          if (s.irritation >= 28) break;
          const localHour = new Date(at).getHours();
          const workDuration = at - s.startedAt;
          pool = workDuration > 90 * 60000 ? 'fatigue' : (localHour >= 23 || localHour < 5) ? 'late' : this.random() < 0.035 && s.familiarity >= 12 ? 'rare' : this.snapshot().mood === 'observant' ? 'observant' : 'idle';
          break;
        }
        default: return { type, line: null, animation: 'idle', snapshot: this.snapshot(), unsupported: true };
      }
      s.lastSeen = at;
      const line = pool ? this.choose(pool) : null;
      const result = { type, line, animation, hold, snapshot: this.snapshot(), at };
      if (type !== 'ambient' || line) {
        s.history.push({ type, text: line ? line.text : null, mood: result.snapshot.mood, at });
        s.history = s.history.slice(-60);
      }
      return result;
    }
    export() {
      const s = this.state;
      return { version: 1, irritation: s.irritation, familiarity: s.familiarity, lastMoodAt: s.lastMoodAt, lastSeen: s.lastSeen, lastRareAt: Number.isFinite(s.lastRareAt) ? s.lastRareAt : null, lastTopicAt: Number.isFinite(s.lastTopicAt) ? s.lastTopicAt : null, ambientEnabled: s.ambientEnabled, used: { ...s.used }, recent: [...s.recent] };
    }
  }
  const api = { Companion, MOOD_LABELS };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.YochlolEngine = api;
})(typeof window !== 'undefined' ? window : this);
