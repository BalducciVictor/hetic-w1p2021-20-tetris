var smog = new Image(100, 200);
smog.src = '/src/img/cloud_happy.png'; 










oxo.inputs.listenKeyOnce('space', function() {
	if (oxo.screens.getCurrentScreen !== 'game') {
		oxo.screens.loadScreen('game', game);
	}
});

function game() {
	oxo.player.setScore(0);
	smog = document.getElementById('smog')


}

oxo.inputs.listenKeyOnce('enter', function() {
	if (oxo.screens.getCurrentScreen !== 'end') {
		oxo.screens.loadScreen('end', end);
	}
});

function end() {
	oxo.player.setScore(0);
	smog = document.getElementById('smog')


}