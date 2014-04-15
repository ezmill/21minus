new Uploader("html", setImage);
new Uploader("#upload", setImage);

function setImage(uri){
  canvas=document.createElement('canvas');
  document.body.appendChild(canvas);
   canvas.width=400;
   canvas.height=400;
  scale = 1;
  img = new Image();
  img.src = uri;
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
    function copyLoop(){
        var copy=ctx.getImageData(0,0,canvas.width,canvas.height);
        var copyData=copy.data;
        for(var y=0;y<h;y++){
          for(var x=0;x<w;x++){
          var pixel=(y*w+x)*4;var red=pixel;
          var green=pixel+1;var blue=pixel+2;
          if(copyData[pixel-w*4]>copyData[pixel]){
            swap(copyData,red,red-4*w-4,green,green-4*w-4,blue,blue-4*w-4);
              }
           }
        }
        ctx.putImageData(copy,0,0);
        
    }
      setInterval(function(){copyLoop();},30);

  };
  
}

function swap(x,rl,rr,gl,gr,bl,br){
  var tempr=x[rl];
  x[rl]=x[rr];
  x[rr]=tempr;
  var tempg=x[gl];
  x[gl]=x[gr];
  x[gr]=tempg;
  var tempb=x[bl];
  x[bl]=x[br];
  x[br]=tempb;
}

