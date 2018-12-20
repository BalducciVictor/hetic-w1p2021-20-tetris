var cloud;
var gravity = 3;
var ground;

var size = 60;
var xObstacle = 1280 / 60;
var yObstacle = 400 / 60;
var xObstacleFactory = 1280 / 60;
var yObstacleFactory = 200;
var speed = 6000;

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

	enemyInterval = setInterval(addBlackCloud, speed);
	factoryInterval = setInterval(addFactory, speed);
	planeInterval = setInterval(addPlane, speed);

	oxo.inputs.listenKeys(["q", "z", "d", "a"], function(key){
		var position = oxo.animation.getPosition(cloud);
		if (!canShoot) {
			return;
		}
		canShoot = false;
		setTimeout(function(){
				canShoot = true;

		}, 1500);

		if (key === "d") {
			var shoot = oxo.elements.createElement({
				class: 'thunder',
				styles: {
					transform: "translate(" +	(250) +"px, " + position.y  + "px)"
				},
				appendTo: '#sky'
			});

			boltInterval = setInterval(function() {
				oxo.animation.move(shoot, 'right', 2, true);
			}, 10);


			var obstacles = document.querySelectorAll('.move');

			obstacles.forEach(function(obstacle) {
				oxo.elements.onCollisionWithElement(shoot, obstacle, function(){
					oxo.player.addToScore(10);
					shoot.remove();
					obstacle.remove();
				});
			});
			
			

		}
		if (key === "a") {
			var shoot = oxo.elements.createElement({
				class: 'rain',
				styles: {
					transform: "translate(" +	(250) +"px, " + position.y  + "px)"
				},
				appendTo: '#sky'
			});

			boltInterval = setInterval(function() {
				oxo.animation.move(shoot, 'down', 2, true);
			}, 10);


			oxo.elements.onCollisionWithElement(shoot, obstacle, function(){
				oxo.player.addToScore(10);
				shoot.remove();
				obstacle.remove();
			});
			

		}

	});

	// Start scoring
	oxo.player.setScore(0);
	timer = setInterval(function() {
		oxo.player.addToScore(1);
	}, 1000);

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
	}, 10);

	oxo.elements.onLeaveScreen(obstacle, function() {
    	console.log(obstacle, oxo.animation.getPosition(obstacle).x < 0);
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
				(oxo.utils.getRandomNumber(0, xObstacleFactory - 1) * size + 1280) +
				"px, " +
				(83) +
				"px)"
		},
		appendTo: '#factory__zone'
	});

	facInterval = setInterval(function() {
		oxo.animation.move(obstacle, 'left', 2, true);
	}, 10);

	oxo.elements.onLeaveScreenOnce(obstacle, remove);

	oxo.elements.onCollisionWithElement(cloud, obstacle, end);
}


function addPlane() {
  if (oxo.player.getScore() > 300) {
    var obstacle = oxo.elements.createElement({
      class: "plane move",
      obstacle: true,
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

    oxo.elements.onLeaveScreenOnce(obstacle, function() {
    	console.log(obstacle);
    	obstacle.remove();
    }, true);

    oxo.elements.onCollisionWithElement(cloud, obstacle, end);
  }
}


function remove() {
	var allMovableElements = document.querySelectorAll(".move");
	for (let i = 0; i < allMovableElements.length; i++) {
		//get position.x to  if it is out of the screen (on the left)
		var position = oxo.animation.getPosition(allMovableElements[i]);
		if (position.x < -200) {
			allMovableElements[i].remove();
		}
	}
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