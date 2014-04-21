var angle = 0.0;
//var copyData;
var cos = Math.cos(angle);
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
var cosOff = map_range(cos, -1, 1, 0, 255);
  canvas=document.createElement('canvas');
  document.querySelector("div").appendChild(canvas);
  canvas.id = "bbSortCanvas"

  scale = 1;
  img = new Image();
  img.src = "img/plant1.jpg";
     canvas.width=400;
   canvas.height=400;
  // height = img.height * scale;
  // width = img.width * scale;

  // if( height > window.innerHeight ){
  //   scale = 0.5;
  //   height = img.height * scale;
  //   width = img.height * scale;
  // }
  // $("canvas").css("width", width).css("height", height).attr('width', width).attr('height', height);;
  // test
  
  img.onload = function(){

    var ctx=canvas.getContext('2d');
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    var input=ctx.getImageData(0,0,canvas.width,canvas.height);
    var inputData=input.data;
    var w=canvas.width,h=canvas.height;
    ctx.putImageData(input,0,0);
    function draw(){
        var copy=ctx.getImageData(0,0,canvas.width,canvas.height);
       copyData=copy.data;
        for(var y=0;y<h;y++){
          for(var x=0;x<w;x++){
          var pixel=(y*w+x)*4;
          var red=pixel;
          var green=pixel+1;
          var blue=pixel+2;
          var alpha=pixel+3;

          var col = new THREE.Color(getCol(x, y));
          var brightness = getBri(col);
           // if ( y === 2) console.log(brightness);
          if(brightness < 0.6){
            // swap(copyData,red,red-4*w-4,green,green-4*w-4,blue,blue-4*w-4);
            swap(copyData,red,red+4,green,green+4,blue,blue+4, alpha, alpha+4);

             }
           }
        }
        ctx.putImageData(copy,0,0);
        angle += 0.1;
    }
      setInterval(function(){draw();},30);

  };
  

function swap(x,rl,rr,gl,gr,bl,br,al,ar){
  var tempr=x[rl];
  x[rl]=x[rr];
  x[rr]=tempr;
  var tempg=x[gl];
  x[gl]=x[gr];
  x[gr]=tempg;
  var tempb=x[bl];
  x[bl]=x[br];
  x[br]=tempb;
  var tempa=x[al];
  x[al]=x[ar];
  x[ar]=tempa;
}

function getCol(x, y) {
  var base = (Math.floor(y) * (canvas.width + 1) + Math.floor(x)) * 4;
  var c = {
    r: copyData[base + 0],
    g: copyData[base + 1],
    b: copyData[base + 2],
    a: copyData[base + 3]
  };
  return (c.r << 16) + (c.g << 8) + c.b;
}

//return pixel brightness between 0 and 1 based on human perceptual bias

function getBri(c) {
  return (0.34 * c.r + 0.5 * c.g + 0.16 * c.b);
}



