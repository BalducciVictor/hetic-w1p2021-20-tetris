var cloud;
var gravity = 40;
var ground;

oxo.inputs.listenKey('space', function() {
	if (oxo.screens.getCurrentScreen !== 'game') {
		oxo.screens.loadScreen('game', game);
	}
});

function game() {

	// Start scoring
	oxo.player.setScore(0);
	timer = setInterval(function() {
			oxo.player.addToScore(1);
	}, 500);

	var cloud = document.getElementById('cloud');
	oxo.animation.setPosition(cloud, { x: 0, y: 300 });
	var ground = document.getElementById('ground');

	// Space to start
	oxo.inputs.listenKey('space', function() {
		oxo.animation.move(cloud, 'up', 30);
	});

	// Gravity
	// Need fix interval glitch
	for (i = 0; i < gravity; i++) {
		setInterval(function() {
			oxo.animation.move(cloud, 'down', 1);
		}, 800);
	};

	// Collision with foor
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
}
