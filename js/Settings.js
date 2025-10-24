export default class Settings {
  constructor() {
    // Retrieve whether dark mode is set already
    this.darkMode = localStorage.getItem('darkMode') === 'true';

    // Create element to encapsulate the HTML for the class
    this.element = document.createElement('div');

    this.darkModeButton = document.createElement('button');
    this.darkModeButton.className = 'menu-button';
    // Toggle dark mode whenever clicked
    this.darkModeButton.addEventListener('click', () => {
      this.toggleDarkMode();
    });

    this.updateDarkModeUI();

    this.element.append(this.darkModeButton);
  }

  toggleDarkMode() {
    // Invert the dark mode state
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());
    this.updateDarkModeUI();
  }

  updateDarkModeUI() {
    // Set the body to have the dark mode class if the game is in dark mode
    document.body.classList.toggle('dark-mode', this.darkMode);
    // Update the dark mode button so that it reflects the current state
    this.darkModeButton.textContent = `Dark Mode ${this.darkMode ? 'On' : 'Off'}`;
  }
}
