// Suuper long function to initialize all the inputs
function initInput(canvas){
    
    // scroll wheel for zooming
    // IE9, Chrome, Safari, Opera
    canvas.addEventListener("mousewheel", function(e){
        var delta = e.wheelDelta || -e.detail;
        delta = delta/Math.abs(delta);
        zoom *= Math.pow(.9, delta);
        setUniform1f(program, "u_zoom", zoom);
        render();
        return false;
    }, false);
    
    // Firefox
    canvas.addEventListener("DOMMouseScroll", function(e){
        var delta = e.wheelDelta || -e.detail;
        delta = delta/Math.abs(delta);
        var oldZoom = zoom;
        zoom *= Math.pow(.9, delta);
        setUniform1f(program, "u_zoom", zoom);
        
        // zoom into where the pointer is
        if(zoom < oldZoom){
            loc[0] -= (e.clientX-size[0]/2)*(zoom-oldZoom);
            loc[1] += (e.clientY-size[1]/2)*(zoom-oldZoom);
            setUniform2f(program, "u_loc",loc[0],loc[1]);
        }
        render();
        return false;
    }, false);
    
    // mouse dragging to move the fractal, requiring mousedown, mousemove, and mouseup
    canvas.addEventListener("mousedown",function(e){
        clicking=true;
        pLoc=getLocation(e.clientX, e.clientY);
    }, false);
    
    canvas.addEventListener("mousemove",function(e){
        if(clicking){
            var tmp=getLocation(e.clientX, e.clientY);
            moveLoc(tmp, pLoc);
            pLoc=getLocation(e.clientX, e.clientY);
        }
        if(juliaTracking){
            mLoc=getLocation(e.clientX, e.clientY);
            elements.juliaX.value=mLoc[0];
            elements.juliaY.value=mLoc[1];
            setUniform2f(program, "u_c",  mLoc[0], mLoc[1]);
            render();
        }
    }, false);
    
    canvas.addEventListener("mouseup",function(e){clicking=false;}, false);
    
    // toggle julia tracking on double click
    canvas.addEventListener("dblclick", function(e){
        if(julia){
            juliaTracking=!juliaTracking;
            document.getElementById("juliaMouse").checked=juliaTracking;
        }
    }, false);
    
    // capture keypresses, to
    window.addEventListener("keypress",function(e){
        // UP: zoom in
        // Shift + UP: increase julia Y value 
        if(e.keyCode==38){      
            if(e.shiftKey){     
                mLoc[1]-=0.01;
                elements.juliaX.value=mLoc[0];
                elements.juliaY.value=mLoc[1]; 
                
                setUniform2f(program, "u_c",  mLoc[0], mLoc[1]);
            }else{
                zoom*=.8;
                setUniform1f(program, "u_zoom", zoom);
            }
            render();
        }   
        // DOWN: zoom out
        // Shift + DOWN: decrease julia y value
        else if(e.keyCode==40){ 
            if(e.shiftKey){     
                
                mLoc[1]+=0.01;
                elements.juliaX.value=mLoc[0];
                elements.juliaY.value=mLoc[1]; 
                
                setUniform2f(program, "u_c",  mLoc[0], mLoc[1]);
            }else{
                zoom*=1.25;
                setUniform1f(program, "u_zoom", zoom);
            }
            render();
        }
        // Shift + LEFT: decrease julia x value
        else if(e.keyCode == 37 && e.shiftKey == true){
            mLoc[0]-=0.01;
            elements.juliaX.value=mLoc[0];
            elements.juliaY.value=mLoc[1]; 
            
            setUniform2f(program, "u_c",  mLoc[0], mLoc[1]);
            render();
        }
        // Shift + RIGHT: increase julia x value
        else if(e.keyCode == 39 && e.shiftKey == true){
            mLoc[0]+=0.01;
            elements.juliaX.value=mLoc[0];
            elements.juliaY.value=mLoc[1]; 
            
            setUniform2f(program, "u_c",  mLoc[0], mLoc[1]);
            render();
        }
        // j: toggle julia
        else if(e.key == 'j'){
            var julia = document.getElementById("julia");
            julia.checked = !julia.checked;
            parseControls();
        }
        // r: reset viewport
        else if(e.key == 'r'){
            zoom=4/size[1];
            loc=[0,0];
            setUniform1f(program, "u_zoom", zoom);
            setUniform2f(program, "u_loc", loc[0], loc[1]);
            render();
        }
        // c: center viewport
        else if(e.key == 'c'){
            loc=[0,0];
            setUniform2f(program, "u_loc", loc[0], loc[1]);
            render();
        }
        // C: center julia set
        else if(e.key == 'C'){
            mLoc[0]=0;
            mLoc[1]=0;
            elements.juliaX.value=mLoc[0];
            elements.juliaY.value=mLoc[1]; 
            
            setUniform2f(program, "u_c",  mLoc[0], mLoc[1]);
            render();
        }

        return false;
    }, false);
    
    
    // listen to input objects:
    
    // every element with class "recompile" should instigate a recompilation 
    // of the shader when it is changed
    var recompileElements=document.getElementsByClassName("recompile");
    for(var i=0; i<recompileElements.length;i++){
        
        recompileElements[i].addEventListener("change",parseControls, false);
    }
    
    // fractal type selection
    populateFractallist(document.getElementById("fractal0"));
    
    // render type selection
    elements.rendererList=document.getElementById("renderer");
    
    // get render types from shaderDetails, defined in shaderConstruction.js
    for(renderer in shaderDetails.renderers){
        var f=document.createElement("option");
        f.text=deCamel(renderer);
        f.value=renderer;
        elements.rendererList.add(f);
    }
    
    elements.rendererList.value="logarithmicSmoothing";
    
    // toggle whether the Julia parameters are automatically controlled by the mouse
    // (also toggled when key 'j' is clicked)
    elements.juliaMouse=document.getElementById("juliaMouse");
    elements.juliaMouse.addEventListener("change",function(e){
        juliaTracking=e.target.checked;
    });
    
    // control the Julia parameters
    elements.juliaX=document.getElementById("juliaX");
    elements.juliaY=document.getElementById("juliaY");
    elements.juliaX.addEventListener("input",function(e){
        mLoc[0]=elements.juliaX.value;
        mLoc[1]= elements.juliaY.value;
        setUniform2f(program, "u_c",  elements.juliaX.value, elements.juliaY.value);
        render();
    });
    elements.juliaY.addEventListener("input",function(e){
        mLoc[0]=elements.juliaX.value;
        mLoc[1]= elements.juliaY.value;
        setUniform2f(program, "u_c",  elements.juliaX.value, elements.juliaY.value);
        render();
    });
    
    // Download button
    document.getElementById("download").onclick=function(e){
        fractalCount++;
        e.target.setAttribute("download","fractal_"+fractalCount+".png");
        e.target.href=canvas.toDataURL('image/png');
    }
    
    // Large Render button
    elements.renderLarge = document.getElementById("renderLarge");
    if(elements.renderLarge){
        elements.renderLarge.onclick = function(e){
            renderLarge(3200,1600, e.target);
        }
    }
    
    
    // Tabbed Layout controls
    elements.fractalTab = document.getElementById("fractalTab");
    elements.renderTab  = document.getElementById("renderTab");
    elements.fractalControls = document.getElementById("fractalControls");
    elements.renderControls = document.getElementById("renderControls");
    
    elements.fractalTab.addEventListener("click", function(){
        setClass(elements.renderTab,       "active", false);
        setClass(elements.fractalControls, "hidden", false);
        setClass(elements.fractalTab,      "active", true);
        setClass(elements.renderControls,  "hidden", true);
    });
    elements.renderTab.addEventListener("click", function(){
        setClass(elements.renderTab,       "active", true);
        setClass(elements.fractalControls, "hidden", true);
        setClass(elements.fractalTab,      "active", false);
        setClass(elements.renderControls,  "hidden", false);
    });
    
    // gradient controls
    elements.gradientSelector = document.getElementById("gradientSelector");
    elements.gradientSelector.addEventListener("change", function(e){
        if(gl){
            populateColorTexture(e.pallet);
            setUniform4f(program, "u_fgColor", binaryColors[0]);
            setUniform4f(program, "u_bgColor", binaryColors[1]);
            render();
        }
    });
    
    // preset color pallet controlls
    elements.setColorPallet = document.getElementById("setColorPallet");
    elements.setColorPallet.addEventListener("change",function(e){
        if(! elements.gradientSelector)
            elements.gradientSelector = document.getElementById("gradientSelector");
        if(e.target.value=="Random"){
            elements.gradientSelector.gradient.randomPallet();
        }else{
            elements.gradientSelector.gradient.setPallet(pallets[e.target.selectedIndex].pallet);
        }
        render();
    });
    
    // changes size of the image used as an orbit image
    elements.orbitSize = document.getElementById("orbitSize");
    elements.orbitSize.addEventListener("change",function(e){
        orbitImageSize=e.target.value;
        setUniform1f(program, "u_orbitSize", orbitImageSize);
        render();
    });
    
    // Loads images for use with Orbit Image style rendering
    elements.orbitImage = document.getElementById("orbitImage");
    elements.fileLoader = document.getElementById("fileLoader");
    elements.fileLoader.addEventListener("change", function(e){
      
      if(! onServer){
          // On a self hosted site, this works:
          var URL = window.webkitURL || window.URL;
          var url = URL.createObjectURL(elements.fileLoader.files[0]);
          setOrbitImage(url);
      }else{
          // otherwise, this is necessary
          ajaxFileUpload('?image_upload=true', elements.fileLoader.files[0], true, {
              onload: function(response){
                  if (response.readyState === 4) {
                      if (response.status === 200) {
                          setOrbitImage("http://dijitalelefan.com/projects/fractalGL/" + response.responseText);
                      }else{
                          console.error(response.statusText);
                      }
                  }
              }
          });
      }
    });
    
    
}

