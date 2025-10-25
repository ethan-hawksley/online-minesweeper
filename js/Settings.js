export default class Settings {
  constructor(audioService) {
    this.audioService = audioService;
    // Retrieve whether dark mode is set already
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    // Retrieve whether the game is muted or not
    this.muted = localStorage.getItem('muted') === 'true';

    // Create element to encapsulate the HTML for the class
    this.element = document.createElement('div');

    this.darkModeButton = document.createElement('button');
    this.darkModeButton.className = 'menu-button';
    // Toggle dark mode whenever clicked
    this.darkModeButton.addEventListener('click', () => {
      // Give audio feedback
      this.audioService.playAudio('button-click');
      this.toggleDarkMode();
    });

    this.muteButton = document.createElement('button');
    this.muteButton.className = 'menu-button';
    // Toggle the muted state whenever clicked
    this.muteButton.addEventListener('click', () => {
      this.toggleMute();
      this.audioService.playAudio('button-click');
    });

    this.updateDarkMode();
    this.updateMute();

    this.element.append(this.darkModeButton, this.muteButton);
  }

  toggleDarkMode() {
    // Invert the dark mode state
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());
    this.updateDarkMode();
  }

  updateDarkMode() {
    // Set the body to have the dark mode class if the game is in dark mode
    document.body.classList.toggle('dark-mode', this.darkMode);
    // Update the dark mode button so that it reflects the current state
    this.darkModeButton.textContent = `Dark Mode ${this.darkMode ? 'On' : 'Off'}`;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('muted', this.muted.toString());
    this.updateMute();
  }

  updateMute() {
    this.audioService.muted = this.muted;
    // Update the mute button so it reflects the current state
    this.muteButton.textContent = this.muted ? 'Muted' : 'Unmuted';
  }
}
