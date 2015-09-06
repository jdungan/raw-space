
var THREE = require("three")
var TWEEN = require("tween.js")
var VRflight = require("./VRflight")
var VRrender = require("./VReffect")

var raw = require("./raw_mesh")
var utils = require("./utils")

setting = {}

container = document.createElement('div');
var scene = new THREE.Scene();
// scene.fog = new THREE.Fog(0xcce0ff, 100, 500);
var camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, 1000);
  


var clock = new THREE.Clock();
var renderer = new THREE.WebGLRenderer();

// var vr_effect = new THREE.VREffect( renderer );
// vr_effect.setSize( window.innerWidth, window.innerHeight );


controls = new THREE.VRflight(camera);


controls.movementSpeed = 150;
controls.domElement = container;


setting.animate = function () {

  requestAnimationFrame(setting.animate);

  controls.update(clock.getDelta());      
  
  if (display_mode == 'vr' ) {
    vr_effect.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }
   TWEEN.update();
 }

setting.init = function () {
  
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  document.body.appendChild(renderer.domElement);

  var center = new THREE.Vector3(0,0,0)

  utils.pointAt(center,camera)


  scene.add(raw.hemiLight(new THREE.Vector3(0,0,1000)))
  scene.add(raw.Ground(1000, center));
  scene.add(raw.Sky(500, center))
  scene.add(raw.Buildings(new THREE.Vector3(0,0,-1)))

  var tween = new TWEEN.Tween(camera.position).to({
      x: 0,
      y: 0,
    z: 200
  }).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
      camera.lookAt(center);
  }).onComplete(function () {
      camera.lookAt(center);
  }).start();

  
}



module.exports = setting