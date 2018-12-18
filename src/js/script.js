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