// actively reads the values set within the control panels to ensure correct parameters
function parseControls(){
    fractalParams={};
    fractalParams.binaryColors = binaryColors;
    if(orbitImage)
        fractalParams.orbitImage={width:orbitImage.width, height:orbitImage.height};

    fractalParams.fractals=[];
    for(var i=0;i<fractalCount;i++)
        fractalParams.fractals[i]=document.getElementById("fractal"+i).value;
    fractalParams.renderer=document.getElementById("renderer").value;
    setClass(elements.orbitImage, "hidden",(fractalParams.renderer.substr(0,10) != 'orbitImage'));
        
    if(document.getElementById("julia").checked)
        fractalParams.julia=true;
    fractalParams.iterations=document.getElementById("iterations").value;
    var radios = document.getElementsByName('escape');

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            fractalParams.escapeType=radios[i].value;
            break;
        }
    }
    if(iterShown)
        fractalParams.iterSkip=document.getElementById("iterSkip").value;
    //fractalParams.binaryColors=["0.1686,0.1372,0.0","0.3725,0.6156, 0.6313"];
    fractalParams.antialiasing={type:document.getElementById("aaingSelect").options.selectedIndex};
    if(fractalParams.antialiasing.type>0){
        fractalParams.antialiasing.count=document.getElementById("aaingRange").value;
        if(fractalParams.antialiasing.type!=2)
            fractalParams.antialiasing.count=Math.ceil(Math.sqrt(fractalParams.antialiasing.count));
    }
    fractalParams.colorCycle=document.getElementById("colorCycle").checked;
    recompile();
}

