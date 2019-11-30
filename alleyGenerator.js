
var camera, scene, renderer;

var floorGeometry, floorMaterial, floorMesh, floorTexture;
var boxGeometry, boxMaterial, boxMesh, boxTexture;
var controls;
var light;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

var buildings = [];

function init() {

    // Create a camera
    // 	Set a Field of View (FOV) of 75 degrees
    // 	Set an Apsect Ratio of the inner width divided by the inner height of the window
    //	Set the 'Near' distance at which the camera will start rendering scene objects to 2
    //	Set the 'Far' (draw distance) at which objects will not be rendered to 1000
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    //camera.position.set( 100, 200, 300 );
    
    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 400, 1000 );

    // Create a HemisphereLight source
    light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add( light );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 200, 100 );
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    scene.add( light );

    // Create First Person Controls
    controls = new THREE.FirstPersonControls( camera );
    scene.add( controls.getObject() );

    // Create FLOOR
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
    
    // GRID
    var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );
    
    // LOAD models
    loadModels();
    // PUT models into the scene
    generateAlley();
    
    // Create a WebGL Renderer
    renderer = new THREE.WebGLRenderer();
    // Set the size of the renderer to the inner width and inner height of the window
    renderer.setSize( window.innerWidth, window.innerHeight );
    // Add in the created DOM element to the body of the document
    document.body.appendChild( renderer.domElement );

}

function animate() {

    // Call the requestAnimationFrame function on the animate function
    requestAnimationFrame( animate );
    //console.log(buildings.length);

    // Check the FirstPersonControls object and update velocity accordingly
    playerControls();
    //controls.getObject().translateX(0.1 );

    // Render everything using the created renderer, scene, and camera
    renderer.render( scene, camera );

}

// load my models for alley
function loadModels() {
    var loader = new THREE.FBXLoader();
    loader.load( 'models/shop1.fbx', function ( object ) {
        buildings.push(object);
    }, undefined, function ( e ) {
        console.error( e );
    } );
    loader.load( 'models/shop2.fbx', function ( object ) {
        buildings.push(object);
    }, undefined, function ( e ) {
        console.error( e );
    } );
    loader.load( 'models/shop3.fbx', function ( object ) {
        buildings.push(object);
    }, undefined, function ( e ) {
        console.error( e );
    } );
    loader.load( 'models/shop4.fbx', function ( object ) {
        buildings.push(object);
    }, undefined, function ( e ) {
        console.error( e );
    } );
    loader.load( 'models/shop5.fbx', function ( object ) {
        buildings.push(object);
        console.log("loaded "+ buildings.length + " models.");
    }, undefined, function ( e ) {
        console.error( e );
    } );
}

// generate a map
function generateAlley() {
    var xLoc = 0;
    for(var i = 0; i < buildings.length; i++){
        xLoc -= 100
        buildings[i].translateX(xLoc);
        scene.add( building[i] );
    }
}

function playerControls () {

    // Are the controls enabled? (Does the browser have pointer lock?)
    if ( controls.controlsEnabled ) {

        // Save the current time
        var time = performance.now();
        // Create a delta value based on current time
        var delta = ( time - prevTime ) / 1000;

        // Set the velocity.x and velocity.z using the calculated time delta
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        // As velocity.y is our "gravity," calculate delta
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        if ( controls.moveForward ) {
            velocity.z -= 400.0 * delta;
        }

        if ( controls.moveBackward ) {
            velocity.z += 400.0 * delta;
        }

        if ( controls.moveLeft ) {
            velocity.x -= 400.0 * delta;
        }

        if ( controls.moveRight ) {
            velocity.x += 400.0 * delta;
        }

        // Update the position using the changed delta
        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );

        // Prevent the camera/player from falling out of the 'world'
        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

        }

        // Save the time for future delta calculations
        prevTime = time;

    }
}

init();
animate();
