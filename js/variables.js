// gl stuff
var gl;
var canvas;
var buffer;

// uniforms
var loc=[0,0];
var size;
var zoom = 0;
var program;
var clicking=false, pLoc;
var julia=true, juliaTracking=false;
var uniformCache={};
var mLoc=[0,0];
var mPos=[0,0];
var iterShown=false;
var waveShown=false;
var shaderScript;
var shaderSource;
var vertexShader;
var fragmentShader;
var elements={};
var uniformCount=0;
var uniformElements=[];
var binaryColors = [[255,255,255],[0,0,0]];

var savedImages=0;
var fractalCount=1;
var texture;
var textureArray=new Uint8Array(256 * 4);
var fractalParams;
var orbitTexture = 0;
var orbitImage = false;
var orbitImageSize = .5;
var uniforms = {};

var onserver = true;

var pallets = [{name:"B & W",         pallet:[{color:{r:255,g:255,b:255},position:0},
                                              {color:{r:0,  g:0,  b:0  },position:1}]},
                {name:"Dijital Elefan",pallet:[{color:{r:43, g:35, b:0  },position:0},
                                              {color:{r:95, g:158,b:162},position:1}]},
                {name:"Rainbow",       pallet:[{color:{r:241,g:2,  b:0  },position:0},
                                              {color:{r:254,g:254,b:0  },position:0.17142857142857143},
                                              {color:{r:12, g:251,b:4  },position:0.36428571428571427},
                                              {color:{r:3,  g:247,b:251},position:0.5928571428571429},
                                              {color:{r:235,g:0,  b:243},position:0.8},
                                              {color:{r:248,g:2,  b:6  },position:1}]},
                {name:"Strawberries",  pallet:[{color:{r:246,g:1,  b:64 },position:0},
                                              {color:{r:252,g:254,b:146},position:1}]},
                {name:"Sorbet",        pallet:[{color:{r:14, g:88, b:96 },position:0},
                                              {color:{r:250,g:128,b:120},position:1}]},
                {name:"Sunset",        pallet:[{color:{r:7,  g:9,  b:53 },position:0},
                                              {color:{r:21, g:15, b:121},position:0.2357142857142857},
                                              {color:{r:202,g:20, b:92 },position:0.4857142857142857},
                                              {color:{r:232,g:6,  b:33 },position:0.75},
                                              {color:{r:234,g:115,b:26 },position:0.8714285714285714},
                                              {color:{r:226,g:185,b:2  },position:1}]},
                {name:"Cotton Candy",  pallet:[{color:{r:131,g:175,b:155},position:0},
                                              {color:{r:200,g:200,b:169},position:0.3},
                                              {color:{r:249,g:205,b:173},position:0.4},
                                              {color:{r:252,g:157,b:154},position:0.5},
                                              {color:{r:254,g:67, b:101},position:1}]},
                {name:"Vintage",       pallet:[{color:{r:236,g:208,b:120},position:0},
                                              {color:{r:217,g:91, b:67 },position:0.25},
                                              {color:{r:192,g:41, b:66 },position:0.5},
                                              {color:{r:84, g:36, b:55 },position:0.75},
                                              {color:{r:13, g:119,b:122},position:1}]},
                {name:"Orchid",        pallet:[{color:{r:82, g:42, b:66 }, position:0},
                                              {color:{r:190,g:119,b:103},position:0.25},
                                              {color:{r:234,g:188,b:152},position:0.5},
                                              {color:{r:239,g:77, b:66 }, position:1}]}
                ];