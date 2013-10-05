(function () {

  var DockContainer = function(options) {
    this._init(options);
  }

  DockContainer.prototype = {

    _init: function(options) {
      var self = this;

      options = options || {};

      this._pane = $("<div><div style='background-color:green;width:100%;height:100%;'>DENEME</div></div>").addClass("pane");
      this._header = $("<div><div unselectable='on' class='title unselectable'>HEADER</div></div>").addClass("header");


      this._parentContainer = options.parent || $("body")

      this._parentContainer.append(this._pane);
      this._pane.append(this._header);

      this._state = "";
      this._resizing = false;
      this._moving = false;
      this._underTheMouseCursor = false;
      this._maximized = false;
      this._old_css = {left:0,top:0,width:"200px",height:"200px"};

      this._startX = 0;
      this._startY = 0;
      this._startW = 0;
      this._startH = 0;
      this._startL = 0;
      this._startT = 0;

      this._header.bind("mouseenter", this, this._mouseOnHeaderHandler);
      this._header.bind("dblclick", this, this._headerDblClickHandler);
      this._pane.bind("mouseenter", this, this._mouseOnPaneHandler);

      $(document).bind("mousemove", self, self._moveHandler);

    },

    _mouseOnPaneHandler: function(e) {
      var self = e.data;
      self._underTheMouseCursor = true;
      self._pane.bind("mouseleave", self, self._mouseLeavePaneHandler);
    },

    _mouseLeavePaneHandler: function(e){
      var self = e.data;
      self._pane.unbind("mouseleave", self._mouseLeavePaneHandler);
      self._underTheMouseCursor = false;
    },

    _storePosAndSize: function() {
      this._old_css.left = this._pane.css("left");
      this._old_css.top = this._pane.css("top");
      this._old_css.width = this._pane.css("width");
      this._old_css.height = this._pane.css("height");
    },

    _restorePosAndSize: function() {
      this._pane.stop().animate({
        left:this._old_css.left,
        top:this._old_css.top,
        width:this._old_css.width,
        height:this._old_css.height
      },100);
    },

    _headerDblClickHandler: function(e) {
      var self = e.data;
      if(self._maximized) {
        self._restorePosAndSize();
        self._maximized = false;
      }else{
        self._storePosAndSize();
        self._pane.stop().animate({
          left:0,
          top:0,
          width:"100%",
          height:"100%"
        },100,function() {
          self._maximized = true;
        });
      }
    },

    _mouseLeaveHeaderHandler: function(e){
      var self = e.data;

      self._header.unbind("mouseleave", self._mouseLeaveHeaderHandler);

      if(self._resizing) return false;
      self._setState("");
    },

    _mouseOnHeaderHandler: function(e) {
      var self = e.data;

      if(self._resizing) return false;
      self._setState("move");

      self._header.bind("mouseleave", self, self._mouseLeaveHeaderHandler);

    },

    _moveHandler: function(e) {
      var self = e.data;


      var state = "";
      if(self._resizing) {
        self._resize(e.clientX, e.clientY);

        e.preventDefault();
        return false;

      }else if(self._moving) {
        self._move(e.clientX, e.clientY);

        //console.log("moving");
        e.preventDefault();

        return false;

      }else if(self._underTheMouseCursor ) {

        var pos = self._pane.offset(),

        left = pos.left,
        top = pos.top,
        right = pos.left + self._pane.outerWidth(),
        bottom = pos.top + self._pane.outerHeight(),

        innerLead = 5,
        cornerLead = 15;

        if(self._state == "move") return;

        if(e.clientX > left && e.clientX < right && e.clientY > top && e.clientY < bottom) {

          // mouse is our range, but we need to do more testing
          if(e.clientX < (left + innerLead)) {

            // mouse is on the left edge
            if( e.clientY < (top + cornerLead) ){
              state = "nw";
            }else if( e.clientY > (bottom - cornerLead)){
              state = "sw";
            }else {state = "w";}

          }else if(e.clientX > (right - innerLead)) {

            // mouse is on the right edge
            if( e.clientY < (top + cornerLead) ) {
              state = "ne";
            }else if( e.clientY > (bottom - cornerLead)) {
              state = "se";
            }else {state = "e";}

          }else if(e.clientY < (top + innerLead)){
            state = "n";
          }else if(e.clientY > (bottom - innerLead)){
            state = "s";
          }
        }
      }
      // set default cursor or reset cursor here
      return self._setState(state);
    },

    _upHandler: function(e) {
      var self = e.data;

      $(document).unbind("mouseup", self._upHandler); 
      //console.log("mouse up ending " + self._state);
      self._resizing = false;
      self._moving = false;
    },

    _downHandler: function(e) {
      var self = e.data;
      //console.log("mouse down for " + self._state);

      $(document).bind("mouseup", self, self._upHandler);

      if(self._state == "move"){
        self._moving = true;
      }else{
        self._resizing = true;
      }

      self._startX = e.clientX;
      self._startY = e.clientY;

      self._startW = self._pane.outerWidth();
      self._startH = self._pane.outerHeight();

      var pos = self._pane.position();

      self._startL = pos.left;
      self._startT = pos.top;

      e.preventDefault();

      return false;

    },

    _move: function(clientX, clientY) {
      var self = this;

      var parentOffset = self._parentContainer.offset();
      var offsetL = parentOffset.left;
      var offsetT = parentOffset.top;
      var offsetW = self._parentContainer.outerWidth();
      var offsetH = self._parentContainer.outerHeight();


      var left, top;
      if( clientX > offsetL && clientX < + offsetL + offsetW){
        left = clientX - (self._startX - self._startL) + "px";
      }
      if( clientY > offsetT && clientY < offsetT + offsetH){
        top = clientY - (self._startY - self._startT) + "px";
      }

      this.Move(left, top);
    },

    _resize: function( clientX, clientY) {

      // RESIZE ////////
      var min_size = 50,
      max_edge = 0,
      parentW = this._parentContainer.width(),
      parentH = this._parentContainer.height();
      var parentOffset = this._parentContainer.offset();
      parentL = parentOffset.left;
      parentT = parentOffset.top;

      if(clientX < parentL+max_edge)
        clientX=parentL+max_edge;

      if(clientY < parentT+max_edge)
        clientY=parentT+max_edge;

      if(clientX > (parentL+parentW-max_edge))
        clientX=parentL+parentW-max_edge;

      if(clientY > (parentT+parentH-max_edge))
        clientY=parentT+parentH-max_edge;

      var deltaX = clientX - this._startX,
      deltaY = clientY - this._startY,
      newW, newH, newL, newT;

      var left, top, width, height; 

      // e , ne or se
      if (this._state.indexOf('e') != -1){
        width = this._startW + Math.max(deltaX,min_size-this._startW);
      }
      // s , se or sw
      if (this._state.indexOf('s') != -1){
        height = this._startH + Math.max(deltaY,min_size-this._startH);
      }
      // w , sw or nw
      if (this._state.indexOf('w') != -1) {
        left = this._startL + Math.min(deltaX,this._startW-min_size);
        width = this._startW - Math.min(deltaX,this._startW-min_size);
      }
      // n , ne or nw
      if (this._state.indexOf('n') != -1) {
        top = this._startT + Math.min(deltaY,this._startH-min_size);
        height = this._startH - Math.min(deltaY,this._startH-min_size);
      }
      this.Move(left, top, width, height);

    },

    Move: function(left, top, width, height) {
      var css = {};

      if(left) css.left = left;
      if(top) css.top = top;
      if(width) css.width = width;
      if(height) css.height = height;

      this._pane.css(css);
      if(width || height) {
        // TODO:fire resize event here
        console.log("TODO: fire resize event here");
      }else {
        //TODO: fire move event here
        console.log("TODO: fire move event here");
      }
      this._storePosAndSize();
      this._maximized = false;
    },

    _setState: function(stateStr) {
      var self = this;

      if(self._state != stateStr) {

        //console.log("Removing down handler for "+self._state,stateStr);
        $(document).unbind("mousedown", self._downHandler);
        self._state = stateStr;

        if(self._state != "") {

          if(self._state == "move") {
            $("body").css({cursor:"default"});
            //console.log("Attaching down handler for "+self._state);
            $(document).bind("mousedown", self, self._downHandler);

          }else {
            $("body").css({cursor:self._state+"-resize"});
            //console.log("Attaching down handler for "+self._state);
            $(document).bind("mousedown", self, self._downHandler);
          }

        }else $("body").css({cursor:"default"});

      } 
    }
  };
  
  var BULO = window.BULO = window.BULO || {};
  BULO.DockContainer = DockContainer;

})();
  
$(document).ready( function () {
  new BULO.DockContainer({parent:$("#par")});
  new BULO.DockContainer();
});
