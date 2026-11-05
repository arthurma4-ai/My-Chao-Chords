(() => {
  const $ = id => document.getElementById(id);
  const audio = new ChaosAudio();
  const numerals = ['١', '٢', '٣', '٤', '٥', '٦', '٧'];
  const offsets = [0, 0, 0];
  const held = new Set();
  let spread = false;
  let owner = null;
  let generation = 0;
  const padButtons = [];
  const status = message => { $('status').textContent = message; };
  function release(source) {
    held.delete(source);
    if (owner !== source) return;
    generation++; owner = null; audio.stop();
    padButtons.forEach(pad => { pad.classList.remove('playing'); pad.setAttribute('aria-pressed', 'false'); });
    status('Released · ready for the next chord.');
  }
  function silence() {
    generation++; owner = null; held.clear(); audio.stop(true);
    padButtons.forEach(pad => { pad.classList.remove('playing'); pad.setAttribute('aria-pressed', 'false'); });
    status('All notes stopped.');
  }
  async function press(degree, source) {
    if (held.has(source)) return;
    held.add(source); owner = source;
    const ticket = ++generation;
    // Snapshot settings at the press, even if enabling audio takes a moment.
    const result = ChaosMusic.result(degree, spread, offsets);
    audio.stop();
    padButtons.forEach(pad => { pad.classList.remove('playing'); pad.setAttribute('aria-pressed', 'false'); });
    try {
      await audio.enable();
      if (ticket !== generation || owner !== source || !held.has(source)) return;
      $('start').textContent = 'Sound enabled';
      audio.play(result.notes);
      padButtons[degree - 1].classList.add('playing');
      padButtons[degree - 1].setAttribute('aria-pressed', 'true');
      $('original').textContent = result.name + ' · ' + result.original.map(ChaosMusic.noteName).join(' – ');
      $('output').textContent = result.notes.map(ChaosMusic.noteName).join(' – ');
      const changes = result.offsets.flatMap((offset, i) => offset ? [`Note ${i + 1}: ${ChaosMusic.noteName(result.original[i])} → ${ChaosMusic.noteName(result.notes[i])} (${offset > 0 ? '+' : '−'}${Math.abs(offset)} octave${Math.abs(offset) === 1 ? '' : 's'})`] : []);
      $('explanation').textContent = changes.length ? changes.join('. ') + '. Same chord tones, new spacing.' : `Pad ${degree} selects ${result.name}. ${spread ? 'All Spread wheels are at 0, so the notes stay unchanged.' : 'Spread is off: the original chord plays.'}`;
      status(`Playing ${result.name} · hold to sustain.`);
    } catch (error) { if (ticket === generation) { silence(); status(error.message); } }
  }
  numerals.forEach((numeral, index) => {
    const pad = document.createElement('button');
    pad.className = 'pad';
    pad.style.left = `${9.8 + index * 11.55}%`;
    pad.innerHTML = `<span>${numeral}</span>`;
    pad.setAttribute('aria-label', `Degree ${index + 1}: ${ChaosMusic.result(index + 1, false, offsets).name}. Hold to play.`);
    pad.setAttribute('aria-pressed', 'false');
    pad.title = `Hold to play degree ${index + 1} (keyboard ${index + 1})`;
    pad.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault(); pad.focus({ preventScroll: true });
      pad.setPointerCapture(event.pointerId);
      press(index + 1, `pointer:${event.pointerId}`);
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) pad.addEventListener(type, event => release(`pointer:${event.pointerId}`));
    pad.addEventListener('keydown', event => {
      if ([' ', 'Enter'].includes(event.key)) { event.preventDefault(); if (!event.repeat) press(index + 1, `focused:${index}`); }
    });
    pad.addEventListener('keyup', event => {
      if ([' ', 'Enter'].includes(event.key)) { event.preventDefault(); release(`focused:${index}`); }
    });
    pad.addEventListener('blur', () => release(`focused:${index}`));
    $('pads').append(pad); padButtons.push(pad);
  });
  offsets.forEach((_, index) => {
    const wheel = document.createElement('div');
    wheel.className = 'wheel'; wheel.style.left = `${31.7 + index * 7.57}%`;
    wheel.innerHTML = `<button class="step up" aria-label="Raise note ${index + 1} one octave">▴</button><div class="value" role="spinbutton" tabindex="0" aria-label="Note ${index + 1} octave offset" aria-valuemin="-2" aria-valuemax="2" aria-valuenow="0">0</div><button class="step down" aria-label="Lower note ${index + 1} one octave">▾</button>`;
    const value = wheel.querySelector('.value');
    function adjust(delta) {
      offsets[index] = Math.max(-2, Math.min(2, offsets[index] + delta));
      value.textContent = offsets[index] > 0 ? `+${offsets[index]}` : offsets[index];
      value.setAttribute('aria-valuenow', offsets[index]);
      value.setAttribute('aria-valuetext', `${offsets[index]} octaves`);
      status(`Note ${index + 1}: ${offsets[index]} octaves. ${spread ? 'Applies to the next chord.' : 'Enable Spread to hear the change.'}`);
    }
    wheel.querySelector('.up').addEventListener('click', () => adjust(1));
    wheel.querySelector('.down').addEventListener('click', () => adjust(-1));
    value.addEventListener('keydown', event => {
      if (['ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) {
        event.preventDefault(); adjust(event.key === 'Home' ? -offsets[index] : event.key === 'ArrowUp' ? 1 : -1);
      }
    });
    wheel.addEventListener('wheel', event => { event.preventDefault(); adjust(event.deltaY < 0 ? 1 : -1); }, { passive: false });
    $('wheels').append(wheel);
  });
  $('spread').addEventListener('click', () => {
    spread = !spread;
    $('spread').setAttribute('aria-pressed', String(spread));
    $('spread').setAttribute('aria-label', `${spread ? 'Disable' : 'Enable'} Spread`);
    $('spread-state').textContent = spread ? 'ON' : 'OFF';
    document.querySelector('.instrument').classList.toggle('spread-on', spread);
    status(`Spread ${spread ? 'on' : 'off'}. Applies to the next chord; wheel settings are remembered.`);
  });
  $('start').addEventListener('click', async () => {
    try { await audio.enable(); $('start').textContent = 'Sound enabled'; status('Ready. Hold a pad or keyboard key 1–7.'); }
    catch (error) { status(error.message); }
  });
  $('stop').addEventListener('click', silence);
  $('volume').addEventListener('input', event => audio.setVolume(Number(event.target.value) / 100));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') { silence(); return; }
    if (event.ctrlKey || event.metaKey || event.altKey || event.target.matches('input, select, textarea, [role="spinbutton"]')) return;
    if (/^[1-7]$/.test(event.key)) { event.preventDefault(); if (!event.repeat) press(Number(event.key), `key:${event.code}`); }
  });
  window.addEventListener('keyup', event => release(`key:${event.code}`));
  window.addEventListener('blur', silence);
  window.addEventListener('pagehide', silence);
  document.addEventListener('visibilitychange', () => { if (document.hidden) silence(); });
})();
