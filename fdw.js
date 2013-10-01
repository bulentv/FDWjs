(function(window,undefined) {
  
  
  function makeDraggable(el) {
    
    var header = document.createElement("div");
    header.setAttribute("class","header");
    header.innerHTML = "Drag Me Programmatically";
    
    if(!el.firstChild)
      el.append(header);
    else
      el.insertBefore(header,el.firstChild);
    
    header.addEventListener("mousedown",downHandler);
    
  }
  
  function debug(text){
    document.getElementById("debug").innerHTML = text + "<br />"+ 
      document.getElementById("debug").innerHTML; 
  }
  
  /**
 * Drag.js: drag absolutely positioned HTML elements.
 *
 * This module defines a single drag() function that is designed to be called
 * from an onmousedown event handler.  Subsequent mousemove events will
 * move the specified element. A mouseup event will terminate the drag.
 * If the element is dragged off the screen, the window does not scroll.
 * This implementation works with both the DOM Level 2 event model and the
 * IE event model.
 * 
 * Arguments:
 *
 *   elementToDrag:  the element that received the mousedown event or
 *     some containing element. It must be absolutely positioned.  Its 
 *     style.left and style.top values will be changed based on the user's
 *     drag.
 *
 *   event: the Event object for the mousedown event.
 **/
  var topZIndex = 1000;
  function downHandler(event) {
    
    this.parentNode.style.zIndex = ++topZIndex;
    I("#debug").text(topZIndex);
    
    
    var elementToDrag = this.parentNode;
    // The mouse position (in window coordinates)
    // at which the drag begins 
    var startX = event.clientX, startY = event.clientY;    
    
    // The original position (in document coordinates) of the
    // element that is going to be dragged.  Since elementToDrag is 
    // absolutely positioned, we assume that its offsetParent is the
    // document body.
    var origX = elementToDrag.offsetLeft, origY = elementToDrag.offsetTop ;
    
    // Even though the coordinates are computed in different 
    // coordinate systems, we can still compute the difference between them
    // and use it in the moveHandler() function.  This works because
    // the scrollbar position never changes during the drag.
    var deltaX = startX - origX, deltaY = startY - origY;
    
    var screenWidth = Math.max(
      document.documentElement.clientWidth,
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth);      
    
    
    var screenHeight = Math.max(
      document.documentElement.clientHeight,
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight);  
    
    // Register capturing event handlers
    document.addEventListener("mousemove", moveHandler, true);
    document.addEventListener("mouseup", upHandler, true);
    
    
    // We've handled this event. Don't let anybody else see it.  
    if (event.stopPropagation) event.stopPropagation();  // DOM Level 2
    else event.cancelBubble = true;                      // IE
    
    // Now prevent any default action.
    if (event.preventDefault) event.preventDefault();   // DOM Level 2
    else event.returnValue = false;                     // IE
    
    /**
     * This is the handler that captures mousemove events when an element
     * is being dragged. It is responsible for moving the element.
     **/
  function moveHandler(e) {
    
    
    if (!e) e = window.event;  // IE Event Model
    
    
    var newLeft = (e.clientX - deltaX);
    
    if((e.clientX - deltaX) < (0-deltaX)) {
      newLeft = (0-deltaX);
    }
    
    if(e.clientX > screenWidth) {
      newLeft = (screenWidth-deltaX);
    }
    
    // Move the element to the current mouse position, adjusted as
    // necessary by the offset of the initial mouse-click.
    elementToDrag.style.left = newLeft + "px";
    
    var newTop = (e.clientY - deltaY);
    
    //debug(newTop);
    
    if((e.clientY - deltaY) < (0-deltaY)) {
      newTop = (0-deltaY);
    }
    
    if(e.clientY > screenHeight) {
      newTop = (screenHeight-deltaY);
    }
    
    elementToDrag.style.top = newTop + "px";
    
    
    // And don't let anyone else see this event.
    if (e.stopPropagation) e.stopPropagation();  // DOM Level 2
    else e.cancelBubble = true;                 // IE
    
  }
  
  /**
     * This is the handler that captures the final mouseup event that
     * occurs at the end of a drag.
     **/
  function upHandler(e) {
    if(e.which === 0) {
      return upHandler(e);
    }

    if (!e) e = window.event;  // IE Event Model
    
    var header = document.elementFromPoint(e.clientX,e.clientY);
    //header.parentNode.style.zIndex = 4000;
    
    // Unregister the capturing event handlers.
    if (document.removeEventListener) {  // DOM event model
      document.removeEventListener("mouseup", upHandler, true);
      document.removeEventListener("mousemove", moveHandler, true);
    }
    
  }
}
  
  var modules = [];
  window.I = function(){
    var self = this;
    var _sel = arguments[0];
    var _el = [];
    function getOne(){
      return _el.shift();
    }
    if(_sel) {
      var elems = document.querySelectorAll(_sel);
      if(elems instanceof NodeList) {
        for(var i=0;i<elems.length;i++) {
          _el.push(elems[i]);
        }
      }      
    }
    var ret = {
      onReady: function() {
        var _args = arguments;
        document.addEventListener('DOMContentLoaded', function() {
          _args[0](arguments);
        });
      },
      show: function(){
        
      },
      text: function(text) {
        while((el = getOne()))
          el.innerText = text;
      },
      html: function(html) {
        while((el = getOne()))
          el.innerHTML = html;
      },      
      extend: function(n,f){
        modules.push({n:n,f:f});
      }
      
    };
    for(var j in modules){
     eval("ret[modules[j].n] = " + modules[j].f.toString()); 
    }
    return ret;
  };
})(window);

I().extend("draggable2", function() {
    while((el = getOne()))
      makeDraggable(el);    
});

I().onReady(function () {
  var a = I("#p2");
  a.draggable2();
  I(".aa").draggable2();
});



