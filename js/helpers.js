/*
 * DOM Helper Functions
 */

// toggles whether elem has the class of className
function toggleClass(elem, className){
    if (typeof elem.className == 'undefined'){
        elem.className = "";
    }
    var index = elem.className.indexOf(className)
    if(index == -1)
        elem.className += " " + className;
    else
        elem.className = elem.className.substr(0, index) + 
                         elem.className.substr(index+className.length+1);
}

// ensures elem has the class className iff toggle
function setClass(elem, className, toggle){
    if (typeof elem.className == 'undefined'){
        elem.className = "";
    }
    var index = elem.className.indexOf(className)
    if(index == -1 && toggle)
        elem.className += " "+className;
    else if(index > -1 && !toggle)
        elem.className = elem.className.substr(0, index) +
                         elem.className.substr(index+className.length+1);
} 

// called within the click of a link linkElem, this launches the download of
// the resource at URI with a filename of name
function downloadURI(linkElem, uri, name){
    linkElem.setAttribute("download",name);
    linkElem.href = uri;
}

// TODO:
// trying to get the "save image to server" thing working, not done quite yet
function saveImageAndDownload(img){
    var x = new XMLHttpRequest();
    x.open('post', '', false);
    var data = new FormData();
    var imgFile = new Blob([img], {type: "image/png"});
    data.append("savedImage", imgFile, "largeFractal.png");
    data.append("api_request", "save_and_download");
    x.send(data);
    console.log(x.response);
    // window.open(x.response);
}

// creates a modal window element that is the child of elem with innerHTML 
function modalWindow(innerHTML, elem){
    var modal = document.createElement("DIV");
    modal.style.position="fixed";
    modal.style.left="50%";
    modal.style.top="50%";
    modal.style.background="rgba(0,0,0,0.7)";
    modal.style.borderRadius="1em";
    modal.style.border="1px solid white";
    modal.style.color="#fff";
    modal.style.padding="2em";
    modal.innerHTML=innerHTML+'<button class="close-button" id="closeModal">close</button>';
    document.lastChild.lastChild.appendChild(modal);
    modal.style.marginLeft=(-modal.offsetWidth/2)+"px";
    modal.style.marginTop=(-modal.offsetHeight/2)+"px";
    document.getElementById("closeModal").addEventListener("click", function(){
        document.lastChild.lastChild.removeChild(modal);
    });
}

//taking in a url and a set of parameters, submits the parameters as a form
function makeAndSubmitForm(url, params, options ){
    if (typeof options === 'undefined')
      options = {newTab: false, method: "post"};
    if(! 'newTab' in options)
      options.newTab = false;
    if(! 'method' in options)
      options.method = "post";
    
    var f = document.createElement("form");
    f.setAttribute('method',method);
    f.setAttribute('action',url);
    
    if(options.newTab)
      f.setAttribute('target', '_blank');
    
    for(name in params){
        var i = document.createElement("input");
        i.setAttribute('type',"text");
        i.setAttribute('name',name);
        i.setAttribute('value',params[name]);
        f.appendChild(i);
    };
    var s = document.createElement("input"); //input element, Submit button
    s.setAttribute('type',"submit");
    s.setAttribute('value',"Submit");
    f.appendChild(s);
    document.getElementsByTagName("body")[0].appendChild(f);
    f.submit();
}

// uploads file to url
// options are parameters of an XMLHttpRequest, including a possibly import
// onload parameter
function ajaxFileUpload(url, file,  async, options){
    if(typeof async === "undefined")
      async = true;
    options = options || {};
    var xreq = new XMLHttpRequest();
    for(key in options){
        xreq[key] = options[key];
    }
    xreq.open("post", url, async);
    var data = new FormData();
    data.append("file", file, file.name);
    xreq.send(data);
}

function ajax(url, params, type, async, options){
    if(typeof async === "undefined")
      async = true;
    options = options || {};
    params  = params  || {};
    type    = type    || "post";
    
    var xreq = new XMLHttpRequest();
    for(key in options){
        xreq[key] = options[key];
    }
    xreq.open(type, url, async);
    
    if('get' in params && typeof params.get == 'function'){
      data = params;
    }else{
      var data = new FormData();
      for(key in params){
        data.append(key, params[key]);
      }
    }
    xreq.send(data);
}
/*
 * String Helper Functions
 */

// takes a camelcase string and makes it regular
// from http://stackoverflow.com/questions/4149276/javascript-camelcase-to-regular-form
function deCamel(s){
    return s.replace(/([A-Z])/g, ' $1')
            .replace(/^./, function(str){ return str.toUpperCase(); });
}

// generates a random string of numbers
function randomStringNumbers(length){
  
    Math.random().toString(36).substring(0, length);
}
      

/*
 * Fractal Helper Functions
 */

// maps pixel position to position within fractal coordinate system
function getLocation(x, y){
    return [(x-size[0]/2.0)*zoom + loc[0],
            (y-size[1]/2.0)*zoom + loc[1]];
}

// moves from position 1 to 2
function moveLoc(loc2, loc1){
    loc[0]+=loc1[0]-loc2[0];
    loc[1]+=loc2[1]-loc1[1];
    
    setUniform2f(program, "u_loc", loc[0], loc[1]);
    render();
}