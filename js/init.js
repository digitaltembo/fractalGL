function init() {
    onServer = (document.getElementById("serverless")) ? false : true;
    canvas        = document.getElementById('glscreen');
    initInput(canvas);
    
    fractalParams = {julia:false,renderer:"logarithmicSmoothing",
                    fractals:["mandelbrot"],  iterations:50,
                    binaryColors: binaryColors};
    
    initShaders();
    if(window.location.hash.length>0){
        loadFractal();
        closeMenu();
    }
}
window.onload = init;
window.onresize = initShaders;


         