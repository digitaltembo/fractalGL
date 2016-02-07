


// Initialize the shaders. Also resets them on window resize
function initShaders(){
    uniformCache={};
    size=[window.innerWidth, window.innerHeight];
    if(zoom==0)
        zoom=4/size[1];
    
    size=[window.innerWidth, window.innerHeight];
    gl            = canvas.getContext('experimental-webgl',{preserveDrawingBuffer: true});
    canvas.width  = size[0];
    canvas.height = size[1];
    
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, 
        new Float32Array([
        -1.0, -1.0, 
        1.0, -1.0, 
        -1.0,  1.0, 
        -1.0,  1.0, 
        1.0, -1.0, 
        1.0,  1.0]), 
        gl.STATIC_DRAW
    );
    shaderScript = document.getElementById("2d-vertex-shader");
    shaderSource = shaderScript.text;
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaderSource);
    gl.compileShader(vertexShader);

    shaderScript   = document.getElementById("2d-fragment-shader");
    //binaryColors:["0.1686,0.1372,0.0","0.3725,0.6156, 0.6313"]
    shaderSource   = makeShader(fractalParams).source;
    console.log(shaderSource);
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaderSource);
    gl.compileShader(fragmentShader);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);   
    gl.useProgram(program);
    
    texture = gl.createTexture();
    attachTexture();
  

    setUniform1f(program, "u_zoom", zoom);
    setUniform2f(program, "u_loc", loc[0], loc[1]);
    setUniform2f(program, "u_size", size[0], size[1]);
    setUniform1f(program, "u_wave_count", 5);
    setUniform1f(program, "u_wave_phase", 0);
    setUniform1f(program, "u_orbitSize", orbitImageSize);
    setUniform2f(program, "u_c", mLoc[0],mLoc[1]);
    setUniform4f(program, "u_fgColor", binaryColors[0]);
    setUniform4f(program, "u_bgColor", binaryColors[1]);
    
    render();

}
// recompile the shader
function recompile(){
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(fragmentShader);
    shaderData   = makeShader(fractalParams);
    juliaControls(shaderData.julia);
    waveControls(shaderData.wave);
    iterControls(shaderData.iterSkip);
    uniformControls(shaderData.uniforms);
    console.log(shaderData.source);
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaderData.source);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    
//     getUniformCache(program, "u_zoom");
//     getUniformCache(program, "u_loc");
//     getUniformCache(program, "u_size");
//     getUniformCache(program, "u_wave_count");
//     getUniformCache(program, "u_wave_phase");
//     getUniformCache(program, "u_c");
//     getUniformCache(program, "u_orbitSize");
//     getUniformCache(program, "u_fgColor");
//     getUniformCache(program, "u_bgColor");
    
    uniformCache = {};
    
    for(var i=0;i<uniformElements.length;i++){
            var name = uniformElements[i].getAttribute("name");
            var val = uniformElements[i].value;
//             getUniformCache(program, name);
            setUniform1f(program, name, val);
        }
    
    setUniform1f(program, "u_zoom", zoom);
    setUniform2f(program, "u_loc", loc[0], loc[1]);
    setUniform2f(program, "u_size", size[0], size[1]);
    setUniform1f(program, "u_wave_count", 5);
    setUniform1f(program, "u_wave_phase", 0);
    setUniform1f(program, "u_orbitSize", orbitImageSize);
    setUniform2f(program, "u_c", mLoc[0],mLoc[1]);

    attachTexture();
    setUniform4f(program, "u_fgColor", binaryColors[0]);
    setUniform4f(program, "u_bgColor", binaryColors[1]);
    
    // This attaches the image for orbit image style shading
    if(orbitTexture != 0){
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, orbitTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, orbitImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).
        //gl.bindTexture(gl.TEXTURE_2D, null);
        gl.uniform1i(gl.getUniformLocation(program, "u_orbitText"), 1);
        
    }   
    render();
}




// renders the fractal; pretty important
function render() {

    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    console.log("rendered??");

} 


// Texture

// binds the gradient pallet to the fractal shader
function attachTexture(){
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    populateColorTexture(document.getElementById("gradientSelector").pallet);
    uniforms["pallet"] = document.getElementById("gradientSelector").pallet;
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program, "u_tex"), 0);
}

// populates the GL memory with the gradient pallet
function populateColorTexture(pallet){
    for(var i=0;i<256;i++){
        textureArray[4*i  ]=pallet[i].r;
        textureArray[4*i+1]=pallet[i].g;
        textureArray[4*i+2]=pallet[i].b;
        textureArray[4*i+3]=255;
    }
    binaryColors = [
      [pallet[0].r/255.0, pallet[0].g/255.0, pallet[0].b/255.0, 1.0],
      [pallet[255].r/255.0, pallet[255].g/255.0, pallet[255].b/255.0, 1.0]];
    gl.activeTexture(gl.TEXTURE0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256,1, 0, gl.RGBA, gl.UNSIGNED_BYTE, textureArray);
}

// functions for getting and setting uniforms.
// The uniformCache stores the gl uniform locations, and must change
// on each compilation
function getUniformCache(program, name){
    uniformCache[name]=gl.getUniformLocation(program, name);
}
function setUniform1f(program, name, value){
    if(!(name in uniformCache))
        getUniformCache(program, name);
    uniforms[name] = value;
    gl.uniform1f(uniformCache[name], value);
}
function setUniform2f(program, name, val1, val2){
    if(!(name in uniformCache))
        getUniformCache(program, name);
    uniforms[name] = [val1, val2];
    gl.uniform2f(uniformCache[name], val1, val2);
}

function setUniform4f(program, name, vec){
    if(!(name in uniformCache))
        getUniformCache(program, name);
    uniforms[name] = vec;
    gl.uniform4f(uniformCache[name], vec[0], vec[1], vec[2], vec[3]);
}