var THREE = require("three")

var objects = {}

objects.SkyDome = function(size, v) {

  var geometry = new THREE.SphereGeometry(size, 16, 16, 0, Math.PI, 0, Math.PI)

  var material = new THREE.MeshBasicMaterial({
    color: 0xCCFFFF,
    side: THREE.DoubleSide
  })
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(v.x, v.y, v.z)

  return mesh

}


objects.GroundPlane = function(size, v) {
  
  
  
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

module.exports = objects