import './music.js';
import './audio.js';

let checks = 0;
function check(condition, message) { if (!condition) throw new Error(message); checks++; }
function equal(actual, expected, message) { check(JSON.stringify(actual) === JSON.stringify(expected), message); }
const expected = [[60,64,67],[62,65,69],[64,67,71],[65,69,72],[67,71,74],[69,72,76],[71,74,77]];
for (let degree = 1; degree <= 7; degree++) {
  equal(ChaosMusic.chord(degree), expected[degree - 1], `Degree ${degree}`);
  for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) for (let c = -2; c <= 2; c++) {
    const offsets = [a,b,c];
    const result = ChaosMusic.result(degree, true, offsets);
    equal(result.notes, expected[degree - 1].map((n,i) => n + offsets[i] * 12), 'Octave mapping');
    equal(ChaosMusic.result(degree, false, offsets).notes, expected[degree - 1], 'Bypass restores original');
    equal(offsets, [a,b,c], 'Settings remain unchanged');
    check(result.notes.every((n,i) => (n - result.original[i]) % 12 === 0), 'Preserve harmonic identity');
  }
}
equal(ChaosMusic.result(1,true,[2,-2,0]).notes, [84,40,67], 'Crossing preserves original note identities');
equal([60,64,67].map(ChaosMusic.noteName), ['C4','E4','G4'], 'Readable note names');
check(ChaosMusic.frequency(69) === 440, 'A4 reference tuning');
for (const invalid of [0,8,-1,1.5]) {
  let threw = false; try { ChaosMusic.chord(invalid); } catch { threw = true; }
  check(threw, 'Reject invalid degree');
}

// Simulated audio graph: verify every oscillator is stopped and disconnected.
class Param { setValueAtTime() {} linearRampToValueAtTime() {} setTargetAtTime() {} cancelScheduledValues() {} }
class Gain { constructor() { this.gain = new Param(); } connect() {} disconnect() { this.disconnected = true; } }
class Oscillator {
  constructor() { this.frequency = {}; this.stops = 0; }
  connect() {} disconnect() { this.disconnected = true; }
  start() {} stop() { this.stops++; }
}
class Context {
  constructor() { this.currentTime = 0; this.state = 'suspended'; this.destination = {}; }
  createGain() { return new Gain(); }
  createOscillator() { return new Oscillator(); }
  async resume() { this.state = 'running'; }
}
globalThis.window = { AudioContext: Context };
const audio = new ChaosAudio();
await audio.enable();
audio.play([60,64,67]);
const first = [...audio.voices][0];
check(first.oscillators.length === 3, 'Three voices per triad');
audio.play([65,69,72]);
check(first.oscillators.every(v => v.oscillator.stops === 1), 'New chord releases old oscillators');
audio.stop(true); audio.stop(true);
check([...audio.voices].every(v => v.oscillators.every(o => o.oscillator.stops === 1)), 'Repeated stop is safe');
for (const voice of [...audio.voices]) for (const item of voice.oscillators) item.oscillator.onended();
check(audio.voices.size === 0, 'Released voices removed');
check(first.gain.disconnected, 'Released gain disconnected');
console.log(`PASS: ${checks} checks (all seven chords, all 875 Spread combinations, bypass, pitch crossing, and simulated audio release).`);
