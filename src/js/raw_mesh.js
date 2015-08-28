var THREE = require("three")
var raw_space = require("./mesh.js")

var meshes = {}

meshes.SkyDome = function(size, v) {

  var geometry = new THREE.SphereGeometry(size, 16, 16, 0, Math.PI, 0, Math.PI)

  var material = new THREE.MeshBasicMaterial({
    color: 0xCCFFFF,
    side: THREE.DoubleSide
  })
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(v.x, v.y, v.z)

  return mesh

}


meshes.GroundPlane = function(size, v) {
  
  var geometry = new THREE.PlaneBufferGeometry(800, 481)
  var groundTexture = THREE.ImageUtils.loadTexture("img/large area with points.jpg");
  groundTexture.minFilter = THREE.NearestFilter
  // groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  // groundTexture.repeat.set(size, size);
  groundTexture.anisotropy = 16;

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
  
  mesh = new THREE.Mesh( bldg.geometry, new THREE.MeshFaceMaterial(bldg.materials)  );
  mesh.position.set(v.x+75, v.y+220, v.z)
  mesh.scale.set( .012, .012, .012 );
  
  mesh.rotation.x = Math.PI / 2;
  
  // mesh.overdraw = true;
 
  return mesh
  
}

module.exports = meshes