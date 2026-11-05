/* Pure musical rules: no browser, sound, or interface dependencies. */
globalThis.ChaosMusic = (() => {
  const scale = [0, 2, 4, 5, 7, 9, 11];
  const names = ['C major', 'D minor', 'E minor', 'F major', 'G major', 'A minor', 'B diminished'];
  function chord(degree) {
    if (!Number.isInteger(degree) || degree < 1 || degree > 7) throw new RangeError('Degree must be 1–7');
    return [0, 2, 4].map(step => {
      const index = degree - 1 + step;
      return 60 + scale[index % 7] + 12 * Math.floor(index / 7);
    });
  }
  function result(degree, enabled, offsets) {
    if (!Array.isArray(offsets) || offsets.length !== 3 || offsets.some(x => !Number.isInteger(x) || x < -2 || x > 2)) throw new RangeError('Three octave offsets from −2 to +2 are required');
    const original = chord(degree);
    const notes = original.map((note, i) => note + (enabled ? offsets[i] * 12 : 0));
    return { degree, name: names[degree - 1], original, notes, offsets: enabled ? [...offsets] : [0, 0, 0] };
  }
  const noteName = midi => ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'][midi % 12] + (Math.floor(midi / 12) - 1);
  return { chord, result, noteName, frequency: midi => 440 * 2 ** ((midi - 69) / 12) };
})();
