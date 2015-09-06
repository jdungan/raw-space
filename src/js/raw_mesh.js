var THREE = require("three")
var raw_space = require("./mesh.js")

var meshes = {}

meshes.Sky = function(size, v) {

  var geometry = new THREE.SphereGeometry(size, 16, 16, 0, Math.PI, 0, Math.PI)

  var material = new THREE.MeshBasicMaterial({
    color: 0xCCFFFF,
    side: THREE.DoubleSide
  })
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(v.x, v.y, v.z)

  return mesh

}


meshes.Ground = function(size, v) {
  
  var geometry = new THREE.PlaneBufferGeometry(800, 481)
  var groundTexture = THREE.ImageUtils.loadTexture("img/RAW_Property_Low.jpg");
  groundTexture.minFilter = THREE.NearestFilter
  // groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  // groundTexture.repeat.set(size, size);
  // groundTexture.anisotropy = 16;

  var material = new THREE.MeshPhongMaterial({
    // color: 0xffffff,
    // specular: 0x111111,
    map: groundTexture,
    side: THREE.DoubleSide,
    receiveShadow: true
  });

  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(v.x, v.y, v.z)

  return mesh
}

meshes.Buildings = function( v ){
  
  var loader = new THREE.JSONLoader();

  var bldg = loader.parse(raw_space)
  
  var scale  = 0.015
  
  mesh = new THREE.Mesh( bldg.geometry, new THREE.MeshFaceMaterial(bldg.materials)  );
  // mesh.position.set(v.x+75, v.y+220, v.z)
  
  mesh.scale.set( scale, scale, scale );
  
  mesh.position.set(v.x-175, v.y+100, v.z)

  
  // mesh.rotation.z = Math.PI / 2;
  mesh.rotation.y = Math.PI / 2;
  mesh.rotation.x = Math.PI / 2;

  // mesh.overdraw = true;
 
  return mesh
  
}

meshes.hemiLight = function (v){
  
  var hemiLight = new THREE.HemisphereLight(0x99FFFF, 0xCC0033, 1.5);
  hemiLight.color.setHSL(.66, 0, .45);
  hemiLight.groundColor.setHSL(0, 0, 0);
  hemiLight.position.set(v.x, v.y, v.z);
  hemiLight.visible = true
  hemiLight.castShadow = true
  return hemiLight;
  
}


module.exports = meshes