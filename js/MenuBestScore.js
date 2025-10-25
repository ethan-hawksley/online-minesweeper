export default class MenuBestScore {
  constructor(audioService, databaseService) {
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

    this.closeModalButton = document.createElement('button');
    this.closeModalButton.className = 'menu-button';
    this.closeModalButton.textContent = 'X';
    this.closeModalButton.addEventListener('click', () => {
      audioService.playAudio('button-click');
      this.bestScoresModal.close();
    });

    this.bestScoresList = document.createElement('ul');
    this.bestScoresList.className = 'menu-list';

    this.bestScoresModal.append(this.closeModalButton, this.bestScoresList);
    document.body.append(this.bestScoresModal);
  }

  async displayBestScores() {
    const scores = await this.databaseService.getBestScores();
    const frag = document.createDocumentFragment();
    for (const score of scores) {
      const listItem = document.createElement('li');
      listItem.className = 'menu-list-item';
      listItem.textContent = `${score.mode} ${score.difficulty}: ${score.score}`;
      frag.append(listItem);
    }
    this.bestScoresList.replaceChildren(frag);
    this.bestScoresModal.showModal();
  }
}

// this is the new testing facility