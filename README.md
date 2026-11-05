# Chaos Chords · First playable prototype

## Open it

No install or build is needed. In Finder, open this project folder and double-click `index.html`. It opens in your default browser. Safari or Chrome is recommended. Click **Enable sound**.

For a local server instead: open Terminal in this folder, enter `python3 -m http.server 8080 --bind 127.0.0.1`, then visit http://127.0.0.1:8080. Stop the server with Control+C.

## Play it

- Hold a stone pad with the mouse, or hold a keyboard key **1–7**. Release to stop.
- A newly pressed pad replaces the previous chord. Releasing an older held pad does not stop the newer one. Releasing the newest pad stops sound; older pads do not resume.
- Click **Spread** to turn it on. Use the small arrows on each combination wheel, scroll over a wheel, or Tab to its value and use Up/Down. Home resets a focused wheel to 0.
- Each wheel controls one original chord note, moving it -2, -1, 0, +1, or +2 octaves. The notes retain their identity even when they cross pitches.
- Start with **0 / +1 / 0** to hear a wider chord. Try **-1 / 0 / +1** for an even wider range. Turn Spread off to hear the original; settings are remembered until you reload.
- Changes apply to the next pad press. **Esc** or **Stop all sound** releases every note. Switching windows or hiding the page also stops notes.
- The preset is fixed at **C major triads**. Preset amulet and Borrow are visual placeholders and marked as coming later.

## How it is built

`music.js` calculates notes without knowing anything about the screen or speakers. `audio.js` turns those notes into a quiet triangle-wave synth with a short fade at the start and end. `app.js` connects input to those two pieces and tracks which press owns the current chord. `style.css` layers live controls over the approved concept image.

This first prototype uses concept artwork as its backplate. The controls are live; the decorative amulet and cracks are static. This is a browser instrument, not yet a DAW plugin or MIDI output tool.
