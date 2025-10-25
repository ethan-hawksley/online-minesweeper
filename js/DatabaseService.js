export default class DatabaseService {
  constructor() {
    // Attempt to open the database
    const request = indexedDB.open('MineDuoDB', 6);

    // If the database requires creation or upgrading
    request.addEventListener('upgradeneeded', (e) => {
      console.log('Creating or upgrading database');
      this.db = e.target.result;

      // Delete all existing stores
      const storeNames = Array.from(this.db.objectStoreNames);
      for (const storeName of storeNames) {
        this.db.deleteObjectStore(storeName);
      }

      // Create store for best scores
      const bestScoresStore = this.db.createObjectStore('bestScores', {
        keyPath: 'id',
      });
      // Stores start with default values
      bestScoresStore.add({ id: 'classic-standard', value: 999 });
      bestScoresStore.add({ id: 'classic-hard', value: 999 });
      bestScoresStore.add({ id: 'classic-expert', value: 999 });
      bestScoresStore.add({ id: 'timeAttack-standard', value: 0 });
      bestScoresStore.add({ id: 'timeAttack-hard', value: 0 });
      bestScoresStore.add({ id: 'timeAttack-expert', value: 0 });

      // Create store for streak
      const streakStore = this.db.createObjectStore('streak', {
        keyPath: 'id',
      });
      // Stores start with default values
      streakStore.add({ id: 'currentStreak', value: 0 });
    });

    // If request to open the database is successful
    request.addEventListener('success', (e) => {
      this.db = e.target.result;
    });

    // If request to open the database errored
    request.addEventListener('error', (e) => {
      console.error('Error whilst opening database', e);
    });
  }

  getBestScores() {
    // Use promises to wrap the asynchronous operation
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database not initialised');
      }
      const transaction = this.db.transaction('bestScores', 'readonly');
      const store = transaction.objectStore('bestScores');
      // Get all the best scores set so far
      const request = store.getAll();

      // If successful retrieving values
      request.onsuccess = () => {
        if (request.result) {
          const scores = [];
          for (const score of request.result) {
            // The id is stored as mode-difficulty, split into two variables
            const [mode, difficulty] = score.id.split('-');
            scores.push({ mode, difficulty, score: score.value });
          }
          resolve(scores);
        } else {
          resolve(null);
        }
      };

      // If error encountered whilst retrieving values
      request.onerror = (e) => {
        reject(e);
      };
    });
  }

  getBestScore(mode, difficulty) {
    // Use promises to wrap the asynchronous operation
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database not initialised');
      }
      const transaction = this.db.transaction('bestScores', 'readonly');
      const store = transaction.objectStore('bestScores');
      // Get the specific entry for the mode and difficulty
      const request = store.get(`${mode}-${difficulty}`);

      // If successful retrieving value
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.value);
        } else {
          resolve(null);
        }
      };

      // If error encountered whilst retrieving value
      request.onerror = (e) => {
        reject(e);
      };
    });
  }

  updateBestScore(mode, difficulty, score) {
    // Use promises to wrap the asynchronous operation
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database not initialised');
      }
      const transaction = this.db.transaction('bestScores', 'readwrite');
      const store = transaction.objectStore('bestScores');
      // Update the specific entry for the mode and difficulty
      const request = store.put({ id: `${mode}-${difficulty}`, value: score });

      // If successful setting the value
      request.onsuccess = () => {
        resolve();
      };

      // If error encountered whilst setting value
      request.onerror = (e) => {
        reject(e);
      };
    });
  }

  getStreak() {
    // Use promises to wrap the asynchronous operation
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database not initialised');
      }
      const transaction = this.db.transaction('streak', 'readonly');
      const store = transaction.objectStore('streak');
      // Get the current streak
      const request = store.get('currentStreak');

      // If successful retrieving value
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.value);
        } else {
          resolve(null);
        }
      };

      // If error encountered whilst retrieving value
      request.onerror = (e) => {
        reject(e);
      };
    });
  }

  updateStreak(streak) {
    // Use promises to wrap the asynchronous operation
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database not initialised');
      }
      const transaction = this.db.transaction('streak', 'readwrite');
      const store = transaction.objectStore('streak');
      // Update the held current streak
      const request = store.put({ id: 'currentStreak', value: streak });

      // If successful setting the value
      request.onsuccess = () => {
        resolve();
      };

      // If error encountered whilst setting value
      request.onerror = (e) => {
        reject(e);
      };
    });
  }
}
