# Chaos Chords

## Confirmed product decisions
- A playful chord tool with seven pads representing scale degrees 1–7, rather than fixed notes. Changing key preserves those relationships.
- Toggleable musical effects change chord composition.
- Music theory should feel like expressive chord mutation magic.
- Visual direction: mysterious and symbolic, inspired by temples and Egyptian lettering.
- The user is creative director and a coding beginner. Explain work in plain English and build in small, testable steps.
- Clarify unresolved musical and visual decisions before dependent implementation. Ask before core workflow changes, major rewrites, paid services, publishing, or destructive actions.
- Two layers: presets define original chords; mutations transform them. Disabling mutations restores the original result. Mutations persist across pads and combine through explicit, deterministic rules and documented order.
- First playable prototype: browser, built-in sound, C major triads, Spread mutation. Hold to play, release to stop; a new pad replaces the previous chord. Setting changes affect the next chord played.
- Approved visual direction: latest chunky gray-violet stone tablet mockup, round carved pads, bold symbols, stone puzzle amulet, violet glowing fractures and amber active-state light. Earlier sandstone and dark silver treatments were explorations.
- Latest visual direction: user wants a Skylanders-like stone tablet feel and supplied references of bold stone emblem medallions and a fractured magical circular tablet. Develop an original design informed by these references.
- A large preset amulet above seven numeral pads; Spread and Borrow symbolic controls below. The amulet includes dials and flip pieces that change preset conditions, like an ancient adventure puzzle.
- Approved mockup uses Eastern Arabic numerals ١ ٢ ٣ ٤ ٥ ٦ ٧ in left-to-right scale-degree order.
- Spread has three compact padlock-style combination wheels, one per original chord note. Each has five octave offsets: -2, -1, 0, +1, +2. Wheels track original note identity even if pitches cross. Spread toggle bypasses adjustments while remembering settings. Changes affect the next chord played. Defaults are 0 / 0 / 0 with Spread off.
- User approved the compact padlock-wheel mockup and authorized the first playable prototype.

## Current progress
- First browser prototype implemented in index.html, style.css, music.js, audio.js, and app.js. No dependencies or build required; index.html also opens directly from Finder.
- Approved artwork: design/chaos-chords-spread-lock-v3.png. Earlier iterations preserved. Live controls are layered over concept artwork; the preset mechanism and decorative fractures remain static.
- Built: seven C-major triad pads, mouse/touch and keyboard hold-to-play, one-chord ownership, built-in triangle synth, Spread toggle and three five-step wheels, volume, note explanations, Escape/Stop, and release on blur/page hiding. Wheels support arrows, keyboard, and scroll; no animated rolling yet.
- Amulet fixed at C major triads; Borrow unavailable. Nothing published; no DAW integration yet.
- Verified: all seven chord mappings, all 875 Spread combinations, bypass and note crossing, simulated oscillator cleanup; 14 input lifecycle checks including quick release during audio enable, input ownership, setting snapshots, bypass memory, pointer cancellation and hiding page. Tests: tests.mjs and input-tests.mjs.
- Local server responded HTTP 200 at http://127.0.0.1:8080. Chrome loaded the page and exposed all controls. Browser automation timed out and encountered changing browser state; final visual inspection and audible browser testing remain unverified.
- README.md provides exact opening and playing instructions.

## Suggestions, not decisions
- Proposed amulet windows: C / MAJOR / TRIADS. Exact dial and flip behavior is unconfirmed.
- Proposed symbols: outward spreading lines for Spread; eclipse/shadow for Borrow. These are original visual metaphors, not historical meanings.
- Borrow appears in the visual concept but its musical rule is not yet approved for implementation.

## Open decisions
- Eventual host music app, plugin format, framework, and MIDI output.
- Borrow rule and mutation combination order. Spread's three-dial octave rule is confirmed.
- Exact preset conditions and how amulet dials/flip pieces select them.
- Detailed interactions and animation of approved visual controls.
- Inputs 8, 9, and 0 remain undecided and outside first prototype.

## Next step
- User listening/play review: compare Spread off with 0 / +1 / 0, check release and wheel usability. Refine feel and visuals before adding preset selection or Borrow.
