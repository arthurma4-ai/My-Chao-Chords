import './music.js';

// Small event harness for the real app code; no sound or browser required.
class Element {
  constructor() {
    this.handlers = {}; this.attributes = {}; this.style = {}; this.children = []; this.parts = {};
    this.classList = { add() {}, remove() {}, toggle() {} };
  }
  addEventListener(type, handler) { (this.handlers[type] ??= []).push(handler); }
  async emit(type, extra = {}) {
    const event = { preventDefault() {}, target: this, ...extra };
    for (const handler of this.handlers[type] ?? []) handler(event);
    for (let i = 0; i < 5; i++) await Promise.resolve();
  }
  append(element) { this.children.push(element); }
  setAttribute(key,value) { this.attributes[key] = String(value); }
  querySelector(key) { return this.parts[key] ??= new Element(); }
  matches() { return false; }
  focus() {} setPointerCapture() {}
}
const elements = {};
const document = new Element();
document.getElementById = id => elements[id] ??= new Element();
document.createElement = () => new Element();
document.querySelector = key => elements[key] ??= new Element();
const window = new Element();
globalThis.document = document; globalThis.window = window;
let instance;
class Audio {
  constructor() { instance = this; this.played = []; this.stops = 0; }
  async enable() { if (this.pending) await this.pending; }
  play(notes) { this.played.push([...notes]); }
  stop() { this.stops++; }
  setVolume(value) { this.volume = value; }
}
globalThis.ChaosAudio = Audio;
await import('./app.js');
let checks = 0;
const check = (condition, message) => { if (!condition) throw new Error(message); checks++; };
const key = (type, n, more = {}) => window.emit(type, { key: String(n), code: `Digit${n}`, ...more });
await key('keydown', 1);
check(instance.played.at(-1).join() === '60,64,67', 'Keyboard plays first chord');
const playCount = instance.played.length;
await key('keydown',1,{repeat:true});
check(instance.played.length === playCount, 'Ignore held-key repetition');
await key('keydown', 2);
let stops = instance.stops;
await key('keyup', 1);
check(instance.stops === stops, 'Old release does not stop new chord');
await key('keyup', 2);
check(instance.stops === stops + 1, 'Current owner release stops chord');
const wheel = elements.wheels.children[1];
await wheel.parts['.up'].emit('click');
await elements.spread.emit('click');
await key('keydown', 1);
check(instance.played.at(-1).join() === '60,76,67', 'Spread wheel applied');
await wheel.parts['.up'].emit('click');
check(instance.played.at(-1).join() === '60,76,67', 'Held chord settings do not change');
await key('keyup',1);
await key('keydown',1);
check(instance.played.at(-1).join() === '60,88,67', 'Next chord gets changed settings');
await key('keyup',1);
await elements.spread.emit('click');
await key('keydown',1);
check(instance.played.at(-1).join() === '60,64,67', 'Bypass restores original');
await key('keyup',1);
await elements.spread.emit('click');
await key('keydown',1);
check(instance.played.at(-1).join() === '60,88,67', 'Bypass remembers wheel settings');
await window.emit('blur');
let resolve;
instance.pending = new Promise(done => { resolve = done; });
const count = instance.played.length;
await key('keydown',3);
await key('keyup',3);
resolve();
for (let i = 0; i < 8; i++) await Promise.resolve();
check(instance.played.length === count, 'Quick release while enabling audio cannot leave ghost notes');
instance.pending = null;
await key('keydown',4);
stops = instance.stops;
await window.emit('keydown', {key:'Escape'});
check(instance.stops > stops, 'Escape stops sound');
const escapedCount = instance.played.length;
await key('keydown',4,{repeat:true});
check(instance.played.length === escapedCount, 'Held-key repeats cannot undo emergency stop');
const pad = elements.pads.children[0];
await pad.emit('pointerdown', {button:0,pointerId:4});
stops = instance.stops;
await pad.emit('pointercancel', {pointerId:4});
check(instance.stops > stops, 'Cancelled pointer releases notes');
await key('keydown',5);
stops = instance.stops;
document.hidden = true;
await document.emit('visibilitychange');
check(instance.stops > stops, 'Hidden page releases notes');
console.log(`PASS: ${checks} input lifecycle checks against real app handlers.`);
