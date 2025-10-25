export default class AudioService {
  constructor() {
    // Start unmuted
    this.muted = false;
    this.sounds = new Map();
  }

  preload(fileNames) {
    for (const fileName of fileNames) {
      if (!this.sounds.has(fileName)) {
        // Create a new Audio object and add it to the cache
        const sound = new Audio(`audio/${fileName}.mp3`);
        this.sounds.set(fileName, sound);
      }
    }
  }

  playAudio(fileName) {
    if (this.muted) return;

    // Retrieve cached sound
    const sound = this.sounds.get(fileName);
    if (sound) {
      // Set audio to start from beginning
      sound.currentTime = 0;
      sound.play();
    } else {
      // Cache the file if not already cached
      console.warn(`${fileName} was not cached`);
      const newSound = new Audio(`audio/${fileName}.mp3`);
      this.sounds.set(fileName, newSound);
      newSound.play();
    }
  }
}
