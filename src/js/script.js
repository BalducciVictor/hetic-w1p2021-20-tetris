var direction; // The direction of the snake
var nextDirection; // The direction used for the next frame
var opposites = {
  // Usefull to calculate an impossible turn
  left: 'right',
  up: 'down',
  right: 'left',
  down: 'up',
};
var snake; // The snake element
var snakePosition; // The position of the snake
var size = 40; // The size of a game square
var xSquares = 1280 / 40; // Number of square on x axis
var ySquares = 800 / 40; // Number of square on y axis
var speed = 100; // The speed of the game
var turnInterval; // The periodic call to the turn function
var bonusInterval; // The periodic call to the addBonus function

// Enter the game when pressing enter, if not already in it
oxo.inputs.listenKey('enter', function() {
  if (oxo.screens.getCurrentScreen !== 'game') {
    oxo.screens.loadScreen('game', game);
  }
});

function game() {
  // Init some variables when game starts
  direction = 'right';
  oxo.player.setScore(0);

  snake = document.getElementById('snake'); // Get the snake element
  turnInterval = setInterval(turn, speed); // Call the turn function periodically
  bonusInterval = setInterval(addBonus, speed * 10); // Call the addBonus function every 10 turn

  oxo.inputs.listenArrowKeys(function(key) {
    // When pressing an arrow, change direction if not opposite to current
    if (key !== opposites[direction]) {
      nextDirection = key;
    }
  });

  oxo.elements.onCollisionWithBorderOnce(snake, end);
}

function turn() {
  if (snakePosition && oxo.player.getScore() > 0) {
    setTail();
  }

  direction = nextDirection ? nextDirection : direction; // Update the direction
  oxo.animation.move(snake, direction, size); // Move the snake in the right direction
  snakePosition = oxo.animation.getPosition(snake); // Update the snake position variable
}

function addBonus() {
  // Add a bonus element to the screen at a random position
  var bonus = oxo.elements.createElement({
    class: 'game__square game__square--bonus',
    styles: {
      transform:
        'translate(' +
        oxo.utils.getRandomNumber(0, xSquares - 1) * size +
        'px, ' +
        oxo.utils.getRandomNumber(0, ySquares - 1) * size +
        'px)',
    },
  });

  // When the snake eats a bonus
  oxo.elements.onCollisionWithElementOnce(snake, bonus, function() {
    bonus.remove(); // Remove the bonus from the screen
    oxo.player.addToScore(1); // Increase score
  });
}

function setTail() {
  // Add a tail element at the current position of the snake head
  var tail = oxo.elements.createElement({
    class: 'game__square game__square--tail',
    styles: {
      transform:
        'translate(' + snakePosition.x + 'px, ' + snakePosition.y + 'px)',
    },
  });

  // End the game if the head collides with the tail
  oxo.elements.onCollisionWithElementOnce(snake, tail, end);

  setTimeout(() => {
    tail.remove(); // Remove the tail element after a time depending on the user score
  }, speed * oxo.player.getScore());
}

function end() {
  // Stop calling turn and addBonus functions, the game is over
  clearInterval(turnInterval);
  clearInterval(bonusInterval);

  oxo.screens.loadScreen('end');
}
