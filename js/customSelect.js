/*
 * JS for my custom select box, also its own project on github
 */

function triggerEvent(object, eventName) {
    var event; // The custom event that will be created

    if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, true);
    } else {
        event = document.createEventObject();
        event.eventType = eventName;
    }

    event.eventName = eventName;
    if (document.createEvent) {
        object.dispatchEvent(event);
    } else {
        object.fireEvent("on" + event.eventType, event);
    }
}
function toggleClass(elem, className){
    if (typeof elem.className == 'undefined'){
        console.log("hey...", elem.className);
        elem.className="";
    }
    var index=elem.className.indexOf(className)
    if(index==-1)
        elem.className+=" "+className;
    else
        elem.className=elem.className.substr(0, index)+elem.className.substr(index+className.length+1)
}
function setClass(elem, className, toggle){
    if (typeof elem.className == 'undefined'){
        console.log("hey...", elem);
        elem.className="";
    }
    var index=elem.className.indexOf(className)
    if(index==-1 && toggle)
        elem.className+=" "+className;
    else if(index > -1 && !toggle)
        elem.className=elem.className.substr(0, index)+elem.className.substr(index+className.length+1)
} 

function customizeSelect(select) {
    this.select=select;
    
    
    
    this.options = select.options;
    this.width = select.offsetWidth - 4;
    this.height = 21;
    this.newElementInner =
        '    <span class="upgradedSelected"><span class="upgradedSelectedText">' + 
        this.options[this.options.selectedIndex].text + 
        '</span><i class="fa fa-caret-square-o-down upgradedSelectButton" style="line-height:' + 
        this.height + 'px;"></i></span>\n' +
        '    <ul class="upgradedSelectList hidden">\n';
    for (var i = 0; i < this.options.length; i++) {
        this.newElementInner +=
            '        <li index="' + i + '">' + this.options[i].text + '</li>\n';

    }
    this.newElementInner +=
        '    </ul>\n';
    this.el = document.createElement('span');
    this.el.setAttribute("tabindex", "0");
    var sId=select.getAttribute("id");
    if(sId.length>0)
        this.el.setAttribute("id", sId+"_customSelect");
    this.el.className = "upgradedSelect";
    this.el.innerHTML = this.newElementInner;
    this.el.setAttribute("style", "width:" + this.width + "px; line-height:" + this.height + "px;");
    select.parentElement.insertBefore(this.el, select.nextSibling);
    this.activeElement = this.el.getElementsByClassName("upgradedSelected")[0];
    this.newOptions = this.el.getElementsByClassName("upgradedSelectList")[0];
    this.activeElement.setAttribute("style", "width:" + this.width + "px;height:" + this.height + "px; line-height:" + this.height + "px;");
    this.newOptions.expanded = false;
    
        
    
    this.mouseDown=
    function(e){
        toggleClass(this.newOptions, "hidden");
    };
    this.mouseUp=
    function(e){
        console.log("mouseup!", e.target.getAttribute("index"));
        var index=e.target.getAttribute("index");
        if(index!=null){
            this.select.selectedIndex = index;
            triggerEvent(this.select, "change");
            this.activeElement.firstChild.innerHTML = e.target.innerHTML;
            
            setClass(this.newOptions, "hidden", true);
        }
    };
    this.blur=
    function(){
        setClass(this.newOptions, "hidden", true);
    };
    var _self = this;
    this.activeElement.addEventListener("mousedown", function(e){
        _self.mouseDown(e);
    });
    this.newOptions.addEventListener("mouseup", function(e){
        console.log("hiiiiii?");
        _self.mouseUp(e);
    });
//     this.el.addEventListener("blur", function(){
//         setTimeout(function(){_self.blur()},100);
//     });
    select.setAttribute("style", "display:none");
    
    

}
window.addEventListener("load",function(){
    var elements=document.getElementsByClassName("mySelect");
    console.log(elements);
    for(var i=0;i<elements.length;i++){
        var e=new customizeSelect(elements[i]);
    }
});