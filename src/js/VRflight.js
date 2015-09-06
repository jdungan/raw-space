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
	this.rollSpeed = 1;
	this.dragToLook = false;
	this.autoForward = false;


	// internals
  
	var scope = this;
	var vrInputs = [];
	this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );
  this.tmpQuaternion = new THREE.Quaternion();


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


  this.KeyIncrement = function (shiftKey,keyCode, keyState){
    
    
    if (shiftKey) {

      console.log([keyCode,shiftKey])
      
      
  		switch ( keyCode ) {

  			case 38: /*up*/ this.moveState.pitchUp = keyState; break;
  			case 40: /*down*/ this.moveState.pitchDown = keyState; break;

        // case 37: /*left*/ this.moveState.left = keyState; break;
        // case 39: /*right*/  this.moveState.right = keyState; break;

  			case 37: /*left*/ this.moveState.yawLeft = keyState; break;
  			case 39: /*right*/ this.moveState.yawRight = keyState; break;


    
  		}
    } else {

  		switch ( keyCode ) {

  			case 38: /*up*/ this.moveState.forward = keyState; break;
  			case 40: /*down*/ this.moveState.back = keyState; break;

  			case 37: /*left*/ this.moveState.yawLeft = keyState; break;
  			case 39: /*right*/ this.moveState.yawRight = keyState; break;

    
  		}
    }
    
    
  }

	this.keydown = function( event ) {

    this.KeyIncrement (event.shiftKey,event.keyCode,1)
		this.updateMovementVector();
    this.updateRotationVector();
    

	};

	this.keyup = function( event ) {

    this.KeyIncrement (event.shiftKey,event.keyCode,0)
		this.updateMovementVector();
    this.updateRotationVector();

	};

	this.update = function( delta ) {
		var moveMult = delta * this.movementSpeed;
		var rotMult = delta * this.rollSpeed;

		this.object.translateX( this.moveVector.x * moveMult );
		this.object.translateZ( this.moveVector.z * moveMult );
    

		this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
		this.object.quaternion.multiply( this.tmpQuaternion );

		// expose the rotation vector for convenience
		this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );
    


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


	this.updateRotationVector = function() {
    
		this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
    this.rotationVector.y = ( -this.moveState.yawRight  + this.moveState.yawLeft );
    // this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

    console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

	};



	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	window.addEventListener( 'keydown', bind( this, this.keydown ), false );
	window.addEventListener( 'keyup',   bind( this, this.keyup ), false );


};
