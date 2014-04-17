var fov = 70;
var canvasWidth = 320 / 2;
var canvasHeight = 240 /2;
var vidWidth = 320;
var vidHeight = 240;
var tiltSpeed = 0.1;
var tiltAmount = 0.5;

var camera, scene, renderer;
var video, videoTexture;
var camera, scene, renderer;
var mouseX = 0;
var mouseY = 0;
var windowHalfX, windowHalfY;
var video, videoTexture;
var world3D;
var geometry;
var vidCanvas;
var ctx;
var pixels;
var noisePosn = 0;
var wireMaterial;
var meshMaterial;
var container, prompt;
var params;

function detectSpecs(){
	container = document.querySelector('#container');
	prompt = document.querySelector('#prompt');
	container.style.display = 'none';

	var hasWebgl = (function() {
		try {
			return !!window.WebGLRenderingContext && !! document.createElement('canvas').getContext('experimental-webgl');
		} catch (e) {
			return false;
		}
	})();

	var hasGetUserMedia = (function() {
		return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
	})();

	if (!hasGetUserMedia) {
		prompt.innerHTML = 'This demo requires webcam support (Chrome or Opera).';
	} else if (!hasWebgl) {
		prompt.innerHTML = 'No WebGL support detected. Please try restarting the browser.';
	} else {
		prompt.innerHTML = 'Please allow camera access.';
		init();
	}
}

function init() {

	// stop the user getting a text cursor
	document.onselectstart = function() {
		return false;
	};

 	params = new WCMParams();

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 5000);
	camera.target = new THREE.Vector3(0, 0, 0);
	scene.add(camera);
	camera.position.z = 600;

	video = document.createElement('video');
	video.width = vidWidth;
	video.height = vidHeight;
	video.autoplay = true;
	video.loop = true;

	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	//get webcam
	navigator.getUserMedia({
		video: true
	}, function(stream) {
		//on webcam enabled
		video.src = window.URL.createObjectURL(stream);
		prompt.style.display = 'none';
		container.style.display = 'inline';
	}, function(error) {
		prompt.innerHTML = 'Unable to capture WebCam. Please reload the page.';
	});

	videoTexture = new THREE.Texture(video);

	world3D = new THREE.Object3D();
	scene.add(world3D);

	// //add mirror plane
		geometry = new THREE.PlaneGeometry(640, 480, canvasWidth, canvasHeight);
		geometry.dynamic = true;
	// geometry = new THREE.Geometry();
	// for ( var x = 0; x < canvasWidth; x ++ ) {
	// 	for( var y = 0; y < canvasHeight; y++){

	// 	var vertex = new THREE.Vector3();
	// 	vertex.x = x;
	// 	vertex.y = y;
	// 	vertex.z =
        
	// 	geometry.vertices.push( vertex );
	// 	}
	// }

	// meshMaterial = new THREE.MeshBasicMaterial({
	// 	opacity: 1,
	// 	map: videoTexture
	// });
	var particleMaterial = new THREE.ParticleSystemMaterial({
		map: videoTexture,
		size: 100.0
	});
	var mirror = new THREE.ParticleSystem(geometry, particleMaterial);
	world3D.add(mirror);



	//add wireframe plane
	// wireMaterial = new THREE.MeshBasicMaterial({
	// 	opacity: 0.1,
	// 	color: 0xffffff,
	// 	wireframe: true,
	// 	blending: THREE.AdditiveBlending,
	// 	transparent: true
	// });
	// var wiremirror = new THREE.Mesh(geometry, wireMaterial);
	// world3D.add(wiremirror);
	// wiremirror.position.z = 5;

	//init renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.sortObjects = false;
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	vidCanvas = document.createElement('canvas');
	document.body.appendChild(vidCanvas);
	vidCanvas.style.position = 'absolute';
	vidCanvas.style.display = 'none';
	ctx = vidCanvas.getContext('2d');

	renderer.domElement.addEventListener("webglcontextlost", function(event) {
		prompt.style.display = 'inline';
		prompt.innerHTML = 'WebGL Context Lost. Please try reloading the page.';
	}, false);

	onResize();

	animate();

}

function getZDepths() {

	//noisePosn += params.noiseSpeed;

	//draw webcam video pixels to canvas for pixel analysis
	//double up on last pixel get because there is one more vert than pixels
	ctx.drawImage(video, 0, 0, canvasWidth + 1, canvasHeight + 1);
	pixels = ctx.getImageData(0, 0, canvasWidth + 1, canvasHeight + 1).data;

	for (var i = 0; i < canvasWidth + 1; i++) {
		for (var j = 0; j < canvasHeight + 1; j++) {
			var color = new THREE.Color(getColor(i, j));
			var brightness = getBrightness(color);
			var gotoZ = params.zDepth * brightness - params.zDepth / 2;

			//add noise wobble
			//gotoZ += perlin.noise(i * params.noiseScale, j * params.noiseScale, noisePosn) * params.noiseStrength;
			//invert?
			//if (params.invertZ) gotoZ = -gotoZ;
			//tween to stablize
			geometry.vertices[j * (canvasWidth + 1) + i].z += (gotoZ - geometry.vertices[j * (canvasWidth + 1) + i].z) / 5;
		}
	}
	geometry.verticesNeedUpdate = true;
}
function WCMParams() {
	this.zoom = 1;
	this.mOpac = 1;
	this.wfOpac = 0.1;
	this.contrast = 3;
	this.saturation = 1;
	this.invertZ = false;
	this.zDepth = 400;
	this.noiseStrength = 200;
	this.noiseScale = 0.01;
	this.noiseSpeed = 0.02;
	//this.doSnapshot = function() {};
}
function onMouseMove(event) {
	mouseX = (event.clientX - windowHalfX) / (windowHalfX);
	mouseY = (event.clientY - windowHalfY) / (windowHalfY);
}

function animate() {
	if (video.readyState === video.HAVE_ENOUGH_DATA) {
		videoTexture.needsUpdate = true;
		getZDepths();
	}
	requestAnimationFrame(animate);
	render();
}

function render() {
	world3D.scale = new THREE.Vector3(params.zoom*4, params.zoom*4, 1);
	world3D.rotation.x += ((mouseY * tiltAmount) - world3D.rotation.x) * tiltSpeed;
	world3D.rotation.y += ((mouseX * tiltAmount) - world3D.rotation.y) * tiltSpeed;
	//camera.lookAt(camera.target);
	renderer.render(scene, camera);
}

function onResize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
}

// Returns a hexidecimal color for a given pixel in the pixel array.

function getColor(x, y) {
	var base = (Math.floor(y) * (canvasWidth + 1) + Math.floor(x)) * 4;
	var c = {
		r: pixels[base + 0],
		g: pixels[base + 1],
		b: pixels[base + 2],
		a: pixels[base + 3]
	};
	return (c.r << 16) + (c.g << 8) + c.b;
}

//return pixel brightness between 0 and 1 based on human perceptual bias

function getBrightness(c) {
	return (0.34 * c.r + 0.5 * c.g + 0.16 * c.b);
}

function onWheel(event) {

	params.zoom += event.wheelDelta * 0.002;
	//limit
	params.zoom = Math.max(params.zoom, 0.1);
	params.zoom = Math.min(params.zoom, 5);

	//update gui slider
	gui.__controllers[0].updateDisplay();
}


//start the show
detectSpecs();