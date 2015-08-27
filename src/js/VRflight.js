var THREE = require("three")
/**
 * @author John A. Dungan / http://www.github.com/jdungan

 Adapted from FlyControls by James Baicoianu / http://www.baicoianu.com/
 and VRControls by dmarcos / https://github.com/dmarcos and mrdoob / http://mrdoob.com
 */ 


THREE.VRflight = function ( object, domElement, onError ) {
  
	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	if ( domElement ) this.domElement.setAttribute( 'tabindex', -1 );

	// API

	this.movementSpeed = 1.0;
	this.rollSpeed = 0.005;
	this.dragToLook = false;
	this.autoForward = false;


	// internals
  
	var scope = this;
	var vrInputs = [];
	this.moveState = { left: 0, right: 0, forward: 0, back: 0};
	this.moveVector = new THREE.Vector3( 0, 0, 0 );

	function filterInvalidDevices( devices ) {

		// Exclude Cardboard position sensor if Oculus exists.

		var oculusDevices = devices.filter( function ( device ) {

			return device.deviceName.toLowerCase().indexOf('oculus') !== -1;

		} );

		if ( oculusDevices.length >= 1 ) {

			return devices.filter( function ( device ) {

				return device.deviceName.toLowerCase().indexOf('cardboard') === -1;

			} );

		} else {

			return devices;

		}

	}

	function gotVRDevices( devices ) {

		devices = filterInvalidDevices( devices );

		for ( var i = 0; i < devices.length; i ++ ) {

			if ( devices[ i ] instanceof PositionSensorVRDevice ) {

				vrInputs.push( devices[ i ] );

			}

		}

		if ( onError ) onError( 'HMD not available' );

	}
  
	if ( navigator.getVRDevices ) {
		navigator.getVRDevices().then( gotVRDevices );
	}
  
  
	// the Rift SDK returns the position in meters
	// this scale factor allows the user to define how meters
	// are converted to scene units.

	this.scale = 1;

	this.resetSensor = function () {

		for ( var i = 0; i < vrInputs.length; i ++ ) {

			var vrInput = vrInputs[ i ];

			if ( vrInput.resetSensor !== undefined ) {

				vrInput.resetSensor();

			} else if ( vrInput.zeroSensor !== undefined ) {

				vrInput.zeroSensor();

			}

		}

	};

	this.zeroSensor = function () {

		THREE.warn( 'THREE.VRControls: .zeroSensor() is now .resetSensor().' );
		this.resetSensor();

	};
  
	if ( navigator.getVRDevices ) {
		navigator.getVRDevices().then( gotVRDevices );
	}
  
  

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

  this.spacebardown = false
  
  this.worldQ = new THREE.Quaternion()
  this.startQ = new THREE.Quaternion()
  this.stopQ = new THREE.Quaternion()

	this.keydown = function( event ) {

		if ( event.altKey ) {

			return;

		}

		switch ( event.keyCode ) {

			case 38: /*up*/ this.moveState.forward = 1; break;
			case 40: /*down*/ this.moveState.back = 1; break;

			case 37: /*left*/ this.moveState.left = 1; break;
			case 39: /*right*/  this.moveState.right = 1; break;
    
      case 32:
        // spacebar
        this.spacebardown = true
        this.startQ = object.quaternion.normalize()
        break;
		}

		this.updateMovementVector();

	};

	this.keyup = function( event ) {

		switch ( event.keyCode ) {

			case 38: /*up*/ this.moveState.forward = 0; break;
			case 40: /*down*/ this.moveState.back = 0; break;
      
			case 37: /*left*/ this.moveState.left = 0; break;
			case 39: /*right*/  this.moveState.right = 0; break;
      
      case 32: 
        //space bar
        this.spacebardown = false
        this.stopQ = object.quaternion.normalize()
        
        console.log(this.stopQ)
        
        this.worldQ.copy(        this.stopQ.inverse().multiply(this.startQ) ).normalize()
        // this.worldQ.copy(this.stopQ.multiply(this.startQ))

        break
		}

		this.updateMovementVector();

	};

  this.update_count = 0

	this.update = function( delta ) {
    
		var moveMult = delta * this.movementSpeed;

		this.object.translateX( this.moveVector.x * moveMult );
		this.object.translateZ( this.moveVector.z * moveMult );


		for ( var i = 0; i < vrInputs.length; i ++ ) {

			var vrInput = vrInputs[ i ];

			var state = vrInput.getState();

			if ( state.orientation !== null ) {
        
        
        if (this.spacebardown){

          
        } else {


          // object.quaternion.copy(state.orientation);
          
          so = state.orientation
          
          oculusQ = new THREE.Quaternion(so.x, so.y,so.z,so.w)
          

          object.quaternion.copy( oculusQ.multiply(this.worldQ));
          
          this.update_count += 1
          if (this.update_count%100 === 0){
            this.update_count =0 
            console.log(this.worldQ)
          }
          
          
        }
        

			}

		}

	};




  this.updateMovementVector = function() {

    var forward = ( this.moveState.forward || ( this.autoForward && !this.moveState.back ) ) ? 1 : 0;
  
    this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
    // this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
    this.moveVector.z = ( -forward + this.moveState.back );

    //console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

  };


	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	window.addEventListener( 'keydown', bind( this, this.keydown ), false );
	window.addEventListener( 'keyup',   bind( this, this.keyup ), false );



	this.updateMovementVector();


};
