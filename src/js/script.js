var cloud;
var gravity = 3;
var ground;

var size = 60;
var xObstacle = 1280 / 60;
var yObstacle = 400 / 60;
var xObstacleFactory = 1280 / 60;
var yObstacleFactory = 200;

var enemyInterval;
var factoryInterval;

// Space to start
oxo.inputs.listenKey('space', function() {
	if (oxo.screens.getCurrentScreen !== 'game') {
		oxo.screens.loadScreen('game', game);
	}
});

function game() {

	enemyInterval = setInterval(addBlackCloud, 10000);
	factoryInterval = setInterval(addFactory, 15000);

	// Start scoring
	oxo.player.setScore(0);
	timer = setInterval(function() {
		oxo.player.addToScore(1);
	}, 500);

	var cloud = document.getElementById('cloud');
	oxo.animation.setPosition(cloud, { x: 0, y: 350 });
	var ground = document.getElementById('ground');

	// Space to jump
	oxo.inputs.listenKey('space', function() {
		gravity = -3;

		setTimeout(function() {
			gravity = 2;
		}, 500)
	});

	// Gravity
	setInterval(function() {
		oxo.animation.move(cloud, 'down', gravity);
	}, 10);

	oxo.elements.onCollisionWithElement(cloud, ground, end);
}

function addBlackCloud(){
	var obstacle = oxo.elements.createElement({
		class: 'blackCloud',
		styles: {
			transform:
          "translate(" +
          (oxo.utils.getRandomNumber(0, xObstacle - 1) * size + 1280) +
          "px, " +
          oxo.utils.getRandomNumber(0, yObstacle - 1) * size + 
          "px)"
      },
      appendTo: '#sky'
	});
		
	var moveInterval = setInterval(function() {
		oxo.animation.move(obstacle, 'left', 2, true);
	}, 10);

	oxo.elements.onCollisionWithElement(cloud, obstacle, end);
	
}

function addFactory(){
	var obstacle = oxo.elements.createElement({
		class: 'factory',
		styles: {
			transform:
          "translate(" +
          (oxo.utils.getRandomNumber(0, xObstacleFactory - 1) * size + 1280) +
          "px, " +
          (83) + 
          "px)"
      },
      appendTo: '#factory__zone'
	});
		
	var moveInterval = setInterval(function() {
		oxo.animation.move(obstacle, 'left', 2, true);
	}, 10);

		oxo.elements.onCollisionWithElement(cloud, obstacle, end);
}





function end() {
// Collision with foor
	oxo.screens.loadScreen('end');
	clearInterval(timer);
	clearInterval(factoryInterval);
	clearInterval(enemyInterval);

	// Reset space 
	oxo.inputs.listenKey('space', function() {
		if (oxo.screens.getCurrentScreen !== 'game') {
			oxo.screens.loadScreen('game', game);
		}
	});
}




	// 	// Reset space 
	// 	oxo.inputs.listenKey('space', function() {
	// 		if (oxo.screens.getCurrentScreen !== 'game') {
	// 			oxo.screens.loadScreen('game', game);
	// 		}
	// 	});
	// });

	// 