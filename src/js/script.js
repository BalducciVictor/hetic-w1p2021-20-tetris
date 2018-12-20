var cloud;
var gravity = 3;
var ground;
var size = 60;
var xObstacle = 1280 / 60;
var yObstacle = 400 / 60;
var enemyInterval;
var factoryInterval;
var moveInterval;
var blackInterval;
var facInterval;
var planeInterval;
var canShoot = true;

// Space to start
oxo.inputs.listenKey('space', function() {
	if (oxo.screens.getCurrentScreen !== 'game') {
		oxo.screens.loadScreen('game', game);
	}
});

function game() {

	// Set volume sound of game 
	var gameSound = document.getElementById('gameSound');
	gameSound.volume = 0.5;

	enemyInterval = setInterval(addBlackCloud, 5000);
	factoryInterval = setInterval(addFactory, 6000);
	planeInterval = setInterval(addPlane, 5000);

	oxo.inputs.listenKeys(["q", "z", "d", "a"], function(key) {
		var position = oxo.animation.getPosition(cloud);
		if (!canShoot) {
			return;
		}
		canShoot = false;
		setTimeout(function() {
			canShoot = true;

		}, 1500);

		if (key === "d") {
			var shoot = oxo.elements.createElement({
				class: 'thunder',
				styles: {
					transform: "translate(" + (250) + "px, " + position.y + "px)"
				},
				appendTo: '#sky'
			});

			boltInterval = setInterval(function() {
				oxo.animation.move(shoot, 'right', 2, true);
			}, 3);

			oxo.elements.onLeaveScreen(shoot, function() {
				shoot.remove();
			}, true);

			var obstacles = document.querySelectorAll('.move');

			obstacles.forEach(function(obstacle) {
				oxo.elements.onCollisionWithElement(shoot, obstacle, function() {
					oxo.player.addToScore(10);
					shoot.remove();
					obstacle.remove();
					boltSound();
				});
			});

		}
		if (key === "a") {
			var drop = oxo.elements.createElement({
				class: 'rain',
				styles: {
					transform: "translate(" + (250) + "px, " + position.y + "px)"
				},
				appendTo: '#sky'
			});

			boltInterval = setInterval(function() {
				oxo.animation.move(drop, 'down', 2, true);
			}, 3);

			oxo.elements.onCollisionWithElement(drop, ground, function() {
				drop.remove();
			});

			var obstacles = document.querySelectorAll('.move');

			obstacles.forEach(function(obstacle) {
				oxo.elements.onCollisionWithElement(drop, obstacle, function() {
					oxo.player.addToScore(10);
					drop.remove();
					obstacle.remove();
					waterSound();
				});
			});

		}

	});

	// Start scoring
	oxo.player.setScore(0);
	timer = setInterval(function() {
		oxo.player.addToScore(1);
	}, 10000);

	cloud = document.getElementById('cloud');
	oxo.animation.setPosition(cloud, { x: 0, y: 350 });
	ground = document.getElementById('ground');

	// Space to jump
	oxo.inputs.listenKey('space', function() {
		gravity = -3;

		setTimeout(function() {
			gravity = 2;
		}, 500)
	});

	// Gravity
	moveInterval = setInterval(function() {
		oxo.animation.move(cloud, 'down', gravity);
	}, 10);

	oxo.elements.onCollisionWithElement(cloud, ground, end);

}

function addBlackCloud() {
	var obstacle = oxo.elements.createElement({
		class: 'blackCloud move',
		styles: {
			transform: "translate(" +
				(oxo.utils.getRandomNumber(0, xObstacle - 1) * size + 1280) +
				"px, " +
				oxo.utils.getRandomNumber(0, yObstacle - 1) * size +
				"px)"
		},
		appendTo: '#sky'
	});

	facInterval = setInterval(function() {
		oxo.animation.move(obstacle, 'left', 2, true);
	}, 3);

	oxo.elements.onLeaveScreen(obstacle, function() {
		if (oxo.animation.getPosition(obstacle).x < 0) {
			obstacle.remove();

		}
	}, true);

	oxo.elements.onCollisionWithElement(cloud, obstacle, end);

}

function addFactory() {
	var obstacle = oxo.elements.createElement({
		class: 'factory move',
		styles: {
			transform: "translate(" +
				(oxo.utils.getRandomNumber(0, xObstacle - 1) * size + 1280) +
				"px, " +
				(83) +
				"px)"
		},
		appendTo: '#factory__zone'
	});

	facInterval = setInterval(function() {
		oxo.animation.move(obstacle, 'left', 2, true);
	}, 8);

	oxo.elements.onLeaveScreen(obstacle, function() {
		if (oxo.animation.getPosition(obstacle).x < 0) {
			obstacle.remove();

		}
	}, true);

	oxo.elements.onCollisionWithElement(cloud, obstacle, end);
}


function addPlane() {
	if (oxo.player.getScore() > 150) {
		var obstacle = oxo.elements.createElement({
			class: "plane move",
			styles: {
				transform: "translate(" +
					(oxo.utils.getRandomNumber(0, xObstacle - 1) * size + 1280) +
					"px, " +
					oxo.utils.getRandomNumber(0, yObstacle - 1) * size +
					"px)"
			},
			appendTo: '#sky'
		});

		planeInterval = setInterval(function() {
			oxo.animation.move(obstacle, 'left', 2, true);
		}, 10);

		oxo.elements.onLeaveScreen(obstacle, function() {
			if (oxo.animation.getPosition(obstacle).x < 0) {
				obstacle.remove();

			}
		}, true);

		oxo.elements.onCollisionWithElement(cloud, obstacle, end);
	}
}

function boltSound() {
	document.getElementById('bolt').play();
}

function waterSound() {
	document.getElementById('water').play();
}

function end() {

	// Collision with floor
	oxo.screens.loadScreen('end');

	clearInterval(timer);
	clearInterval(factoryInterval);
	clearInterval(enemyInterval);
	clearInterval(planeInterval);
	clearInterval(moveInterval);
	clearInterval(facInterval);
	clearInterval(blackInterval);

	// Reset space 
	oxo.inputs.listenKeyOnce('enter', function() {
		if (oxo.screens.getCurrentScreen !== 'game') {
			oxo.screens.loadScreen('game', game);
		}
	});
}