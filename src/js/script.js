var cloud;
var gravity = 3;
var ground;
var size = 60;
var xObstacle = 1280 / 60;
var yObstacle = 400 / 60;
var enemyInterval;

// Space to start
oxo.inputs.listenKey('space', function() {
	if (oxo.screens.getCurrentScreen !== 'game') {
		oxo.screens.loadScreen('game', game);
	}
});

function game() {



	enemyInterval = setInterval(addBlackCloud, 5000);

	// // Spawn factory
	// var factory = oxo.elements.createElement({
	// 	type: 'div',
	// 	class: 'factory',
	// 	styles: {
	// 		height: '233px',
	// 		width: '419px',
	// 		transform: 'translate(1280px, 523px)',
	// 	}
	// });

	// var moveInterval = setInterval(function() {
	// 	oxo.animation.move(factory, 'left', 2, true);
	// }, 40);

	
	// oxo.elements.onLeaveScreenOnce(factory, function() {
	// 	factory.remove();
	// 	clearInterval(moveInterval);
	// }, true);




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

	// Collision with foor
	// oxo.elements.onCollisionWithElement(cloud, factory, function() {
	// 	oxo.screens.loadScreen('end');
	// 	clearInterval(timer);

	// 	// Reset space 
	// 	oxo.inputs.listenKey('space', function() {
	// 		if (oxo.screens.getCurrentScreen !== 'game') {
	// 			oxo.screens.loadScreen('game', game);
	// 		}
	// 	});
	// });

	// // 

	oxo.elements.onCollisionWithElement(cloud, ground, function() {
		// oxo.screens.loadScreen('end');
		clearInterval(timer);

		// Reset space 
		oxo.inputs.listenKey('space', function() {
			if (oxo.screens.getCurrentScreen !== 'game') {
				oxo.screens.loadScreen('game', game);
			}
		});
	});


}


function addBlackCloud(){
	var obstacle = oxo.elements.createElement({
		type: 'div',
		class: 'blackCloud',
		styles: {
			transform:
          "translate(" +
          (oxo.utils.getRandomNumber(0, xObstacle - 1) * size + 1280) +
          "px, " +
          oxo.utils.getRandomNumber(0, yObstacle - 1) * size +
          "px)"
      },
	});
	var moveInterval = setInterval(function() {
		oxo.animation.move(obstacle, 'left', 2, true);
	}, 10);


	oxo.elements.onCollisionWithElement(cloud, obstacle, function() {
		oxo.screens.loadScreen('end');
		clearInterval(timer);

		// Reset space 
		oxo.inputs.listenKey('space', function() {
			if (oxo.screens.getCurrentScreen !== 'game') {
				oxo.screens.loadScreen('game', game);
			}
		});
	});
}