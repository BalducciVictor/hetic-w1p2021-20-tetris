window.oxo = {
  oxo: this,

  inputs: {
    keys: {
      enter: 13,
      space: 32,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      a: 65,
      b: 66,
      c: 67,
      d: 68,
      e: 69,
      f: 70,
      g: 71,
      h: 72,
      i: 73,
      j: 74,
      k: 75,
      l: 76,
      m: 77,
      n: 78,
      o: 79,
      p: 80,
      q: 81,
      r: 82,
      s: 83,
      t: 84,
      u: 85,
      v: 86,
      w: 87,
      x: 88,
      y: 89,
      z: 90,
    },
    keysListeners: {},

    /**
     * Execute the given action each time the given key is pressed
     * @param {string} key - The key to press to trigger the action
     * @param {Function} action - The function that will be executed
     * @param {boolean} once - If true, the action will be executed only once
     */
    listenKey(key, action, once) {
      if (!once) {
        once = false;
      }

      var code = oxo.inputs.keys[key];

      if (!code) {
        console.error('The key "' + code + '" cannot be found');

        return false;
      }

      oxo.inputs.keysListeners[code] = {
        action: action,
        once: once,
      };
    },

    /**
     * Execute the given action the next time the given key is pressed
     * @param {string} key - The key to press to trigger the action
     * @param {Function} action - The function that will be executed
     * */
    listenKeyOnce(key, action) {
      oxo.inputs.listenKey(key, action, true);
    },

    /**
     * Cancel the listener for the given key
     * @param {string} key - The key to stop listening to
     */
    cancelKeyListener(key) {
      delete oxo.inputs.keysListeners[oxo.inputs.keys[key]];
    },

    /**
     * This method will be executed on initialization to listen all the keys
     */
    listenKeys() {
      document.addEventListener('keydown', function(event) {
        listener = oxo.inputs.keysListeners[event.keyCode];
        if (listener) {
          listener.action();

          if (listener.once) {
            delete oxo.inputs.keysListeners[event.keyCode];
          }
        }
      });
    },
  },

  interface: {
    /**
     * Define an element in which to show the score
     * @param {HTMLElement} element - The HTML element hosting the score
     * @return {HTMLElement} element - The HTML element hosting the score
     */
    setScoreElement(element) {
      if (!element) {
        console.error('The element given to display the score is not valid');

        return false;
      }
      oxo.interface.scoreElement = element;
      oxo.interface.refreshScore();
    },

    /**
     * Update the score element content if it exits
     */
    refreshScore() {
      if (oxo.interface.scoreElement) {
        oxo.interface.scoreElement.innerText = oxo.player.getScore();
      }
    },
  },

  player: {
    /**
     * Add one or several points to the score
     * @param {number} points - The number of points to add
     * @return {number} The new score
     */
    addToScore(points) {
      oxo.log('Add ' + points + ' points to the score');

      return oxo.player.setScore(oxo.player.getScore() + points);
    },

    /**
     * Get the score
     * @return {number} The score
     */
    getScore() {
      return parseInt(localStorage.getItem('score'));
    },

    /**
     * Remove one or several points from the score
     * @param {number} points - The number of points to remove
     * @return {number} The new score
     */
    removeFromScore(points) {
      var newScore = Math.max(0, oxo.player.getScore() - points);
      oxo.log('Remove ' + points + ' points from the score');

      return oxo.player.setScore(newScore);
    },

    /**
     * Set the score
     * @param {number} points - The score
     * @return {number} The score
     */
    setScore(points) {
      localStorage.setItem('score', points);
      oxo.log('New score is ' + points);

      oxo.interface.refreshScore();

      return points;
    },
  },

  screens: {
    /**
     * Load a new screen (and add matching class to the body)
     * @param {string} name - The name of the html file for the screen to load
     * @param {Function} action - The function to execute after loading
     */
    loadScreen(name, action) {
      fetch('../../screens/' + name + '.html').then(function(response) {
        if (response.ok) {
          response.text().then(function(html) {
            document.body.innerHTML = html;
            document.body.setAttribute('class', name);
            oxo.log('Load screen ' + name);

            if (action) {
              action.call();
            }
          });
        }
      });
    },
  },

  /**
   * A function that will be run when oxo is called in order to init the game
   */
  init() {
    oxo.screens.loadScreen('home');
    oxo.inputs.listenKeys();
    oxo.player.setScore(0);
  },

  /**
   * Pretty logger for oxo events
   * @param {string} message - The information to log
   */
  log(message) {
    console.log(
      '%c OXO: ' + message,
      'background-color: crimson; color: white; padding: 5px'
    );
  },
};

window.oxo.init();
