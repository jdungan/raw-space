

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

  controls = new THREE.VRflight(camera);
  controls.movementSpeed = 50;
  controls.domElement = container;

  hemiLight = new THREE.HemisphereLight(0x99FFFF, 0xCC0033, 1.5);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 0, 2000);
  hemiLight.visible = true
  hemiLight.castShadow = true


  scene.add(hemiLight);

  // select counties using fips number for state
  var counties = coords(20)
  var state = borders(counties)
  state.position.z = 5
  scene.add(state)

  var center = Centroid(_.flatten(counties))

  pointAt(center)

  // var arrows = HelperArrows(center)
  //
  // scene.add(arrows)


  // vr_controls = new THREE.VRControls( camera );

  // world sphere
  scene.add(GroundPlane(1100, center));
  scene.add(SkyDome(1000, center))
  scene.add(HellDome(1000, center))


  _.forEach(wells, function(well) {
    points = projection([well.lng, well.lat])
    well.lat = points[1]
    well.lng = points[0]

    scene.add(WellSite(well))

    scene.add(WellColumn(well))

    scene.add(KellyBushing(well));

    if (well.reservoir.top) {
      scene.add(Reservoir(well))
    }
  })

}



init()


render()