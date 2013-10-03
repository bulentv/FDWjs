(function($,bulo,undefined){
  function dockWindow(options){
    var self = this;

    this._parent = options.parent;
    self._zindex = -1;


    self.isDragActivated = false;
    self.cursorType = "";
    self.isCursorOnBorder = false;

    self.moving = false;

    var title = options.title || "Window";
    var header = $("<div><div class=\"title\">"+title+"</div></div>")
    .addClass("header");

    header.on("mouseenter", function(e) {
      if(self.isDragActivated) return;
      $(this).addClass("active-header");
    });
    header.on("mouseleave", function(e) {
      if(self.moving) return;
      $(this).removeClass("active-header");
    });

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
      },
      "mouseleave": function(e) {
      }
    });

    header.css({top:"0px"});
    this._proxy = null;

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
    header.on("mousedown", function (event) {

      var wnd = self._wnd;
      self.bringToFront();

      self.moving = true;

      self.$().fadeTo(60,0.7);
      self.$().addClass("hilight_frame");



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

        self.$().fadeTo(300,1);
        self.$().removeClass("hilight_frame");
        self.moving = false;

        // Unregister the capturing event handlers.
        document.removeEventListener("mouseup", upHandler, true);
        document.removeEventListener("mousemove", moveHandler, true);

        self._triggerEvent(new CustomEvent("aftermove"));

      }
    });
  }

  dockWindow.prototype.hideProxy = function() {
    if(this._proxy) {
      this._proxy.remove();
      this._proxy = null;
    }
  };
  dockWindow.prototype.showProxy = function() {
    var proxy = this._proxy;
    if(!proxy) {
      proxy = this._proxy = new bulo.Proxy({parent:this});
    }

    proxy.show();
  };
  dockWindow.prototype.resizeState = function(state) {
    if(!state) {
      return this._resizeState;
    }else{
      this._resizeState = state;
    }
  };
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
  dockWindow.prototype.activateResize = function() {
    this.isDragActivated = true;
  };

  dockWindow.prototype.deActivateResize = function() {
    //this is an onmouseup event
    this.isDragActivated = false;
    this.isCursorOnBorder = false;
    this.cursorType = "default";
    this.$().css({"cursor":this.cursorType});
  }


  //this is an onmousemove event called from changeCursot()
  dockWindow.prototype.resize = function(e) {
    if(this.isDragActivated){

      var $e = this.$();

      var element = this.$().get()[0];
      var curevent=e;
      //coordiantes of the event position
      var x = curevent.clientX;
      var y = curevent.clientY;
      var element = this.$().get()[0];//document.getElementById(elementID);

      //top left positions of the div element
      var topLeftX = element.offsetLeft;
      var topLeftY = element.offsetTop;

      //width and height of the element
      var width = element.offsetWidth;
      var height = element.offsetHeight;

      //get the cursor sytle [e,w,n,s,ne,nw,se,sw]
      var cursor = this.cursorType.substring(0,this.cursorType.indexOf('-'));

      var pos = $e.position(),
      width = $e.width(),
      height = $e.height(),
      padT = parseInt($e.css("padding-top")),
      padL = parseInt($e.css("padding-left")),
      padB = parseInt($e.css("padding-bottom")),
      padR = parseInt($e.css("padding-right"));
      borderT = parseInt($e.css("border-top")),
      borderL = parseInt($e.css("border-left")),
      borderB = parseInt($e.css("border-bottom")),
      borderR = parseInt($e.css("border-right"));

      if(cursor.indexOf('e')!=-1)
      {
        $e.css({"width":e.clientX-(pos.left+padL+padR+borderL+borderR)+"px"}); //ok
      }
      if(cursor.indexOf('s')!=-1)
      {
        $e.css({"height":e.clientY-(pos.top+padT+padB+borderT+borderB)+"px"}); //ok
      }
      if(cursor.indexOf('w')!=-1)
      {
        if(e.clientX<=pos.left+padL+padR+width) {
          $e.css({"left":e.clientX+"px"});
          $e.css({"width":Math.max((width+(pos.left)-e.clientX),5)+"px"});
        }
      }
      if(cursor.indexOf('n')!=-1)
      {
        if(e.clientY<=pos.top+height) {
          $e.css({"top":e.clientY+"px"});
          $e.css({"height":Math.max((height+(pos.top)-e.clientY),5)+"px"});
        }
      }

      this._triggerEvent(new CustomEvent("resize",{detail:{height:$e.height()}}));

    }
    else {
      this.changeCursor(e);
    }
  };


  dockWindow.prototype.changeCursor = function(e) {
    //this is an onmousemove event

    var cursorType = "default";

    //code start for changing the cursor
    var element = this.$().get()[0];//document.getElementById(elementID);
    var topLeftX = element.offsetLeft;
    var topLeftY = element.offsetTop;
    var bottomRightX = topLeftX+element.offsetWidth;
    var bottomRightY = topLeftY+element.offsetHeight;
    var curevent=e;
    var x = curevent.clientX;
    var y = curevent.clientY;
    //window.status = topLeftX +"--"+topLeftY+"--"+bottomRightX+"--"+bottomRightY+"--"+x+"--"+y+"--"+isDragActivated;

    //change the cursor style when it is on the border or even at a distance of 8 pixels around the border
    if(x >= topLeftX-8 && x <= topLeftX+8){
      if(y >= topLeftY-8 && y <= topLeftY+8 ){
        isCursorOnBorder = true;
        cursorType = "nw-resize";
      }
      else if(y >= bottomRightY-8 && y <= bottomRightY+8){
        isCursorOnBorder = true;
        cursorType = "sw-resize";
      }
      else if(y > topLeftY-8 && y < bottomRightY+8){
        isCursorOnBorder = true;
        cursorType = "w-resize";
      }
      else{
        //       isCursorOnBorder = false;
        //       cursorType = "default";
      }
    }
    else if(x >= bottomRightX-8 && x <= bottomRightX+8){
      if(y >= topLeftY-8 && y <= topLeftY+8){
        isCursorOnBorder = true;
        cursorType = "ne-resize";
      }
      else if(y >= bottomRightY-8 && y <= bottomRightY+8){
        isCursorOnBorder = true;
        cursorType = "se-resize";
      }
      else if(y > topLeftY-8 && y < bottomRightY+8){
        isCursorOnBorder = true;
        cursorType = "e-resize";
      }
      else{
        //       isCursorOnBorder = false;
        //       cursorType = "default";
      }
    }
    else if(x > topLeftX-8 && x < bottomRightX+8){
      if(y >= bottomRightY-8 && y <= bottomRightY+8){
        isCursorOnBorder = true;
        cursorType = "s-resize";
      }
      else if(y >= topLeftY-8 && y <= topLeftY+8){
        isCursorOnBorder = true;
        cursorType = "n-resize";
      }
      else{
        //        isCursorOnBorder = false;
        //        cursorType = "default";
      }
    }

    this.cursorType = cursorType;
    this.$().css({"cursor":this.cursorType});
    //end of code for changing the cursor

    //    resizeDiv(elementID,e);
  }

  bulo.DockWindow = dockWindow;
})(jQuery,bulo);