// function for hiding/showing julia controls
function juliaControls(julia){
    var el=document.getElementById("juliaControls");
    setClass(el, "hidden", !julia);
}

// function for hiding/showing wave controlls used in some rendering methods
function waveControls(wave){
    var el=document.getElementById("waveControls");
    setClass(el, "hidden", !wave);
}

// function for hiding/showing iteration controlls
function iterControls(siterSkip){
    var el=document.getElementById("iterControls");
    if(siterSkip>0 && !iterShown){
        el.className=el.className.substr(0, el.className.length-7);
        iterShown=true;
    }else if(siterSkip==0 && iterShown){
        el.className+=" hidden";
        iterShown=false;
    }
}

// controls for the generalized uniform variables used in some fractals/renderers
function uniformControls(uniforms){
    if(!('uniformControls' in elements)){
        elements.uniformControls=document.getElementById("uniformControls");
        
    }
    var el=elements.uniformControls;
    if(uniforms.length==0){
        el.innerHTML=
"            Display Parameters:<br />\n"
        setClass(el, "hidden", true);
    }else{
        setClass(el, "hidden", false);
        uniformElements=el.getElementsByTagName("input");
        var uniformNames =[];
        for(var i=0;i<uniformElements.length;i++){
            uniformNames[i]=uniformElements[i].getAttribute("name");
            if(! uniformNames[i] in uniforms)
                el.removeChild(uniformElements[i]);
        }
                
        
        for(var i=0;i<uniforms.length;i++){
            if(uniformNames.indexOf(uniforms[i].name) == -1){
                var step = ('step' in uniforms[i]) ? uniforms[i].step: "any";
                var value= ('value' in uniforms[i]) ? 'value="'+uniforms[i].value+'" ' : '';
                el.innerHTML+=
"            <span>"+uniforms[i].title+":</span>\n"+
'            <input type="range" step="'+step+'" class="myRange" id="uniform'+i+'" min="'+
            uniforms[i].min+'" max="'+uniforms[i].max+'" name="'+uniforms[i].name+'" '+value+'/>';
            }
        }
        for(var i=0;i<uniformElements.length;i++){
            uniformElements[i].addEventListener("input", function(e){
                setUniform1f(program, e.target.getAttribute("name"), e.target.value);
                render();
            },false);
        }
        uniformCount=uniforms.length;
    }
}

// populates a div with a list of fractals
function populateFractallist(fractalList){
    for(fractal in shaderDetails.fractals){
        var f=document.createElement("option");
        f.text=deCamel(fractal);
        f.value=fractal;
        fractalList.add(f);
    }
}

// Menu controls
function openMenu(){
    document.getElementById("controls").className="expanded";
    document.getElementById("open-button").className+=" hidden";
}
function closeMenu(){
    document.getElementById("controls").className="";
    var el=document.getElementById("open-button");
    el.className=el.className.substr(0, el.className.length-7);
}

// Orbit Image Controls
function setOrbitImage(url){
    if(orbitTexture == 0){
        orbitTexture = gl.createTexture();
    }
    orbitImage = new Image();
    orbitImage.onload = function(){
        fractalParams.orbitImage={width:orbitImage.width, height:orbitImage.height};
        recompile();
    };
    
    orbitImage.src = url;
}