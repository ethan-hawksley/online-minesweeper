export default class MenuBestScore {
  constructor(audioService, databaseService) {
    // Store arguments as attributes
    this.audioService = audioService;
    this.databaseService = databaseService;

    this.element = document.createElement('button');
    this.element.className = 'menu-button';
    this.element.textContent = 'Show Best Scores';
    this.element.addEventListener('click', () => {
      audioService.playAudio('button-click');
      this.displayBestScores();
    });

    this.bestScoresModal = document.createElement('dialog');
    this.bestScoresModal.className = 'menu-modal';

    this.closeModalButton = document.createElement('button');
    this.closeModalButton.className = 'menu-button';
    // X representing the close button
    this.closeModalButton.textContent = 'X';
    this.closeModalButton.addEventListener('click', () => {
      audioService.playAudio('button-click');
      // Close the modal when pressed
      this.bestScoresModal.close();
    });

    // Create an unpopulated list
    this.bestScoresList = document.createElement('ul');
    this.bestScoresList.className = 'menu-list';

    this.bestScoresModal.append(this.closeModalButton, this.bestScoresList);
    // Place modal hidden on page so it can be revealed later
    document.body.append(this.bestScoresModal);
  }

  async displayBestScores() {
    const scores = await this.databaseService.getBestScores();
    // Create temporary fragment to store the list
    const frag = document.createDocumentFragment();
    for (const score of scores) {
      // Create item for each score in the list
      const listItem = document.createElement('li');
      listItem.className = 'menu-list-item';
      listItem.textContent = `${score.mode} ${score.difficulty}: ${score.score}`;
      frag.append(listItem);
    }
    // Replace existing items
    this.bestScoresList.replaceChildren(frag);
    // Show modal
    this.bestScoresModal.showModal();
  }
}
