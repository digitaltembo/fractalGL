#!/bin/bash
uglifyjs js/variables.js \
         js/shader_construction.js \
         js/helpers.js   \
         js/controls.js  \
         js/pnglib.js    \
         js/gl_shader_helper.js \
         js/export_fractal.js \
         js/gradientSelector.js \
         js/init.js      \
         js/customSelect.js > js/main.min.js

cat css/main.css css/customSelect.css > css/main.min.css
minify -o css/main.min.css css/main.min.css
