var shaderDetails={
globals:
"       #ifdef GL_FRAGMENT_PRECISION_HIGH\n"+
"               precision highp float;\n"+
"       #else\n"+
"               precision mediump float;\n"+
"       #endif\n"+
"       #define TWO_PI 6.28318530718\n"+
"       #define PI 3.14159265359\n"+
"       #define INVERSE_TWOPI 0.15915494309\n"+
"       \n"+
"       uniform float u_zoom;\n"+
"       uniform vec2  u_loc;\n"+
"       uniform vec2  u_size;\n"+
"       uniform vec4  u_fgColor;\n"+
"       uniform vec4  u_bgColor;\n",
waveGlobals:
"       uniform float u_wave_phase;\n"+
"       uniform float u_wave_count;\n",
juliaGlobal:
"       uniform vec2  u_c;\n",
customUniforms:
["       uniform float ",";\n"],
iterSkip:
["       const int     c_iterSkip=",";\n"],
iterations:
["       const int     c_iterations=",";\n"],
antialiasingConstant:
["       const int     c_antialiasing=",";\n"],
escape:
["       const float   c_escape=",";\n"], 
sq:
"       float sq(float f){\n"+
"               return f*f;\n"+
"       }\n",
normalEscape:
"       bool escapes(vec2 z){\n"+
"               return length(z)>c_escape;\n"+
"       }\n",
diamondEscape:
"       //hi\n"+
"       bool escapes(vec2 z){\n"+
"               return abs(z.x)+abs(z.y)>c_escape*c_escape;\n"+
"       }\n",
squareEscape:
"       bool escapes(vec2 z){\n"+
"               float sqEscape=c_escape*c_escape;\n"+
"               return abs(z.x)>sqEscape || abs(z.y)>sqEscape;\n"+
"       }\n",
colors:
["       vec4 bgColor = vec4(",",1.0);\n"+
 "       vec4 fgColor = vec4(",",1.0);\n"
],
binaryColorSimple:
"       vec4 getColor(float c){\n"+
"               return mix(bgColor, fgColor, clamp(c,0.0,1.0));\n"+
"       }\n",
binaryColorCycle:
"       vec4 getColor(float c){\n"+
"               c = (mod(c, 2.0) < 1.0) ? mod(c, 1.0): 1.0 - mod(c, 1.0);\n"+
"               return mix(bgColor, fgColor, clamp(c,0.0,1.0));\n"+
"       }\n",
textureColorSimple:
"       uniform sampler2D u_tex;\n"+
"       vec4 getColor(float c){\n"+
"               return texture2D(u_tex, vec2(clamp(c, 0.0, 1.0), 0.5));\n"+
"       }\n",
textureColorCycle:
"       uniform sampler2D u_tex;\n"+
"       vec4 getColor(float c){\n"+
"               c = (mod(c, 2.0) < 1.0) ? mod(c, 1.0): 1.0 - mod(c, 1.0);\n"+
"               //return mix(vec4(0.0,0.0,0.0,1.0), vec4(1.0,1.0,1.0,1.0), 1.0-clamp(c,0.01,0.99));\n"+
"               return texture2D(u_tex, vec2(clamp(c, 0.01, 0.99), 0.5));\n"+
"       }\n",
orbitTrapData:
["      uniform sampler2D u_orbitText;\n"+
 "      const float c_orbitAspect = ",";\n"+
 "      uniform float u_orbitSize;\n"],

probing:
["       float getDepth(vec2 z){\n",
 "                      if(escapes(z)){\n"+
 "                               return (float(i)-log2(log2(length(z))))*.03;\n"+
 "                               break;\n"+
 "                      }\n"+
 "               }\n"+
 "               return (float(c_iterations)-log2(log2(length(z))))*.03;\n"+
 "       }\n"],  
getColor:
["       vec4 getColor(vec2 z){\n"+
 "               vec4 col = getColor(1.0);\n"+
 "               float ztx;\n",
 "               return col;\n"+
 "       }\n"],
normal:
"       void main() {\n"+
"               vec2 z=vec2(gl_FragCoord.x,gl_FragCoord.y);\n"+
"               z.x=(z.x-u_size.x/2.0)*u_zoom+u_loc.x;\n"+
"               z.y=(z.y-u_size.y/2.0)*u_zoom+u_loc.y;\n"+
"               gl_FragColor = getColor(z);\n"+
"       }\n",
antialiasingSimple:

"       void main() {\n"+
"               vec2 pixelLocation=vec2(gl_FragCoord.x,gl_FragCoord.y);\n"+
"               float blockSize=1.0/float(c_antialiasing+1);\n"+
"               float offset=-0.5+blockSize;\n"+
"               vec2 z=vec2(0,0);\n"+
"               vec4 c=vec4(0.0);\n"+
"               for(int x=0;x<c_antialiasing;x++){\n"+
"                     for(int y=0;y<c_antialiasing;y++){\n"+ 
"                               z.x=pixelLocation.x+float(x)*blockSize+offset;\n"+
"                               z.y=pixelLocation.y+float(y)*blockSize+offset;\n"+
"                               z.x=(z.x-u_size.x/2.0)*u_zoom+u_loc.x;\n"+
"                               z.y=(z.y-u_size.y/2.0)*u_zoom+u_loc.y;\n"+
"                               c+=getColor(z);\n"+
"                     }\n"+
"               }\n"+
"               gl_FragColor = c/float(c_antialiasing*c_antialiasing);\n"+
"       }\n",
antialiasingRandom:
"       float rand(float a, float b){\n"+
"               return fract(sin(a*12.9898+b*78.233)* 43758.5453);\n"+
"       }\n"+
"       void main() {\n"+
"               vec2 pixelLocation=vec2(gl_FragCoord.x,gl_FragCoord.y);\n"+
"               float blockSize=1.0/float(c_antialiasing+1);\n"+
"               float offset=-0.5+blockSize;\n"+
"               vec2 z=vec2(0,0);\n"+
"               vec4 c=vec4(0.0);\n"+
"               for(int i=0;i<c_antialiasing;i++){\n"+ 
"                      z=vec2(rand(float(i),1.2),rand(float(i), 3.8))+pixelLocation;\n"+
"                      z.x=(z.x-u_size.x/2.0)*u_zoom+u_loc.x;\n"+
"                      z.y=(z.y-u_size.y/2.0)*u_zoom+u_loc.y;\n"+
"                      c+=getColor(z);\n"+
"               }\n"+
"               gl_FragColor = c/float(c_antialiasing);\n"+
"       }\n",

initialize:
"               float ztx;\n",
initializeFloats:
["               float ",";\n"],
initializeVects:
["               vec2 ",";\n"],
juliaConst:
"               vec2 c = u_c;\n",
normalConst:
"               vec2 c = z;\n",
loop:
"               for(int i=0;i<c_iterations;i++){\n",
tmp:
"                       ztx=z.x;\n",

end:
"       }\n", 
maths:
"        vec2 complexAbs(vec2 a){\n"+
"            return vec2(abs(a.x), abs(a.y));\n"+
"        }\n"+
"        vec2 complexIAbs(vec2 a){\n"+
"            return vec2(a.x, abs(a.y));\n"+
"        }\n"+
"        vec2 complexRAbs(vec2 a){\n"+
"            return vec2(abs(a.x), a.y);\n"+
"        }\n"+
"        vec2 complexInvert(vec2 a){\n"+
"            float r=dot(a,a);\n"+
"            return vec2(a.x/r, -a.y/r);\n"+
"        }\n"+
"        vec2 complexConj(vec2 a){\n"+
"            return vec2(a.x, -a.y);\n"+
"        }\n"+
"        vec2 complexMult(vec2 a, vec2 b){\n"+
"            return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);\n"+
"        }\n"+
"        vec2 complexDiv(vec2 a, vec2 b){\n"+
"            return complexMult(a, complexConj(b))/dot(b,b);\n"+
"        }\n"+
"        vec2 complexLog(vec2 a){\n"+
"            return vec2(log(length(a)), atan(a.y, a.x));\n"+
"        }\n"+
"        vec2 complexSq(vec2 a){\n"+
"            return vec2(a.x*a.x-a.y*a.y, 2.0*a.x*a.y);\n"+
"        }\n"+
"        vec2 complexPow(vec2 a, float b){\n"+
"            float r=pow(length(a), b);\n"+
"            float theta=atan(a.y, a.x)*b;\n"+
"            return vec2(r*cos(theta), r*sin(theta));\n"+
"        }\n"+
"        vec2 complexSqrt(vec2 a){\n"+
"            float r=length(a);\n"+
"            return vec2(0.70710678118*sqrt(r+a.x), 0.70710678118*sqrt(r-a.y)*sign(a.y));\n"+
"        }\n"+
"        float cosh(float a){\n"+
"            return (exp(a)+exp(-a))/2.0;\n"+
"        }\n"+
"        float sinh(float a){\n"+
"            return (exp(a)-exp(-a))/2.0;\n"+
"        }\n"+
"        vec2 complexSin(vec2 a){\n"+
"            return vec2(sin(a.x)*cosh(a.y), cos(a.x)*sinh(a.y));\n"+
"        }\n"+
"        vec2 complexCos(vec2 a){\n"+
"            return vec2(cos(a.x)*cosh(a.y), sin(a.x)*sinh(a.y));\n"+
"        }\n"+
"        vec2 complexCube(vec2 a){\n"+
"            return complexMult(complexSq(a), a);\n"+
"        }\n"+
"        vec2 complex4(vec2 a){\n"+
"            return complexSq(complexSq(a));\n"+
"        }\n"+
"        vec2 complexExp(vec2 a){\n"+
"            float r=exp(a.x);\n"+
"            return vec2(r*cos(a.y), r*sin(a.y));\n"+
"}\n",



    
    
    
 
fractals:{
  
    mandelbrot: 
"                       z.x = z.x*z.x - z.y*z.y + c.x;\n"+
"                       z.y = 2.0*ztx*z.y + c.y;\n",
                
    burningShip:
"                       z.x = z.x*z.x - z.y*z.y + c.x;\n"+
"                       z.y = abs(2.0*ztx*z.y) + c.y;\n",
                
    rootedShip: 
"                       z.x = z.x*z.x - z.y*z.y + c.x;\n"+
"                       z.y = 2.0*sqrt(abs(ztx*z.y)) + c.y;\n",
                
    splatter:   
"                       z.x = z.x*z.x - z.y*z.y + c.x;\n"+
"                       z.y = 2.0*(ztx*z.y/(c.x/c.y)) + c.y;\n",
    
    sineX:      
"                       z.x = sin(z.x);\n",
    sineY:      
"                       z.y = sin(z.y);\n",
    sineXY:     
"                       z.x = sin(z.y);\n"+
"                       z.y = sin(ztx);\n",
    
    arrowhead:
"                       z.x = z.x*z.x - z.y*z.y + z.x*c.x;\n"+
"                       z.y = 2.0*ztx*z.y + z.y*c.y;\n",
    ducks:
"                       z.x = log(length(z));\n"+
"                       z.y = atan(abs(z.y), ztx);\n"+
"                       z   += c;\n",
    duckMod:
"                       z.x += c.x;\n"+
"                       z.y = abs(z.y) + c.y;\n"+
"                       ztx = log(length(z));\n"+
"                       z.y = atan(z.y, z.x);\n"+
"                       z.x = ztx;\n",
    petals:
"                       f1=z.x*z.x;\n"+
"                       f2=z.y*z.y;\n"+
"                       f3=f1-f2+c.x-1.0;\n"+
"                       f4=2.0*z.x*z.y+c.y;\n"+
"                       f5=f3*f3 - f4*f4;\n"+
"                       f6=2.0*f3*f4;\n"+
"                       f7=2.0*z.x+c.x-2.0;\n"+
"                       f8=2.0*z.y+c.y;\n"+
"                       f9=f7*f7-f8*f8;\n"+
"                       f10=2.0*f7*f8;\n"+
"                       f11=f9*f9-f10*f10;\n"+
"                       z.x=(f5*f9+f6*f10)/f11;\n"+
"                       z.y=(f5*f10+f9*f6)/f11;\n",
    tree:
"                       z.x=abs(z.x*z.x-z.y*z.y)+c.x;\n"+
"                       z.y=2.0*(ztx*z.y)+c.y;\n",
    target:
"                       f1=(z.x*z.x+z.y*z.y);\n"+
"                       z.x=z.x/2.0-z.x/f1+c.x;\n"+
"                       z.y=z.y/2.0-z.y/f1+c.y;\n",
    crosshair:
"                       z.x=z.x/3.0-1.0/(z.x*z.x+z.y*z.y)+c.x;\n"+
"                       z.y=z.y/3.0-1.0/(2.0*ztx*z.y)+c.y;\n",
    log:
"                       f1=z.x*z.x;\n"+
"                       f2=z.y*z.y;\n"+
"                       f3=f1-f2+c.x-1.0;\n"+
"                       f4=2.0*z.x*z.y+c.y;\n"+
"                       f5=f3*f3 - f4*f4;\n"+
"                       f6=2.0*f3*f4;\n"+
"                       f7=2.0*z.x+c.x-2.0;\n"+
"                       f8=2.0*z.y+c.y;\n"+
"                       f9=f7*f7-f8*f8;\n"+
"                       f10=2.0*f7*f8;\n"+
"                       f11=f9*f9-f10*f10;\n"+
"                       z.x=abs(f5*f9+f6*f10)/f11;\n"+
"                       z.y=-abs(f5*f10+f9*f6)/f11;\n",
    tricorn:
"                       v1=vec2(z.x*z.x,z.y*z.y);\n"+
"                       f1=sq(v1.x-v1.y)+4.0*v1.x*v1.y;\n"+
"                       z.x=(v1.x-v1.y)/f1+c.x;\n"+
"                       z.y=z.x*ztx*z.y/f1+c.y;\n",
    woo:
"                       z.x=z.x*z.x-z.y*z.y+c.x;\n"+
"                       z.y=-2.0*(ztx*z.y)+c.y;\n",
    invertedMandelbrot:
"                       v1=vec2(z.x*z.x,z.y*z.y);\n"+
"                       f1=sq(v1.x+v1.y);\n"+
"                       z.x=(v1.x-v1.y)/f1+c.x;\n"+
"                       z.y=c.y-2.0*ztx*z.y/f1;\n",
    woo2:
"                       v1=vec2(z.x*z.x,z.y*z.y);\n"+
"                       f1=sq(v1.x+v1.y);\n"+
"                       z.x=(v1.x-v1.y)/f1+c.x;\n"+
"                       z.y=2.0*ztx*z.y/f1+c.y;\n",
    power:
"                       f1 = pow(length(z), u_power);\n"+
"                       f2 = atan(z.y, z.x)*u_power;\n"+
"                       z.x = f1*cos(f2)+c.x;\n"+
"                       z.y = f1*sin(f2)+c.y;\n",
    magnet:
"                       f1=z.x*z.x-z.y*z.y+c.x-1.0;\n"+
"                       f2=2.0*z.x*z.y+c.y;\n"+
"                       f3=2.0*z.x+c.x-2.0;\n"+
"                       f4=2.0*z.y+c.y;\n"+
"                       f7=(f3*f3+f4*f4);\n"+
"                       f5=(f1*f3+f2*f4)/f7;\n"+
"                       f6=(f1*f4+f3*f2)/f7;\n"+
"                       z.x=f5*f5-f6*f6;\n"+
"                       z.y=2.0*f5*f6;\n",
    mandelbox:
"                       z=vec2(abs(z.x)*c_escape+c.x, abs(z.y)*c_escape+c.y);\n"+
"                       f1=z.x*z.x+z.y*z.y;\n"+
"                       if (f1>c_escape) {\n"+
"                               z.x=z.x/c_escape;\n"+
"                               z.y=z.y/c_escape;\n"+
"                       }\n"+
"                       else if (f1<1.0) {\n"+
"                               z.x=z.x/f1;\n"+
"                               z.y=z.y/f1;\n"+
"                       }\n",
    kalliset:
"                       f1=z.x*z.x+z.y*z.y;\n"+
"                       z.x=abs(z.x)/f1+c.y;\n"+
"                       z.y=abs(z.y)/f1+c.x;\n",
    kallibox:
"                       f1=z.x*z.y;\n"+
"                       z.x=abs(z.x)/f1+c.x;\n"+
"                       z.y=abs(z.y)/f1+c.y;\n",
    kalli1:
"                       z=complexAbs(complexInvert(z))+ c;\n",
    kalli2:
"                       z=complexLog(complexAbs(complexInvert(z))+c);\n",
    kalli3:
"                       z=complexInvert(complexAbs(z))+ c;\n",
    kalli4:
"                       z=complexDiv(complexAbs(c), complexAbs(z))+c;\n",
    kalli5:
"                       v1=complexAbs(complexMult(z, c)+ vec2(1.0,0.0));\n"+
"                       z=v1+complexInvert(v1);\n",
    trigonometricKalli:
"                       z=complexSin(complexAbs(complexInvert(z))+ c);\n",

    torus1: 
"                       z = mod(z, 2.0);\n"+
"                       if(z.x < 0.0){z.x+=2.0;}\n"+
"                       if(z.y < 0.0){z.y+=2.0;}\n",

    torus: 
"                       if(z.x < -1.0 ){\n"+
"                               f1 = mod(-z.x-1.0, 4.0);\n"+
"                               if(f1 < 2.0){ z.x=1.0-f1; }\n"+
"                               else        { z.x=f1-3.0; }\n"+
"                       }else if(z.x > 1.0){\n"+
"                               f1 = mod(z.x-1.0, 4.0);\n"+
"                               if(f1 < 2.0){ z.x=f1-1.0; }\n"+
"                               else        { z.x=3.0-f1; }\n"+
"                       }\n"+
"                       if(z.y < -1.0 ){\n"+
"                               f1 = mod(-z.y-1.0, 4.0);\n"+
"                               if(f1 < 2.0){ z.y=1.0-f1; }\n"+
"                               else        { z.y=f1-3.0; }\n"+
"                       }else if(z.y > 1.0){\n"+
"                               f1 = mod(z.y-1.0, 4.0);\n"+
"                               if(f1 < 2.0){ z.y=f1-1.0; }\n"+
"                               else        { z.y=3.0-f1; }\n"+
"                       }\n",
    invertedBurningShip:
"                           z=complexIAbs(complexInvert(complexSq(z)))+c;\n",
    powerBurningShip:
"                           z=complexIAbs(complexInvert(complexPow(z, -u_power)))+c;\n",
    invertedTrees:
"                           z=complexRAbs(complexInvert(complexSq(z)))+c;\n",
    powerTrees:
"                           z=complexRAbs(complexInvert(complexPow(z, -u_power)))+c;\n",


},
renderers:{
    binary:
"                       if(escapes(z)){\n"+
"                               col =  getColor(0.0);\n"+
"                               break;\n"+
"                       }\n"+        
"               }\n",
    binaryCheckerboard:
"                       if(escapes(z)){\n"+
"                               if(z.x>0.0 ^^ z.y>0.0){\n"+
"                                       col = getColor(0.0);\n"+
"                               }\n"+
"                               break;\n"+
"                       }\n"+        
"               }\n",
    linear:
"                       if(escapes(z)){\n"+
"                               return getColor(float(i)/float(c_iterations));\n"+
"                               break;\n"+
"                       }\n"+
"               }\n",
    linearCheckerboard:
"                       if(escapes(z)){\n"+
"                               float c=float(i)/float(c_iterations);\n"+
"                               if(z.x>0.0 ^^ z.y > 0.0){\n"+
"                                       c=1.0-c;\n"+
"                               }\n"+
"                               return getColor(c);\n"+
"                               break;\n"+
"                       }\n"+
"               }\n",
    simpleSinusoid:
"                       if(escapes(z)){\n"+
"                               return getColor(sin(float(i)/float(c_iterations)*TWO_PI*u_wave_count+u_wave_phase));\n"+
"                            break;\n"+
"                   }\n"+
"               }\n",
    simpleSinusoidCheckerboard:
"                       if(escapes(z)){\n"+
"                               float c=sin(float(i)/float(c_iterations)*TWO_PI*u_wave_count+u_wave_phase);\n"+
"                               if(z.x>0.0 ^^ z.y > 0.0){\n"+
"                                       c=1.0-c;\n"+
"                               }\n"+
"                               return getColor(c);\n"+
"                   }\n"+
"               }\n",    
    logarithmicSmoothing:
"                      if(escapes(z)){\n"+
"                               return getColor((float(i)-log2(log2(length(z))))*.03);\n"+
"                      }\n"+
"               }\n",
    smoothCheckerboard:
"                      if(escapes(z)){\n"+
"                               float c=((float(i)-log2(log2(length(z))))*.03);\n"+
"                               if(z.x>0.0 ^^ z.y > 0.0){\n"+
"                                       c=1.0-c;\n"+
"                               }\n"+
"                               return getColor(c);\n"+
"                      }\n"+
"               }\n",
    
    logarithmicRidging:
"                      if(escapes(z)){\n"+
"                               return getColor((float(i)-log2(log2(length(z))))*.6/float(i));\n"+
"                     }\n"+
"               }\n",
    smoothSinusoid:
"                      if(escapes(z)){\n"+
"                               return getColor(sin(((float(i)-log2(log2(length(z))))*.03)*TWO_PI*u_wave_count+u_wave_phase));\n"+
"                      }\n"+
"               }\n",
    dynamicSystem:
"                       if(i > 10 && mod(float(i), float(c_iterSkip)) == 0.0){\n"+
"                               rf1+=dot(z,z);\n"+
"                               rf2+=1.0;\n"+
"                       }\n"+
"               }\n"+
"               col = getColor(sqrt(rf1/rf2));\n",
    angleSystem:
"                       if(mod(float(i), float(c_iterSkip)) == 0.0){\n"+
"                               rv1+=z;\n"+
"                               rf1+=1.0;\n"+
"                       }\n"+
"               }\n"+
"               rv1/=rf1;\n"+
"               col = getColor((atan(rv1.x, rv1.y)+PI)*INVERSE_TWOPI);\n",
    smoothAngleSystem:
"                       if(mod(float(i), float(c_iterSkip)) == 0.0){\n"+
"                               rv1+=z;\n"+
"                               rf1+=1.0;\n"+
"                       }\n"+
"               }\n"+
"               rv1/=rf1;\n"+
"               col = getColor(abs(atan(rv1.x, rv1.y))*INVERSE_TWOPI*2.0);\n",
    magnitudeSystem:
"                       if(mod(float(i), float(c_iterSkip)) == 0.0){\n"+
"                               rv1+=z;\n"+
"                               rf1+=1.0;\n"+
"                       }\n"+
"               }\n"+
"               rv1/=rf1;\n"+
"               col = getColor((rv1.x*rv1.x+rv1.y*rv1.y)/(c_escape*c_escape));\n",
    fauxD:
"               float l = .1 * u_zoom;\n"+
"               vec2 delta=vec2(l*cos(u_theta), l*sin(u_theta));\n"+
"               col = getColor((getDepth(z)-getDepth(z+delta))*u_magnitude);\n",
    pointOrbit:
"                       rf2 = dot(z,z);\n"+
"                       if(i < 2 || rf2 < rf1){\n"+
"                               rf1 = rf2;\n"+
"                       }\n"+
"               }\n"+
"               rf1=sqrt(rf1);\n"+
"               col = getColor(rf1);\n",
    crossOrbit:
"                       rf2 = min(abs(z.x), abs(z.y));\n"+
"                       if(i < 2 || rf2 < rf1){\n"+
"                               rf1 = rf2;\n"+
"                       }\n"+
"               }\n"+
"               rf1=sqrt(rf1);\n"+
"               col = getColor(rf1);\n",
    crossPoint:
"                       rf2 = min(abs(z.x), abs(z.y))+dot(z,z);\n"+
"                       if(i < 2 || rf2 < rf1){\n"+
"                               rf1 = rf2;\n"+
"                       }\n"+
"               }\n"+
"               rf1=sqrt(rf1);\n"+
"               col = getColor(rf1);\n",
    circleOrbit:
"                       rf2 = abs(dot(z,z) - .5);\n"+
"                       if(i < 2 || rf2 < rf1){\n"+
"                               rf1 = rf2;\n"+
"                       }\n"+
"               }\n"+
"               rf1=sqrt(rf1);\n"+
"               col = getColor(rf1);\n",
    diamondOrbit:
"                       rf2 = abs(abs(z.x)+abs(z.y) - .5);\n"+
"                       if(i < 2 || rf2 < rf1){\n"+
"                               rf1 = rf2;\n"+
"                       }\n"+
"               }\n"+
"               rf1=sqrt(rf1);\n"+
"               col = getColor(rf1);\n",
    orbitImage:
"                       if(abs(z.x) < u_orbitSize*c_orbitAspect && abs(z.y) < u_orbitSize){\n"+
"                               rf1 = u_orbitSize*c_orbitAspect;\n"+
"                               col = texture2D(u_orbitText, vec2((z.x+rf1)/(2.0*rf1),\n"+
"                                                                 (u_orbitSize-z.y)/(2.0*u_orbitSize)));\n"+
"                               break;\n"+
"                       }\n"+
"               }\n",
    orbitImageCut:
"                       if(abs(z.x) < u_orbitSize*c_orbitAspect && abs(z.y) < u_orbitSize){\n"+
"                               rf1 = u_orbitSize*c_orbitAspect;\n"+
"                               vec4 tmp = texture2D(u_orbitText, vec2((z.x+rf1)/(2.0*rf1),\n"+
"                                                                 (u_orbitSize-z.y)/(2.0*u_orbitSize)));\n"+
"                               if(2.95 > tmp.r+tmp.g+tmp.b){\n"+
"                                       if(tmp.a == 1.0){\n"+
"                                               col = tmp;\n"+
"                                               break;\n"+
"                                       }else{\n"+
"                                               col = mix(col, tmp, tmp.a);\n"+
"                                       }\n"+
"                               }\n"+
"                       }\n"+
"               }\n",
    orbitImageColors:
"                       if(abs(z.x) < u_orbitSize*c_orbitAspect && abs(z.y) < u_orbitSize){\n"+
"                               rf1 = u_orbitSize*c_orbitAspect;\n"+
"                               vec4 tmp = texture2D(u_orbitText, vec2((z.x+rf1)/(2.0*rf1),\n"+
"                                                                 (u_orbitSize-z.y)/(2.0*u_orbitSize)));\n"+
"                               if( abs(tmp.r - u_bgColor.r) + abs(tmp.g - u_bgColor.g) + abs(tmp.b - u_bgColor.b) > 0.3){\n"+
"                                       if(tmp.a == 1.0){\n"+
"                                               col = tmp;\n"+
"                                               break;\n"+
"                                       }else{\n"+
"                                               col = mix(col, tmp, tmp.a);\n"+
"                                       }\n"+
"                               }\n"+
"                       }\n"+
"               }\n"
    
}
};
function str(i){
    return i.toString();
}
function getFractalScript(params){
    var eqns=shaderDetails.tmp+shaderDetails.fractals.mandelbrot;
    var data={uniforms:[]};
    if('fractal' in params){
        if(params.fractal in shaderDetails.fractals){
            if(params.fractals[i].indexOf("power") !=-1)
                data.uniforms=[{min:-5,max:5,name:"u_power", title:"Power", value:2, step:.5}];
            eqns=shaderDetails.tmp+shaderDetails.fractals[params.fractal];
        }else{
            eqns=shaderDetails.tmp+params.fractal;
        }
    }
    if('fractals' in params){
        eqns="";
        for(var i=0;i<params.fractals.length;i++){
            if(params.fractals[i] in shaderDetails.fractals){
                if(params.fractals[i].indexOf("power") !=-1)
                    data.uniforms=[{min:-5,max:5,name:"u_power", title:"Power", value:2, step:.5}];
                eqns+=shaderDetails.tmp+shaderDetails.fractals[params.fractals[i]];
            }else{
                eqns+=shaderDetails.tmp+params.fractals[i];
            }
        }
    }
    var fractalScript="";
    if(eqns.indexOf('f1')!=-1){
        fractalScript+=shaderDetails.initializeFloats[0];
        var i=1;
        var float='f'+i;
        while(eqns.indexOf(float)!=-1){
            if(i>1)
                fractalScript+=", ";
            fractalScript+=float+"=0.0";
            i++;
            float='f'+i;
        }
        fractalScript+=shaderDetails.initializeFloats[1];
    }
    if(eqns.indexOf('v1')!=-1){
        fractalScript+=shaderDetails.initializeVects[0];
        var i=1;
        var vect='v'+i;
        while(eqns.indexOf(vect)!=-1){
            if(i>1)
                fractalScript+=", ";
            fractalScript+=vect+"=vec2(0.0,0.0)";
            i++;
            vect='v'+i;
        }
        fractalScript+=shaderDetails.initializeVects[1];
    }
    if('julia' in params)
        fractalScript+=shaderDetails.juliaConst;
    else
        fractalScript+=shaderDetails.normalConst;
    fractalScript+=shaderDetails.loop;
    fractalScript+=eqns;
    if(eqns.indexOf('complex')!=-1)
        data.includeMath=true;
    data.script=fractalScript;
    return data;
}
function makeShader(params){
    var julia=false;
    var iters=100;
    var renderScript=shaderDetails.renderers.linear;
    var escape=2.0;
    var escapeType=0;
    var bgColor="1.0, 1.0, 1.0", fgColor="0.0, 0.0, 0.0";
    var data={iterSkip:0, julia:false, wave:false};
    var fractalData=getFractalScript(params);
    var fractalScript=fractalData.script;
    var includeMath=fractalData.includeMath;
    var faux=false;
    var antialiasing={type:0};
    data.uniforms=fractalData.uniforms;
    data.colorScheme="texture";
    if('julia' in params)
        data.julia=true;
    if('iterations' in params)
        iters=params['iterations'];
    if('escapeType' in params){
        if(params.escapeType=="normal")
            escapeType=0;
        else if(params.escapeType=="square")
            escapeType=1;
        else if(params.escapeType=="diamond")
            escapeType=2;
    }
    console.log("escape type #:",escapeType);
    console.log(params.renderer);
    if('renderer' in params){
        if(params.renderer in shaderDetails.renderers){
            if(params.renderer.indexOf("Sinusoid")!=-1)
                data.wave=true;
            if(params.renderer.indexOf("System")!=-1)
                data.iterSkip=1;
            if(params.renderer=="fauxD"){
                faux=true;
                data.uniforms.push({name:"u_magnitude",title:"Magnitude",min:1,max:1000});
                data.uniforms.push({name:"u_theta",title:"Theta",min:0,max:6.38});
            }
            if(params.renderer.substr(0,0)=="orbitImage" && !('orbitImage' in params)){
                console.log("widthifying");
                params.orbitImage={width:1,height:1};
            }
            renderScript=shaderDetails.renderers[params.renderer];
        }else{
            if(params.renderer.indexOf("u_wave_count")!=-1)
                data.wave=true;
            renderScript=params.renderer;
        }
    }
    if('iterSkip' in params && data.iterSkip==1){
        data.iterSkip=params.iterSkip;
    }
    if('antialiasing' in params){
        antialiasing=params.antialiasing;
    }
    if(params.binaryColors[0].length==3){
        bgColor=str(params.binaryColors[0][0]/255.0)+", "+
                str(params.binaryColors[0][1]/255.0)+", "+
                str(params.binaryColors[0][2]/255.0);
    }else{
        bgColor=params.binaryColors[0];
    }
    if(params.binaryColors[1].length==3){
        fgColor=str(params.binaryColors[1][0]/255.0)+", "+
                str(params.binaryColors[1][1]/255.0)+", "+
                str(params.binaryColors[1][2]/255.0);
    }else{
        fgColor=params.binaryColors[1];
    }
    if('escape' in params){
        escape=params.escape;
    }
    
    var source=shaderDetails.globals;
    for(u in data.uniforms){
        source+=shaderDetails.customUniforms[0]+data.uniforms[u].name+shaderDetails.customUniforms[1];
    }
    
    if('orbitImage' in params){
        var width = params.orbitImage.width/2;
        var height = params.orbitImage.height/2;
        source+=shaderDetails.orbitTrapData[0]+(width/height).toFixed(4) +
                shaderDetails.orbitTrapData[1];
    }
    source+=shaderDetails.iterations[0]+iters.toString()+shaderDetails.iterations[1];
    source+=shaderDetails.escape[0]+escape.toFixed(2)+shaderDetails.escape[1];
    if(data.colorScheme=="binary"){
        source+=shaderDetails.binaryColorCycle;
    }else{
        if(params.colorCycle){
            source+=shaderDetails.textureColorCycle;
        }else{
            source+=shaderDetails.textureColorSimple;
        }
    }
    if(includeMath)
        source+=shaderDetails.maths;
    if(fractalScript.indexOf('sq(')!=-1)
        source+=shaderDetails.sq;
    if(antialiasing.type>0)
        source+=shaderDetails.antialiasingConstant[0]+antialiasing.count+shaderDetails.antialiasingConstant[1];
    
    if(data.iterSkip>0)
        source+=shaderDetails.iterSkip[0]+data.iterSkip+shaderDetails.iterSkip[1];
    switch(escapeType){
        case 0:
            source+=shaderDetails.normalEscape;
            break;
        case 1:
            source+=shaderDetails.squareEscape;
            break;
        case 2:
            source+=shaderDetails.diamondEscape;
            break;
    }
    if(data.julia)
        source+=shaderDetails.juliaGlobal;
    if(data.wave)
        source+=shaderDetails.waveGlobals;
    if(faux){
        source+=shaderDetails.probing[0];
        source+=shaderDetails.initialize;
        source+=fractalScript;
        source+=shaderDetails.probing[1];
        source+=shaderDetails.getColor[0];
        source+=renderScript;
        source+=shaderDetails.getColor[1];
    }else{
        source+=shaderDetails.getColor[0];
        
        
        if(renderScript.indexOf('rf1')!=-1){
            source+=shaderDetails.initializeFloats[0];
            var i=1;
            var float='rf'+i;
            while(renderScript.indexOf(float)!=-1){
                if(i>1)
                    source+=", ";
                source+=float+"=0.0";
                i++;
                float='rf'+i;
            }
            source+=shaderDetails.initializeFloats[1];
        }
        if(renderScript.indexOf('rv1')!=-1){
            source+=shaderDetails.initializeVects[0];
            var i=1;
            var vect='rv'+i;
            while(renderScript.indexOf(vect)!=-1){
                if(i>1)
                    source+=", ";
                source+=vect+"=vec2(0.0,0.0)";
                i++;
                vect='rv'+i;
            }
            source+=shaderDetails.initializeVects[1];
        }
        source+=fractalScript;
        source+=renderScript;
        source+=shaderDetails.getColor[1];
    }
    switch(antialiasing.type){
        case 0://no antialiasing
            source+=shaderDetails.normal;
            break;
        case 1://simple grid average
            source+=shaderDetails.antialiasingSimple;
            break;
        case 2://random distribution
            source+=shaderDetails.antialiasingRandom;
            break;
    }
    data.source=source
    return data;
}