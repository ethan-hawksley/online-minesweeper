export default class MenuHeader {
  constructor() {
    this.element = document.createElement('div');

    // Create title for main menu
    const title = document.createElement('h1');
    title.textContent = 'MineDuo';
    // Add empty splash text to be filled later
    this.splashText = document.createElement('h2');
    this.splashText.id = 'splash-text';

    this.element.append(title, this.splashText);

    this.loadSplashTextAsync();
  }

  async loadSplashTextAsync() {
    try {
      // Load joke from external API
      const response = await fetch('https://icanhazdadjoke.com/', {
        headers: {
          Accept: 'application/json',
        },
      });
      // Parse json
      const responseData = await response.json();

      // Display the joke on the main menu
      this.splashText.textContent = responseData?.joke;
    } catch (e) {
      console.error('Error whilst fetching splash text', e);
    }
  }
}
