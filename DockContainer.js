(function () {
  
  var BULO = window.BULO = window.BULO || {};

  BULO.DockContainer = function(options) {
    this._init(options);
  }

  BULO.DockContainer.prototype = {

    _init: function(options) {
      var self = this;

      options = options || {};
      this._id = options.id;
      this._mode = options.mode || "normal";
      this._old_parent = null;
      this._parent = null;
      this._mgr = options.mgr;
      this.setParent(options.parent,null);

      this._e = $("<div></div>").addClass("pane")
      .css({
        width: options.width || "100px",
        height: options.height || "100px",
        top: options.top || "100px",
        left: options.left || "100px"
      });
      this._titletext = options.title || "Untitled";
      this._title = $("<div unselectable='on'>"+this._titletext+"</div>").addClass("title"); 
      this._title.attr("unselectable","on");
      this._header = $("<div></div>").addClass("header");
      this._header.append(this._title);
      if(options.mode == "child") {
        this.changeWindowMode("child");
      }


      this._e.append(this._header);

      this._createSplitter();

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

      this._proxy = null;

      this._taken = false;

      this._header.bind("mouseenter", this, this._mouseOnHeaderHandler);
      this._header.bind("dblclick", this, this._headerDblClickHandler);
      this._e.bind("mouseenter", this, this._mouseOnPaneHandler);
      this._e.bind("mousedown", this, this._mouseDownGeneral);

      $(document).bind("mousemove", self, self._moveHandler);

    },

    setParent: function(parent,e){
      this._old_parent = this._parent;
      this._parent = parent;
      this._parentContainer = this._parent.$() || $("body")

      if(this._old_parent && e) {
        this._startL = this._old_parent.$().position().left + this.$().position().left;
        this._startT = this._old_parent.$().position().top + this.$().position().top+this._header.outerHeight();
        this._startX = e.clientX;
        this._startY = e.clientY;
        this.$().css({
          left:this._startL,
          top:this._startT
        });
      }

      this._parentContainer.append(this._e);
    },

    isTaken: function() {
      return this._taken;
    },

    title: function() {
      return this._titletext;
    },
    
    setBase: function(base) {
      this._base = base;
    },

    changeWindowMode: function(mode) {
      console.log("changing "+this._id+" to "+mode);
      console.log(this._e,this._title,this._header);
      if(mode == "normal") {
        this._e.removeClass("tool-pane");
        this._title.removeClass("tool-title");
        this._header.removeClass("tool-header");
      }else if(mode == "child") {
        this._e.addClass("tool-pane");
        this._title.addClass("tool-title");
        this._header.addClass("tool-header");
      }
      this._mode = mode;
    },

    hideProxy: function() {
      if(this._proxy) {
        console.log("hiding proxy");

        this._proxy.remove();
        this._proxy = null;
      }
    },

    showProxy: function(wnd) {
      var proxy = this._proxy;
      if(!proxy) {
        proxy = this._proxy = new BULO.Proxy({parent:this,moving:wnd});
      }

      proxy.show();
    },

    setZIndex: function(zindex) {

      this._e.css({
        "z-index": zindex
      });
      this._zindex = zindex;
    },

    zIndex: function(){
      return this._zindex;
    },

    bind: function() {
      this._e.bind.apply(this._e, arguments);
    },

    id: function() {
      return this._id;
    },

    setTitle: function(title) {
      this._title.text(title);
    },

    addWindow: function(wnd) {

      wnd.setParent(this,null);
      
      this._splitter.addContent(wnd);
      if(this._splitter.itemCount() == 1) {
        this.setTitle(wnd.title());
        wnd._header.hide();
      }else{
        this.setTitle("FDW.js") 
        wnd._header.show();
      }
    },

    getChildren: function() {
      return this._splitter.getChildren();
      //return [this._e];//splitter.getChildren();
    },

    triggerResize: function() {
      this._e.trigger("resize");
      this._e.trigger("move");
    },

    _createSplitter: function() {
      
      var self = this;
      
      this._splitter = new BULO.Splitter({
        parent: this
      });
      
      this._splitter.bind("smove",this._splitter, function (e) {
        self.$().trigger("smove");  
      });
    },

    // returns main jQuery object this object build on top of
    $: function() {
      return this._e;
    },

    
    _mouseDownGeneral: function(e) {
      var self = e.data;
      self._e.trigger("activate");
    },

    _mouseOnPaneHandler: function(e) {
      var self = e.data;
      self._underTheMouseCursor = true;
      self._e.bind("mouseleave", self, self._mouseLeavePaneHandler);
    },

    _mouseLeavePaneHandler: function(e){
      var self = e.data;
      self._e.unbind("mouseleave", self._mouseLeavePaneHandler);
      self._underTheMouseCursor = false;
    },

    _storePosAndSize: function() {
      this._old_css.left = this._e.css("left");
      this._old_css.top = this._e.css("top");
      this._old_css.width = this._e.css("width");
      this._old_css.height = this._e.css("height");
    },

    _restorePosAndSize: function() {
      var self = this;
      this._e.stop().animate({
        left:this._old_css.left,
        top:this._old_css.top,
        width:this._old_css.width,
        height:this._old_css.height,
      },{
        done:function() {
          self._maximized = false;
        },
        step:function() {
          self._e.trigger("resize");
          self._e.trigger("move");
        },
        duration:200
      });
    },

    _headerDblClickHandler: function(e) {
      var self = e.data;
      if(self._maximized) {
        self._restorePosAndSize();
      }else{
        self._storePosAndSize();
        self._e.stop().animate({
          left:0,
          top:0,
          width:"100%",
          height:"100%"
        },{
          done:function() {
            self._maximized = true;
          },
          step:function() {
            self._e.trigger("resize");
            self._e.trigger("move");
          },
          duration:200
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
        self._resize(e);

        e.preventDefault();
        return false;

      }else if(self._moving) {
        self._move(e);

        //console.log("moving");
        e.preventDefault();

        return false;

      }else if(self._underTheMouseCursor ) {

        var pos = self._e.offset(),

        left = pos.left,
        top = pos.top,
        right = pos.left + self._e.outerWidth(),
        bottom = pos.top + self._e.outerHeight(),

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
      self._e.trigger("aftermove");

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

      self._startW = self._e.outerWidth();
      self._startH = self._e.outerHeight();

      var pos = self._e.position();

      self._startL = pos.left;
      self._startT = pos.top;

      e.preventDefault();

      return false;

    },

    _move: function(e) {
      var self = this;

      var clientX = e.clientX,
      clientY = e.clientY;

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

      if(self._mode == "child") {
        self.changeWindowMode("normal");
        self._mgr.takeMe(self,e);
        self.$().trigger("undock");
      }else {
        this.Move(left, top, null, null, e);
      }
    },

    _resize: function( e) {

      var clientX = e.clientX,
      clientY = e.clientY;

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
      this.Move(left, top, width, height, e);

    },

    Move: function(left, top, width, height, org_event) {
      var css = {};

      if(left) css.left = left;
      if(top) css.top = top;
      if(width) css.width = width;
      if(height) css.height = height;

      this._e.css(css);
      if(width || height) {
        this._e.trigger("resize");
      }else {
        this._e.trigger("move",{org_event:org_event});
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
})();
  
