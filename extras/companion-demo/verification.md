# Verification

The companion engine passed all 13 deterministic checks, covering click and drag escalation, gradual mood decay, revised and repeated failures, understood and accidental success, absence, dialogue cooldowns, rare remarks, quiet mode and saved acquaintance validation. All 131 authored dialogue lines have unique identifiers. The browser application JavaScript passed Node's syntax check.

Interactive visual verification remains incomplete: the in-app browser timed out while connecting to the local HTTP server, including after session network permission was granted. Browser security also prohibits file URL navigation, so no alternative browser surface was used.

Open index.html in your usual browser, or double-click Open companion.cmd. The files reuse the sprite sheet in the adjacent yochlol-monster folder. Try a scene provides short demonstrations of escalation and task outcomes.

This is a browser companion prototype. Its dialogue does not run inside the native Pets renderer, and task outcomes are supplied through the visible controls.
