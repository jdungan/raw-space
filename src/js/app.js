
var _ = require("underscore")
var THREE = require("three")
var VRflight = require("./VRflight")
var FlyControls = require("./FlyControls")

var raw = require("./raw_mesh")
var utils = require("./utils")


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

var container = document.createElement('div');
var scene = new THREE.Scene();
// scene.fog = new THREE.Fog(0xcce0ff, 100, 500);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  


var clock = new THREE.Clock();
var renderer = new THREE.WebGLRenderer();

// var vr_effect = new THREE.VREffect( renderer );
// vr_effect.setSize( window.innerWidth, window.innerHeight );


controls = new THREE.FlyControls(camera);
controls.movementSpeed = 150;
controls.domElement = container;


function render() {

  requestAnimationFrame(render);

  controls.update(clock.getDelta());      
  
  if (display_mode == 'vr' ) {
    
    vr_effect.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }

}

function init() {
  
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  hemiLight = new THREE.HemisphereLight(0x99FFFF, 0xCC0033, 1.5);
  hemiLight.color.setHSL(.66, 0, .45);
  hemiLight.groundColor.setHSL(0, 0, 0);
  hemiLight.position.set(0, 0, 1000);
  hemiLight.visible = true
  hemiLight.castShadow = true


  scene.add(hemiLight);

  var center = new THREE.Vector3(0,0,0)

  utils.pointAt(center,camera)

  // world sphere
  scene.add(raw.GroundPlane(500, center));
  // scene.add(raw.SkyDome(250, center))
  scene.add(raw.Buildings(center))


}



init()


render()