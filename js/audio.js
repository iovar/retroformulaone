export class Audio {
  context = null;
  buffer = null;
  loaded = false;

  /**
   * filename: string
   * markers: { [key: string]: { start: number, end: number } }
   */
  constructor(filename, markers) {
    this.markers = markers;
    this.filename = filename;
//    this.init();
  }

  init() {
    try {
      this.context = new AudioContext();
    }
    catch (e) {
      console.error('Failed to initialize audio context', e.stacktrace);
    }
  }

  async load() {
    if (!this.context) {
      this.init();
    }
    if(this.buffer !== null) {
      return;
    }

    const file = await fetch(this.filename);
    const raw = await file.arrayBuffer();
    await this.context.decodeAudioData(raw, (data) => this.buffer = data);
  }

  async play(sound) {
    if(!this.loaded) {
      this.loaded = true;
      await this.load();
      return;
    }

    const { start, end } = this.markers[sound] || { start: 0, end: 0 };
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.context.destination);
    source.start(0, start, end - start);
  }
};
const markers = [
    [0,0.3], //roll
    [2,2.3], //move
    [4,4.3], //lose life
    [6,7.6], //game over
    [9,12.6] //game win
];
const filename = 'audio/sounds.mp3';

export const audio = new Audio(filename, markers);

