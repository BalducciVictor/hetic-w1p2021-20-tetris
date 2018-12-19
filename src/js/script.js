console.log('yolo');

var direction; // Direction of the cloud
var cloud; // Smogy
var gravity = 40;
var ground;

oxo.inputs.listenKey('space', function() {
	if (oxo.screens.getCurrentScreen !== 'game') {
		oxo.screens.loadScreen('game', game);
	}
});

function game() {
	var cloud = document.getElementById('cloud');
	var ground = document.getElementById('ground');
	

	oxo.inputs.listenKey('space', function() {
		oxo.animation.move(cloud, 'up', 30);
	});
	
	for(i = 0; i < gravity; i++) {
		setInterval(function() {
			oxo.animation.move(cloud, 'down', 1);
		}, 800);
	};

	oxo.elements.onCollisionWithElement(cloud, ground, function() {
		oxo.screens.loadScreen('end');

		oxo.inputs.listenKey('space', function() {
			if (oxo.screens.getCurrentScreen !== 'game') {
				oxo.screens.loadScreen('game', game);
			}
		});
	});
}


