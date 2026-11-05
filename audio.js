/* A quiet built-in synth. Each voice owns its oscillators and releases them together. */
globalThis.ChaosAudio = class {
  constructor() { this.context = null; this.voices = new Set(); this.volume = .35; }
  async enable() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error('This browser does not support built-in audio. Try Safari or Chrome.');
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.volume * .28;
      this.master.connect(this.context.destination);
    }
    await this.context.resume();
    if (this.context.state !== 'running') throw new Error('Sound is paused. Click Enable sound again.');
  }
  setVolume(value) {
    this.volume = value;
    if (this.master) this.master.gain.setTargetAtTime(value * .28, this.context.currentTime, .015);
  }
  play(notes) {
    this.stop();
    if (!this.context || this.context.state !== 'running') return;
    const now = this.context.currentTime;
    const voice = { oscillators: [], gain: this.context.createGain(), stopped: false };
    voice.gain.gain.setValueAtTime(0, now);
    voice.gain.gain.linearRampToValueAtTime(1 / notes.length, now + .025);
    voice.gain.connect(this.master);
    for (const note of notes) {
      const oscillator = this.context.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.value = ChaosMusic.frequency(note);
      oscillator.connect(voice.gain);
      // Each oscillator reports its end so the shared gain can be disconnected.
      const item = { oscillator, ended: false };
      oscillator.onended = () => {
        item.ended = true; oscillator.disconnect();
        if (voice.oscillators.every(part => part.ended)) { voice.gain.disconnect(); this.voices.delete(voice); }
      };
      voice.oscillators.push(item);
      oscillator.start(now);
    }
    this.voices.add(voice);
  }
  stop(immediate = false) {
    if (!this.context) return;
    const now = this.context.currentTime;
    for (const voice of this.voices) {
      if (voice.stopped) continue;
      voice.stopped = true;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(0, now, immediate ? .003 : .015);
      for (const { oscillator } of voice.oscillators) oscillator.stop(now + (immediate ? .02 : .09));
    }
  }
};
