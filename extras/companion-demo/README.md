# Yochlol companion

Open `index.html` directly, or double-click **Open companion.cmd** to serve it locally in your usual browser. Keep the `yochlol-companion` and `yochlol-monster` folders beside each other. The launcher uses the existing bundled Python runtime and opens a loopback address; it installs nothing. Close its terminal to stop the local server.

Touch Yochlol several times within twenty seconds to test her patience; irritation then settles gradually over several minutes. Drag her within the chamber, or focus her and use the arrow keys. Her eye-bearing upper flesh follows the pointer in sixteen directions. **Companion view** provides a smaller interface for keeping her beside your work.

Tell her whether an attempt failed, whether you revised it, and whether you understand a successful result. She distinguishes those situations and keeps the sequence of failures within the current visit. The written-message box routes subjects to an authored repertoire rather than to an AI service. It recognises advice, certainty, corrections, appearance, Lolth, fatigue and task outcomes. Other questions receive an admission of uncertainty. User messages are never retained or transmitted.

The dialogue library contains common, uncommon and rare replies. Each line has a cooldown, recent replies are excluded, exhausted pools produce silence, and rare remarks share a daily cooldown. Repeated clicking and dragging have ordered escalation pools. Quiet company disables spontaneous remarks while keeping direct replies available. The settings also offer reduced motion and a fresh acquaintance.

**Try a scene** rehearses sequences without changing the saved relationship. End the rehearsal to return to her previous mood. Returning to the page after at least two minutes can prompt a greeting; three hours selects the longer-absence pool. Late-hour comments use the computer's local clock, and prolonged-session comments refer only to the time this page has been open.

This prototype runs inside its browser window. It does not float over other programs, read their contents, receive native Codex task events, manipulate the system cursor, use a microphone, or generate speech. Her name remains Yochlol until you choose an individual name. New humanoid, spider and vapor forms would require additional artwork; the prototype uses the approved grotesque form throughout.

## Files

- `dialogue.js`: the authored character repertoire and rarity rules.
- `engine.js`: mood decay, escalation, contextual selection and saved acquaintance.
- `app.js`: pointer behaviour, sprite playback, interaction controls and rehearsal isolation.
- `index.html` and `style.css`: the chamber and compact companion view.
- `tests.cjs`: deterministic interaction-sequence checks.

Run the tests with the bundled Node executable followed by the absolute path to `tests.cjs`.
