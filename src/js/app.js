
var scene = require("./scene")


/*
Listen for keyboard events to enter full-screen VR mode.
*/

var display_mode;

function onkey(event) {
  if (!(event.metaKey || event.altKey || event.ctrlKey)) {
    event.preventDefault();
  }
  if (event.charCode == 'v'.charCodeAt(0)) { // v
    display_mode = 'vr';
    vr_effect.setFullScreen( true );
  } else if (event.charCode == 'd'.charCodeAt(0)) { // d
    display_mode = '';
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
};

window.addEventListener("keypress", onkey, true);


scene.init()


scene.animate()

