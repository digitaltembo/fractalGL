FractalGL
===================

![Woah](http://dijitalelefan.com/images/github/fractalGL-1.png)

This project is currently hosted on my website, [here](http://dijitalelefan.com/projects/fractalGL/).

You can also play with it on your own computer by getting these files and opening up the file
serverlesss-index.html in your favorite web browser that is hopefully not mobile and suports WebGL.

---

A project using WebGL to generate a nearly infinite variety of fractal images.

Also, a project to teach myself how to use WebGL, to develop some custom UI components
including custom css-stylable dropdown elements and my 
[gadient selector](https://github.com/digitaltembo/gradientSelector). And to program in plain 
JavaScript, basically just doing everything from scratch. And to experiment with generative coding;
the fragment shaders are all generated on the fly with more than 10000 possible permutations, just
counting major parameter.

But also, fractals are cool & interesting.

![Coool](http://dijitalelefan.com/images/github/fractalGL-2.png)

----

Now, mostly this is just for me to play with, but the controls shouldn't be too confusing.

So there are a few things that you should know about fractals before you start, really. Not terribly complicated things.

Basically, fractals are just numbers, kind of. Numbers on a big, wide open field, that is kind of...infinitely detailed?
So the first thing to do is, you can zoom in and out, using a scroll wheel a la Google Maps and the like, or using the 
up and down arrows. You can also pan around the image by clicking and dragging. You can at any point click [r] to reset
your viewport to the default position and default zoom, and also just click [c] to center the viewport on the default position.

And then there is another important bit. All of the fractals that I used are somewhat in the "Julia" style. This is a rather 
complicated statement, but basically it means there are two modes: a traditional mode, and a "Julia" mode (reflective of
the difference between Mandelbrot and Julia fractals, if you're curious), with the Julia mode requiring two more parameters, 
controlled either by sliders at the edge of the screen or with your mouse, or by clicking [Shift] + [Arrow Key]. Toggle between
mouse-position based control with a double click anywhere on screen, or the little checkbox.

The default parameters indicate a Mandelbrot fractal in Julia mode with Julia parameters set at (0,0), which make for a fascinating
if somewhat dull shape: the circle. Change around the parameters, though, and things get interesting. 

Then, you can change around the fractals themselves. If it starts running slowly at any time, the easiest modification is to reduce
the total number of iterations, and to not string too many fractals together. Two is probably the most you need, and one is almost always 
sufficiently interesting.

Additionally, some fractals might not initially appear interesting, but it is possible that they are interesting and the rendering
doesn't do them justice. There are three main types of rendering: Escape-Time rendering (from Binary to Smooth Sinusoid on the selector),
Dynamical-Systems rendering (from Dynamic System to Magnitude System), and Orbit Trap rendering (the rest). Play around and explore!
