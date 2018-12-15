window.oxo = {
  oxo: this,

  animation: {
    /**
     * Modify the transform property of an element to make it move
     * @param {HTMLElement} element - The element to move
     * @param {string} direction - The direction (left, up, right, down)
     * @param {number} distance - The number of pixels for the move
     */
    move(element, direction, distance) {
      if (!element) {
        console.error('The element to move was not found');
        return;
      }

      if (!distance) {
        console.error('You must provide a distance to move an element');
        return;
      }

      var position = oxo.animation.getPosition(element);
      var updatedPosition = oxo.animation.computeNewPosition(
        position,
        direction,
        distance
      );

      oxo.animation.setPosition(element, position);
    },

    /**
     * Modify a position object depending on direction and distance
     * @param {Object} position - An object containing the x and y position
     * @param {*} direction - The direction in which to move
     * @param {*} distance - The distance to move
     */
    computeNewPosition(position, direction, distance) {
      switch (direction) {
        case 'left':
          position.x -= distance;
          break;
        case 'up':
          position.y -= distance;
          break;
        case 'right':
          position.x += distance;
          break;
        case 'down':
          position.y += distance;
          break;
        default:
          console.error('The direction provided is not valid');
          return;
      }
    },

    /**
     * Get the values of the translate property for the given element
     * @param {HTMLElement} element - The element
     * @return {Object} An object containing the x and the y position
     */
    getPosition(element) {
      var position = element.style.transform.match(
        new RegExp(/translate\(.+\)/)
      );

      if (position) {
        var values = position[0].match(/-?\d+/g).map(value => parseInt(value));
        return {
          x: values[0],
          y: values[1],
        };
      } else {
        return { x: 0, y: 0 };
      }
    },

    /**
     * Set the translate property of the given element
     * @param {HTMLElement} element - The element to move
     * @param {Object} position - An object containing the x and y values
     * @return {string} - The updated transform property
     */
    setPosition(element, position) {
      var transform = element.style.transform.replace(/translate\(.+\)/, '');

      var translation = 'translate(' + position.x + 'px, ' + position.y + 'px)';

      return (element.style.transform = transform + translation);
    },
  },

  elements: {
    /**
     * Create an HTML element
     * @param {*} params - An object containing the element parameters
     * @return {HTMLElement} The created element
     */
    createElement(params) {
      var element = document.createElement(params.type ? params.type : 'div');

      if (params.class) {
        params.class.split(' ').forEach(function(className) {
          element.classList.add(className);
        });
      }

      if (params.styles) {
        for (style in params.styles) {
          element.style[style] = params.styles[style];
        }
      }

      oxo.elements.appendElement(element, params.appendTo);

      return element;
    },

    /**
     * Append an element inside another one
     * @param {HTMLElement} element - The element to append
     * @param {string} hostSelector - The string to select the host element
     */
    appendElement(element, hostSelector) {
      var host = hostSelector
        ? document.querySelector(hostSelector)
        : document.body;

      if (!host) {
        console.error('No element was found for selector ', +hostSelector);
        return;
      }

      host.appendChild(element);
    },

    /**
     * Execute an action when the given element collides with the border
     * @param {HTMLElement} element - The element to observe
     * @param {Function} action - The action to execute
     * @param {boolean} once - If true, the action will be executed only once
     * @return {IntersectionObserver} - The observer
     */
    onCollisionWithBorder(element, action, once) {
      var observer = new IntersectionObserver(
        function(entries) {
          entries.forEach(function(entry) {
            if (!entry.isIntersecting) {
              action();
              observer.disconnect();
            }
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 1.0,
        }
      );
      observer.observe(element);

      return observer;
    },

    /**
     * Execute an action once the given element collides with the border
     * @param {HTMLElement} element - The element to observe
     * @param {Function} action - The action to execute
     * @return {IntersectionObserver} - The observer
     */
    onCollisionWithBorderOnce(element, action) {
      return oxo.elements.onCollisionWithBorder(element, action, true);
    },

    /**
     * Execute an action when two element collides
     * @param {HTMLElement} element - The element to observe
     * @param {HTMLElement} target - The element to collide with
     * @param {Function} action - The action to execute
     * @param {boolean} once - If true, the action is executed only once
     * @return {Interval} - The timer used for checking
     */
    onCollisionWithElement(element, target, action, once) {
      var colliding = false;

      var interval = setInterval(function() {
        if (oxo.elements.elementsAreColliding(element, target)) {
          if (!colliding) {
            action();
            colliding = true;

            if (once) {
              clearInterval(interval);
            }
          }
        } else {
          colliding = false;
        }
      }, 10);

      return interval;
    },

    /**
     * Execute an action once when two element collides
     * @param {HTMLElement} element - The element to observe
     * @param {HTMLElement} target - The element to collide with
     * @param {Function} action - The action to execute
     * @return {Interval} - The timer used for checking
     */
    onCollisionWithElementOnce(element, target, action) {
      return oxo.elements.onCollisionWithElement(element, target, action, true);
    },

    /**
     * Test if two elements are in collision
     * @param {HTMLElement} element1 - The first element
     * @param {HTMLElement} element2 - The second element
     */
    elementsAreColliding(element1, element2) {
      var element1Pos = element1.getBoundingClientRect();
      var element2Pos = element2.getBoundingClientRect();

      return (
        element1Pos.x < element2Pos.x + element2Pos.width &&
        element1Pos.x + element1Pos.width > element2Pos.x &&
        element1Pos.y < element2Pos.y + element2Pos.height &&
        element1Pos.height + element1Pos.y > element2Pos.y
      );
    },
  },

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
        return;
      }

      oxo.inputs.keysListeners[code] = {
        action: action.bind(this, key),
        once: once,
      };
    },

    /**
     * Execute the given action each time one of the given key is pressed
     * @param {Array<string>} keys - The keys that should trigger the action
     * @param {Function} action - The action to execute
     */
    listenKeys(keys, action) {
      keys.forEach(function(key) {
        oxo.inputs.listenKey(key, action);
      });
    },

    /**
     * Execute the given action each time an arrow key is pressed
     * @param {Function} action - The action to execute
     */
    listenArrowKeys(action) {
      oxo.inputs.listenKeys(['left', 'up', 'right', 'down'], action);
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
     * Cancel the listeners for several keys
     * @param {Array<string>} - The keys to stop listening to
     */
    cancelKeysListeners(keys) {
      keys.forEach(function(key) {
        oxo.inputs.cancelKeysListener(key);
      });
    },

    /** Cancel the listening of arrow keys */
    cancelArrowKeysListeners() {
      oxo.inputs.cancelKeysListener(['left', 'up', 'right', 'down']);
    },

    /**
     * This method will be executed on initialization to listen all the keys
     */
    listenAllKeys() {
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

      oxo.player.refreshScore();

      return points;
    },

    /**
     * Refresh the score display
     */
    refreshScore() {
      var scoreElement = oxo.getElement('score');

      if (scoreElement) {
        scoreElement.innerText = oxo.player.getScore();
      }
    },
  },

  screens: {
    currentScreen: '',
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
            oxo.player.refreshScore();

            if (action) {
              action.call();
            }
          });
        }
      });
    },

    /**
     * Get the name of the current screen
     * @return {string} the current screen
     */
    getCurrentScreen() {
      return oxo.screens.currentScreen;
    },
  },

  utils: {
    /**
     * Get a random number between two limits
     * @param {number} min - The min number
     * @param {number} max - The max number
     * @return {number} - The random number
     */
    getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
  },

  /**
   * A function that will be run when oxo is called in order to init the game
   */
  init() {
    oxo.screens.loadScreen('home');
    oxo.inputs.listenAllKeys();
    oxo.player.setScore(0);
  },

  /**
   * Pretty logger for oxo events
   * @param {string} message - The information to log
   */
  log(message) {
    console.log('%c OXO: ' + message, 'background-color: gold; padding: 5px');
  },

  /**
   * Find an element with an oxo data attribute in the DOM
   * @param {string} attribute - The data attribute of the element (oxo-data-*)
   */
  getElement(attribute) {
    return document.querySelector('[data-oxo-' + attribute + ']');
  },
};

window.oxo.init();
