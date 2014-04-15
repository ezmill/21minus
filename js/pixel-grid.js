var video = document.querySelector("#videoElement");
var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext('2d');
var width = 500;
var height = 375;
canvas.width = width;
canvas.height = height;

var values=new Array(width)
for (i=0; i <height; i++){
	values[i]=new Array(height);
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
 
if (navigator.getUserMedia) {       
    navigator.getUserMedia({video: true}, success, failure);
}

 
function success(stream) {
    video.src = window.URL.createObjectURL(stream);
    video.play();
     //setup(stream);
    window.requestAnimationFrame(draw);
}
  
function failure(e) {
    console.log("nope lol")
}

for (var i = 0; i < height; i++) {
	for (var j = 0; j < width; j++) {
		var pixel = (i*width+j);
		var red = pixel;
		var green = pixel+1;
		var blue = pixel + 2;
		//brightness
		var brightness = (0.2126*red + 0.7152*green + 0.0722*blue)
		values[i][j] = brightness;

	};
}
var frames=[]
function draw(){

	var frame = readFrame();
	var imagePixels = ctx.createImageData(width,height);
	for(var i = 0; i < frame.data.length; i++){
		imagePixels.data[i] = frame.data.length;
	}

	frames.push(imagePixels)

	for (var y = 0; y < height; y++){
		for(var x = 0; x < width; x++){
			var pixel = (i*width+j);
			var red = pixel;
			var green = pixel+1;
			var blue = pixel + 2;
			ctx.lineTo()
			ctx.strokeStyle = 'rbga(' + red + ',' + blue + ',' + green + ',0)';
			ctx

		}
	}
window.requestAnimationFrame(draw);

}

function readFrame() {
    try {
      ctx.drawImage(video, 0, 0, width, height);
    } catch (e) {
      // The video may not be ready, yet.
      return null;
    }

    return ctx.getImageData(0, 0, width, height);
}
