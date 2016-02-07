
// this function should take in a width and height and possibly a link element and result
// in the download of a fractal image at least as big

// there are a few different strategies I've found to do this, and al are a bit wonky
// GPU computing on my server can't happen, non-GPU compputing would take very long time,
// and JS kinda gets angry at multiple renders and copies of the data.
// So this is kind of experimental.
function renderLarge(width, height, linkElement){
    var blockWidth=Math.ceil(width/size[0]), blockHeight=Math.ceil(height/size[1]);
    var blockCount=Math.max(blockWidth, blockHeight);
    width=blockCount*canvas.width;
    height=blockCount*canvas.height;
    var saveZoom=zoom;
    var upperLeft={x:-size[0]*zoom/2+loc[0], y:-size[1]*zoom/2+loc[1]};
    var fractalSize={x:size[0]*zoom,y:size[1]*zoom};
    setUniform1f(program, "u_zoom",zoom/blockCount);
    console.log(loc);
    var blockSize={x:fractalSize.x/blockCount,y:fractalSize.y/blockCount};
    var bigLoc={x:0,y:0};
    var png = new PNGlib(width, height, 256);
    
    var buf = new Uint8Array(gl.canvas.width * gl.canvas.height * 4);
    // var final_buf = new Uint8Array(width * height * 4);
    for(var x=0;x<blockCount;x++){
        bigLoc.x=upperLeft.x+(x+.5)*blockSize.x;
        for(var y=0;y<blockCount;y++){
            bigLoc.y=upperLeft.y+(y+.5)*blockSize.y;
            setUniform2f(program, "u_loc",bigLoc.x,bigLoc.y);
            render();
            gl.readPixels(0, 0, gl.canvas.width, gl.canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, buf);
            for(var nX=0;nX<gl.canvas.width && nX+x<width;nX++){
                for(var nY=0;nY<gl.canvas.height && nY+y<height;nY++){
                    var index=4*(nX+nY*gl.canvas.width);
                    // var final_index = (nX+x*gl.canvas.width) + (nY+y*gl.canvas.height)*width;
                    // final_buf[final_index] = buf[index];
                    // final_buf[final_index + 1] = buf[index+1];
                    // final_buf[final_index + 2] = buf[index+2];
                    png.buffer[png.index(nX+x*gl.canvas.width, nY+y*gl.canvas.height)]=png.color(buf[index], buf[index+1], buf[index+2]);

                }
            }
        }
    }
    // saveImageAndDownload(window.btoa(final_buf));
    // window.open('data:image/png;base64,'+png.getBase64(), "fractalLarge.png");
    downloadURI('data:image/png;base64,'+png.getBase64(), "fractalLarge.png", linkElement);
    
    // revert to the view you were at before
    bigLoc.x=upperLeft.x+(blockCount/2+.5)*blockSize.x;
    bigLoc.y=upperLeft.y+(blockCount/2+.5)*blockSize.y;
    console.log(bigLoc.x, bigLoc.y);
    setUniform2f(program, "u_loc", loc[0],loc[1]);
    setUniform1f(program, "u_zoom", zoom);
    setTimeout(render, 1000);
}

// makes a modal window with a link to the fractal
function generateLink(el){
    var url = exportFractal();
    modalWindow("To share this fractal, you can simply share this unfortunately lengthy url:<br />"+
                '<a href="http://dijitalelefan.com/projects/fractalGL/?id='+url+'" title="Cool Fractal!">'+
                'http://dijitalelefan.com/projects/fractalGL/?id='+url+'</a>', el);
}

// saves the fractal and returns an identifying string
function exportFractal(){
    var data={
      fractalParams: fractalParams,
      zoom: zoom, 
      loc: loc,
      mLoc: mLoc, 
      pallet: elements.gradientSelector.gradient.getPalletData()
    };
    var idString = Date.now().toString(36) + randomString(5);
    ajax("", {id: idString, data: JSON.stringify(data), api_request: "save_fractal_data"});
    return idString;
}

// If the url is like /fractalGL/?id=xxxxxx, then the PHP code will ensure the creation of
// an element in the head tag with 
function loadFractal(){
    var dataElem = document.getElementById("fractalData");
    if(dataElem.getAttribute("preset") == "true"){
        try{
            var dataString = dataElem.getAttribute("json");
            var data=JSON.parse(dataString);
            fractalParams=data.fractalParams;
            juliaTracking=false;
            zoom=data.zoom;
            loc=data.loc;
            mLoc=data.mLoc;
            document.getElementById("gradientSelector").gradient.setPallet(data.pallet);
            recompile();
        }catch(err){
            console.log("an error occured! Oops",err);
        }
    }
}



function printPallet(){
    document.getElementById("gradientSelector").gradient.printPallet();
}
