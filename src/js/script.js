console.log('yolo');

var direction; // Direction of the cloud
var cloud; // Smogy
var gravity = 237;
var ground;

oxo.inputs.listenKey('space', function() {
    if (oxo.screens.getCurrentScreen !== 'game') {
      oxo.screens.loadScreen('game', game);
    }
  });

/*oxo.screens.loadScreen('game', function() {
    // game.html is loaded, do something
  });

/*document.addEventListener("keypress",function (event) {
    var key = event.keyCode;
    if (key === 32) {
        cloud = nextDirection = "up";
        return true;
        console.log('ok');
    }   
});
*/

function game () {
    var cloud = document.getElementById('cloud');
    var ground = document.getElementById('ground');
    oxo.elements.onCollisionWithElement(cloud, ground, function() {
        oxo.screens.loadScreen('end');
    });

    for (i = 0; i < gravity; i++) {
        console.log('ok');
        setInterval(function() {
            oxo.animation.move(cloud, 'down', 1.1);
        }, 800);
    };
    oxo.inputs.listenKey('space', function() {
        oxo.animation.move(cloud, 'up', 100);
    });
    


}