
var _ = require("underscore")
var THREE = require("three")
var TWEEN = require("tween.js")
var VRflight = require("./VRflight")
var FlyControls = require("./FlyControls")

var raw = require("./raw_mesh")
var utils = require("./utils")

setting = {}

container = document.createElement('div');
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


setting.animate = function () {

  requestAnimationFrame(setting.animate);

  controls.update(clock.getDelta());      
  
  // if (display_mode == 'vr' ) {
  //   vr_effect.render(scene, camera);
  // } else {
    renderer.render(scene, camera);
  // }
   TWEEN.update();
 }

setting.init = function () {
  
  
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
  scene.add(raw.GroundPlane(1000, center));
  scene.add(raw.SkyDome(500, center))
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