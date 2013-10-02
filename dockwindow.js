(function($,bulo,undefined){
  function dockWindow(options){
    var self = this;

    this._parent = options.parent;
    self._zindex = -1;

    var header = $("<div />")
    .addClass("header")
    .css({display:"none"});

    this._wnd = $("<div />")
    .addClass("wnd")
    .attr("id",options.id)

    .css({
      width: options.width || "100px",
      height: options.height || "100px",
      top: options.top || "100px",
      left: options.left || "100px"
    })

    .append(header)

    .on({
      "mouseenter": function(e) {
        header.stop().fadeIn(100);
      },
      "mouseleave": function(e) {
        header.stop().fadeOut(100);
      }
    });

    this._triggerEvent = function(event){
      this.$().get()[0].dispatchEvent(event);
    };

    this._triggerMoveEvent = function(detail){
        var event = new CustomEvent("move",{
          detail:detail
        });
        this._triggerEvent(event);
    };
    // Handle clicks on the header (mousedown)
    // We will start moving the window as long as the mouse remain down
    header.on("mousedown", function () {

      var wnd = self._wnd;
      self.bringToFront();

      var offset = wnd.offset(),
      deltaX = event.clientX - offset.left,
      deltaY = event.clientY - offset.top;

      // Register capturing event handlers
      document.addEventListener("mousemove", moveHandler, true);
      document.addEventListener("mouseup", upHandler, true);


      // We've handled this event. Don't let anybody else see it.  
      if (event.stopPropagation) event.stopPropagation();  // DOM Level 2
      else event.cancelBubble = true;                      // IE

      // Now prevent any default action.
      if (event.preventDefault) event.preventDefault();   // DOM Level 2
      else event.returnValue = false;                     // IE

      //
      // Detect the mouse position and apply the coordinated to the
      // window which is being dragged
      function moveHandler(e) {

        if (!e) e = window.event;  // IE Event Model

        var newLeft = (e.clientX - deltaX),
        newTop = (e.clientY - deltaY);

        // prevent the window from going out of the window horizontally
        if((e.clientX - deltaX) < (0-deltaX)) newLeft = (0-deltaX);
        else if(e.clientX > $( window ).width()) newLeft = ($( window ).width()-deltaX);

        // prevent the window from going out of the window vertically
        if((e.clientY - deltaY) < (0-deltaY)) newTop = (0-deltaY);
        else if(e.clientY > $( window ).height()) newTop = ($( window ).height()-deltaY);

        // move the window to the calculated coordinates
        wnd.css({ left: newLeft + "px", top: newTop + "px"});

        self._triggerMoveEvent({
          mouseX:e.clientX,
          mouseY:e.clientY
        });

        // And don't let anyone else see this event.
        if (e.stopPropagation) e.stopPropagation();  // DOM Level 2
        else e.cancelBubble = true;                 // IE

      }

      //
      // Movement of the window has completed and user
      // released the mouse btn
      function upHandler(e) {

        if (!e) e = window.event;  // IE Event Model

        // Unregister the capturing event handlers.
        document.removeEventListener("mouseup", upHandler, true);
        document.removeEventListener("mousemove", moveHandler, true);

        self._triggerEvent(new CustomEvent("aftermove"));

      }
    });
  }

  dockWindow.prototype.$ = function() {
    return this._wnd;
  };

  dockWindow.prototype.hasHigherZ = function(other){
    return this._wnd.css("z-index") > other.$().css("z-index");
  };

  dockWindow.prototype.isTheSame = function(other){
    return other && (this._wnd.attr("id") == other.$().attr("id"));
  };
  dockWindow.prototype.bringToFront = function() {
    this._zindex = this._parent.incrZIndex();
    this.$().css({"z-index":this._zindex});
  };

  dockWindow.prototype.on = function(eventName, fn) {
    this.$().get()[0].addEventListener(eventName, fn);
  };
  bulo.DockWindow = dockWindow;
})(jQuery,bulo);
