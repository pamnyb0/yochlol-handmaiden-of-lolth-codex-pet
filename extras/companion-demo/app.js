(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY = 'yochlol-companion-v1';
  let saved = null, storageAvailable = true;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { storageAvailable = false; }
  let remember = saved ? saved.remember !== false : true;
  let reduced = saved ? saved.reduced === true : matchMedia('(prefers-reduced-motion: reduce)').matches;
  let engine = new YochlolEngine.Companion(YochlolDialogue, { saved: saved && saved.engine });
  let rehearsal = null, sceneTimers = [], speechTimer = null;
  let transient = null, workActive = false, pointer = null, lastPointerAt = 0;
  let lastActivity = Date.now(), hiddenAt = null, lastIdleAttempt = Date.now();
  let petPosition = null, drag = null, suppressClick = false, imageReady = false;
  let previousFrameKey = '', lastFrameAt = 0, frameIndex = 0;
  const stage = $('stage'), creature = $('creature'), position = $('creature-position');
  const canvas = $('pet-canvas'), ctx = canvas.getContext('2d');
  const sprite = new Image();
  const rows = { idle: 0, 'running-right': 1, 'running-left': 2, waving: 3, jumping: 4, failed: 5, waiting: 6, running: 7, review: 8 };
  const durations = {
    idle: [280,110,110,140,140,320],
    'running-right': [120,120,120,120,120,120,120,220],
    'running-left': [120,120,120,120,120,120,120,220],
    waving: [140,140,140,280], jumping: [140,140,140,140,280],
    failed: [140,140,140,140,140,140,140,240],
    waiting: [150,150,150,150,150,260], running: [120,120,120,120,120,220], review: [150,150,150,150,150,280]
  };
  function persist() {
    if (!storageAvailable || rehearsal) return;
    try {
      if (remember) localStorage.setItem(KEY, JSON.stringify({ remember, reduced, engine: engine.export() }));
      else localStorage.setItem(KEY, JSON.stringify({ remember: false, reduced }));
    } catch (_) {
      storageAvailable = false;
      $('storage-note').textContent = 'Browser storage is unavailable; she remembers this visit only. Your messages still remain on this machine.';
    }
  }
  function refreshMood() {
    const snapshot = engine.tick();
    $('mood').textContent = snapshot.label;
    document.body.dataset.mood = snapshot.mood;
    $('creature').setAttribute('aria-description', snapshot.label + '. Repeated touches test her patience.');
  }
  function history(result) {
    if (!result.line) return;
    const li = document.createElement('li');
    const small = document.createElement('small');
    small.textContent = (rehearsal ? 'REHEARSAL · ' : '') + result.snapshot.label.toUpperCase();
    const line = document.createElement('span');
    line.textContent = result.line.text;
    li.append(small, line);
    $('history-list').prepend(li);
    while ($('history-list').children.length > 30) $('history-list').lastElementChild.remove();
  }
  function say(result) {
    refreshMood();
    if (result.animation) transient = { state: result.animation, until: Date.now() + (result.hold ? 7000 : 3500), hold: result.hold };
    if (result.line) {
      clearTimeout(speechTimer);
      $('speech-text').textContent = result.line.text;
      $('speech').classList.remove('quiet');
      $('silence').hidden = false;
      history(result);
      speechTimer = setTimeout(silence, Math.max(16000, result.line.text.length * 85));
    }
    persist();
  }
  function silence() {
    clearTimeout(speechTimer);
    $('speech').classList.add('quiet');
    $('silence').hidden = true;
  }
  function dispatch(type, payload = {}) {
    lastActivity = Date.now();
    if (type === 'work') workActive = true;
    if (['failure','success','rest'].includes(type)) workActive = false;
    say(engine.event(type, payload));
  }
  function noteActivity() {
    const at = Date.now(), away = at - lastActivity;
    lastActivity = at;
    if (!rehearsal && away >= 120000) say(engine.event('return', { awayMs: away }));
  }
  function direction(at) {
    if (!pointer || at - lastPointerAt > 1800 || document.hidden || reduced) return null;
    const box = creature.getBoundingClientRect();
    // Eye level and lower-body anchor follow the actual atlas registration.
    const eye = { x: box.left + box.width * .5, y: box.top + box.height * .38 };
    const dx = pointer.x - eye.x, dy = pointer.y - eye.y;
    if (Math.hypot(dx, dy) < box.width * .13) return null;
    const degrees = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
    return Math.round(degrees / 22.5) % 16;
  }
  function render(at) {
    if (imageReady && !document.hidden) {
      let row = rows.idle, col = 0;
      const mood = engine.snapshot().mood;
      const look = direction(Date.now());
      let state = workActive ? 'running' : mood === 'curious' ? 'waiting' : 'idle';
      let hold = mood === 'angry';
      if (transient && Date.now() < transient.until) { state = transient.state; hold = transient.hold || hold; }
      else transient = null;
      if (drag) state = drag.dx >= 0 ? 'running-right' : 'running-left';
      const key = state + ':' + hold;
      if (key !== previousFrameKey) { previousFrameKey = key; frameIndex = 0; lastFrameAt = at; }
      if (!reduced && !hold && at - lastFrameAt >= durations[state][frameIndex]) {
        frameIndex = (frameIndex + 1) % durations[state].length;
        lastFrameAt = at;
      }
      row = rows[state]; col = reduced || hold ? 0 : frameIndex;
      if (look !== null && !drag && !transient && !workActive) { row = 9 + Math.floor(look / 8); col = look % 8; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(sprite, col*192, row*208, 192, 208, 0, 0, 384, 416);
    }
    requestAnimationFrame(render);
  }
  sprite.onload = () => {
    imageReady = true;
    $('loading').hidden = true;
    const gap = saved && saved.engine ? Date.now() - saved.engine.lastSeen : 0;
    say(engine.event(gap >= 120000 ? 'return' : 'greeting', { awayMs: gap }));
    requestAnimationFrame(render);
  };
  sprite.onerror = () => {
    $('loading').textContent = 'The artwork could not be opened. Keep this folder beside the yochlol-monster folder and open the companion again.';
    creature.disabled = true;
  };
  sprite.src = '../yochlol-monster/spritesheet.png';
  $('silence').addEventListener('click', silence);
  creature.addEventListener('click', () => {
    if (suppressClick) { suppressClick = false; return; }
    noteActivity(); dispatch('click');
  });
  creature.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const box = position.getBoundingClientRect(), stageBox = stage.getBoundingClientRect();
    drag = { startX: event.clientX, startY: event.clientY, left: box.left-stageBox.left, top: box.top-stageBox.top, dx: 0, moved: false, pointerId: event.pointerId };
    creature.setPointerCapture(event.pointerId);
  });
  creature.addEventListener('pointermove', event => {
    if (!drag) return;
    const dx = event.clientX-drag.startX, dy = event.clientY-drag.startY;
    if (!drag.moved && Math.hypot(dx,dy) < 7) return;
    drag.moved = true; drag.dx = dx;
    const width = position.offsetWidth, height = position.offsetHeight;
    petPosition = {
      left: Math.max(-width*.15, Math.min(stage.clientWidth-width*.85, drag.left+dx)),
      top: Math.max(-height*.22, Math.min(stage.clientHeight-height*.65, drag.top+dy))
    };
    position.style.left = petPosition.left+'px';
    position.style.top = petPosition.top+'px';
    position.style.bottom = 'auto'; position.style.transform = 'none';
    creature.classList.add('dragging');
  });
  function endDrag(event, cancelled = false) {
    if (!drag) return;
    const moved = drag.moved;
    if (creature.hasPointerCapture(event.pointerId)) creature.releasePointerCapture(event.pointerId);
    drag = null; creature.classList.remove('dragging');
    if (moved) { suppressClick = true; if (!cancelled) dispatch('drag'); }
  }
  creature.addEventListener('pointerup', event => endDrag(event));
  creature.addEventListener('pointercancel', event => endDrag(event, true));
  creature.addEventListener('lostpointercapture', () => { drag = null; creature.classList.remove('dragging'); });
  creature.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const box = position.getBoundingClientRect(), stageBox = stage.getBoundingClientRect();
    const dx = event.key === 'ArrowLeft' ? -15 : event.key === 'ArrowRight' ? 15 : 0;
    const dy = event.key === 'ArrowUp' ? -15 : event.key === 'ArrowDown' ? 15 : 0;
    position.style.left = Math.max(-position.offsetWidth*.15,Math.min(stage.clientWidth-position.offsetWidth*.85,box.left-stageBox.left+dx))+'px';
    position.style.top = Math.max(-position.offsetHeight*.22,Math.min(stage.clientHeight-position.offsetHeight*.65,box.top-stageBox.top+dy))+'px';
    position.style.bottom='auto'; position.style.transform='none'; dispatch('drag');
  });
  window.addEventListener('pointermove', event => {
    pointer = { x: event.clientX, y: event.clientY }; lastPointerAt = Date.now(); noteActivity();
  }, { passive: true });
  window.addEventListener('keydown', noteActivity);
  window.addEventListener('resize', () => {
    position.style.left='50%';position.style.top='';position.style.bottom='0';position.style.transform='translateX(-50%)';petPosition=null;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { hiddenAt = Date.now(); engine.state.lastSeen = hiddenAt; persist(); }
    else { const away = hiddenAt === null ? 0 : Date.now()-hiddenAt; hiddenAt=null;lastActivity=Date.now();if(away>=120000&&!rehearsal)say(engine.event('return',{awayMs:away})); }
  });
  window.addEventListener('pagehide', () => { engine.state.lastSeen=Date.now(); persist(); });
  document.querySelectorAll('[data-event]').forEach(button => button.addEventListener('click', () => {
    const type=button.dataset.event;
    if(type==='changed-failure')dispatch('failure',{changed:true,signature:'revision-'+Date.now()});
    else if(type==='accidental-success')dispatch('success',{understood:false});
    else dispatch(type);
  }));
  $('conversation-form').addEventListener('submit', event => {
    event.preventDefault();
    const text=$('message').value.trim().toLowerCase();
    if(!text)return;
    let type = 'question';
    if(/\b(lolth|spider queen|queen of spiders|lady lolth)\b/.test(text))type='lolth';
    else if(/\b(cute|adorable|sweet little)\b/.test(text))type='cute';
    else if(/\b(beautiful|beauty|handsome|lovely)\b/.test(text))type='compliment';
    else if(/\b(matron|matron mother)\b/.test(text))type='matron';
    else if(/\b(priestess|arach-tinilith|cleric)\b/.test(text))type='priestess';
    else if(/\b(menzoberranzan|city of spiders|narbondel|tier breche)\b/.test(text))type='menzoberranzan';
    else if(/\b(abyss|abyssal|demonweb pits)\b/.test(text))type='abyss';
    else if(/\b(summon|summoned|summoning|ritual|brazier|incense)\b/.test(text))type='summoning';
    else if(/\b(afraid|fear|frightened|scared|terror)\b/.test(text))type='fear';
    else if(/\b(drow|dark elf|dark elves|iblith)\b/.test(text))type='drow';
    else if(/\b(form|shape|shapechange|humanoid form|drow form|spider form|mist form|gaseous form|vapor form)\b/.test(text))type='form';
    else if(/\b(stupid|ugly|idiot|hate you|useless)\b/.test(text))type='insult';
    else if(/\b(certain|definitely|obviously|sure|must mean|i know)\b/.test(text))type='certainty';
    else if(/\b(wrong|corrected|mistake|changed my mind|you were right)\b/.test(text))type='correction';
    else if(/\b(tired|sleep|rest|exhausted)\b/.test(text))type='fatigue';
    else if(/\b(bye|goodnight|leaving)\b/.test(text))type='rest';
    else if(/\b(failed|error|broken|didn.t work)\b/.test(text))type='failure';
    else if(/\b(success|worked|fixed|succeeded)\b/.test(text))type='success';
    else if(!/\b(why|how|what|advice|help|think|should|reason|decide)\b/.test(text))type='unknown';
    $('message').value=''; dispatch(type);
  });
  function compact(enabled) {
    document.body.classList.toggle('compact',enabled);
    $('return-workspace').hidden=!enabled;
    position.style.left='50%';position.style.top='';position.style.bottom='0';position.style.transform='translateX(-50%)';
  }
  $('compact').addEventListener('click',()=>compact(true));
  $('return-workspace').addEventListener('click',()=>compact(false));
  if(new URLSearchParams(location.search).has('compact'))compact(true);
  $('settings-open').addEventListener('click',()=>{
    $('quiet').checked=!engine.state.ambientEnabled;
    $('remember').checked=remember;$('reduced').checked=reduced;$('settings').showModal();
  });
  $('quiet').addEventListener('change',()=>{engine.state.ambientEnabled=!$('quiet').checked;persist();});
  $('remember').addEventListener('change',()=>{remember=$('remember').checked;persist();});
  $('reduced').addEventListener('change',()=>{reduced=$('reduced').checked;persist();});
  $('forget').addEventListener('click',()=>{
    endScene(false);
    engine=new YochlolEngine.Companion(YochlolDialogue);
    engine.state.ambientEnabled=!$('quiet').checked;
    $('history-list').replaceChildren();workActive=false;transient=null;
    say(engine.event('greeting'));$('settings').close();
  });
  function endScene(announce=true) {
    sceneTimers.forEach(clearTimeout);sceneTimers=[];
    if(rehearsal){engine=rehearsal.engine;workActive=rehearsal.workActive;rehearsal=null;}
    $('scene-end').hidden=true;$('scene-status').textContent='In your company';
    refreshMood();transient=null;
    if(announce){silence();persist();}
  }
  function scene(name) {
    endScene(false);
    rehearsal={engine,workActive};
    engine=new YochlolEngine.Companion(YochlolDialogue,{saved:rehearsal.engine.export()});
    workActive=false;
    $('scene-end').hidden=false;$('scene-status').textContent='Rehearsal in progress';
    const sequences={
      clicks:[['click'],['click'],['click'],['click'],['click'],['click']],
      failure:[['work'],['failure'],['failure'],['failure',{changed:true,signature:'revised'}],['success',{understood:true}]],
      return:[['return',{awayMs:3*3600000}]],late:[['late']],fatigue:[['fatigue']],correction:[['certainty'],['correction']]
    };
    (sequences[name]||[]).forEach(([type,payload],index)=>{
      sceneTimers.push(setTimeout(()=>dispatch(type,payload||{}),index*2300));
    });
  }
  document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>scene(button.dataset.scene)));
  $('scene-end').addEventListener('click',()=>endScene());
  setInterval(()=>{
    refreshMood();
    if(document.hidden||rehearsal)return;
    engine.state.lastSeen=Date.now();
    if(Date.now()-lastIdleAttempt>=60000){lastIdleAttempt=Date.now();say(engine.event('ambient'));}
    persist();
  },5000);
  if(!storageAvailable)$('storage-note').textContent='Browser storage is unavailable; her memory lasts for this visit. Messages are never sent elsewhere.';
})();
