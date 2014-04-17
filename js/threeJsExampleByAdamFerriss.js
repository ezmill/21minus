var scene, camera, renderer, controls, mesh;
var angularSpeed = 0.2;
var lastTime = 0;
var counter = 0;
clearBG = false;
init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = -100;
    scene.add(camera);
    if (Detector.webgl) {
        if (clearBG == false) {
            renderer = new THREE.WebGLRenderer();
        } else {
            renderer = new THREE.WebGLRenderer({
                preserveDrawingBuffer: true
            });
            renderer.autoClearColor = false;
        }
    } else {
        renderer = new THREE.CanvasRenderer();
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera);
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0, 600, 0);
    scene.add(light);
    var canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    var ctx = canvas.getContext('2d');
    var texture = new THREE.Texture(canvas);
    var img = new Image();
    img.src = "17.png";
    img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var input = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var inputData = input.data;
        var w = canvas.width,
            h = canvas.height;
        ctx.putImageData(input, 0, 0);

        function copyLoop() {
            var copy = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var copyData = copy.data;
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var pixel = (y * w + x) * 4;
                    var red = pixel;
                    var green = pixel + 1;
                    var blue = pixel + 2;
                    var alpha = pixel + 3;
                    if (copyData[pixel + 2] < copyData[pixel]) {
                        swap(copyData, red, red - 4 * w - 4, green, green - 4 * w - 4, blue, blue - 4 * w - 4, alpha, alpha - 3);
                    }
                }
            }
            ctx.putImageData(copy, 0, 0);
            if (texture) texture.needsUpdate = true;
            texture.magFilter = THREE.NearestFilter;
            if (counter % 600 == 0) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            counter++;
        }
        setInterval(function () {
            copyLoop();
        }, 30);
    };
    material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false
    });
    material.transparent = true;
    group = new THREE.Object3D();
    for (var i = -100; i < 100; i += 35) {
        for (var j = -100; j < 100; j += 35) {
            for (var k = -100; k < 100; k += 35) {
                mesh = new THREE.Mesh(new THREE.CubeGeometry(30, 30, 30), material);
                mesh.position.set(i, j, k);
                group.add(mesh);
            }
        }
    }
    scene.add(group);
    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyBox = new THREE.Mesh(skyBoxGeometry, material);
    scene.add(skyBox);
}

function animate() {
    var time = (new Date()).getTime();
    var timeDiff = time - lastTime;
    var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 10000;
    group.rotation.x += angleChange;
    group.rotation.y += angleChange;
    lastTime = time;
    requestAnimationFrame(animate);
    render();
    update();
}

function update() {
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}

function swap(x, rl, rr, gl, gr, bl, br, al, ar) {
    var tempr = x[rl];
    x[rl] = x[rr];
    x[rr] = tempr;
    var tempg = x[gl];
    x[gl] = x[gr];
    x[gr] = tempg;
    var tempb = x[bl];
    x[bl] = x[br];
    x[br] = tempb;
    var tempa = x[al];
    x[al] = x[ar];
    x[ar] = tempa;
}

function partition(a, l, r) {
    var i = l;
    var j = r;
    var temp;
    var pivot = a[(i + j) / 2];
    while (i <= j) {
        while (a[i] < pivot) {
            i++;
        }
        while (a[j] > pivot) {
            j--;
        }
        if (i <= j) {
            temp = a[i];
            a[i] = a[j];
            a[j] = temp;
            i++;
            j--;
        }
    }
    return i;
}

function quicksort(x, left, right) {
    var index = partition(x, left, right);
    if (left < index - 4) {
        quicksort(x, left, index - 4);
    }
    if (index > right) {
        quicksort(x, index, right);
    }
}

function clear() {
    renderer.clear();
}
document.addEventListener('mousedown', clear, false);