var cloud;
var gravity = 3;
var ground;

// Space to start
oxo.inputs.listenKey('space', function() {
	if (oxo.screens.getCurrentScreen !== 'game') {
		oxo.screens.loadScreen('game', game);
	}
});

function game() {


	// Spawn factory
	var factory = oxo.elements.createElement({
		type: 'div',
		class: 'factory',
		styles: {
			height: '233px',
			width: '419px',
			transform: 'translate(1280px, 523px)',
		}
	});

	var moveInterval = setInterval(function() {
		oxo.animation.move(factory, 'left', 2, true);
	}, 40);

	
	oxo.elements.onLeaveScreenOnce(factory, function() {
		factory.remove();
		clearInterval(moveInterval);
	}, true);






	// Spawn black cloud
	var blackCloud = oxo.elements.createElement({
		type: 'div',
		class: 'blackCloud',
		styles: {
			height: '100px',
			width: '136.52px',
			transform: 'translate(1280px, 0)',
		}
	});

	var moveInterval = setInterval(function() {
		oxo.animation.move(blackCloud, 'left', 2, true);
	}, 10);

	
	oxo.elements.onLeaveScreenOnce(blackCloud, function() {
		blackCloud.remove();
		clearInterval(moveInterval);
	}, true);




	


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
	oxo.elements.onCollisionWithElement(cloud, factory, function() {
		oxo.screens.loadScreen('end');
		clearInterval(timer);

		// Reset space 
		oxo.inputs.listenKey('space', function() {
			if (oxo.screens.getCurrentScreen !== 'game') {
				oxo.screens.loadScreen('game', game);
			}
		});
	});

	// 

	oxo.elements.onCollisionWithElement(cloud, ground, function() {
		oxo.screens.loadScreen('end');
		clearInterval(timer);

		// Reset space 
		oxo.inputs.listenKey('space', function() {
			if (oxo.screens.getCurrentScreen !== 'game') {
				oxo.screens.loadScreen('game', game);
			}
		});
	});

	oxo.elements.onCollisionWithElement(cloud, blackCloud, function() {
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