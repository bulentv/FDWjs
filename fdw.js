(function($,undefined) {

  var BULO = window.BULO = window.BULO || {};

  BULO.WindowManager = function(options) {
    this._init(options);
  };

  BULO.WindowManager.prototype = {

    viewport: function() {
      return this._viewport;
    },

    $: function() {
      return this.viewport();
    },

    _createViewport: function(id){
      return $("<div />")
      .addClass("viewport")
      .attr("id", id)
      .appendTo( $("body") );
    },

    _makeUID: function() {
      return this._uidPrefix+"_"+(++this._uidCounter);
    },

    _init: function(options){
      var self = this;
      this._uidPrefix = "BULO";
      this._uidCounter = 10000;
      self._sizing = false;

      self._zReOrderFixTimer = null;

      self._last_wnd = null;
      self._zindex = 4000;
      self._windowIds = {};
      self._windowObjs = [];

      self._viewport = self._createViewport(self._makeUID());

    },

    removeMe: function(wnd){
      console.log("removeMe:",wnd);
      for(var i in this._windowObjs) {
        var o = this._windowObjs[i];
        if(o.id() == wnd.id()) {
          this._windowObjs.splice(i,1);
          delete this._windowIds[o.$().attr("id")];
          return;
        }
      }
    },

    takeMe: function(wnd,e){
      console.log("takeMe:",wnd);

      wnd.$().css({
        width:wnd.$().outerWidth()+"px",
        height:wnd.$().outerHeight()+"px"
      });
      
      wnd.setParent(this,e);

      var options = {};
      options.id = this._makeUID();
      options.mode = "child";
      options.title = wnd.title();
      options.hideTitle = true;

      var innerWnd =  this._createDockContainer(options);

      wnd.addWindow(innerWnd);
      
      this._windowObjs.push(wnd);
      this._windowIds[wnd.$().attr("id")] = wnd;
      this._viewport.append(wnd.$());
      console.log(wnd.$().position());
      console.log(wnd.$().position());
      wnd.setZIndex(this.incrZIndex());
    },

    incrZIndex: function(){
      return ++this._zindex;
    },

    getEngaged: function(){
      return this._last_wnd;
    },

    _onWndActivate: function(e) {
      var wnd = e.data.wnd;
      var self = e.data.self;
      wnd.setZIndex(self.incrZIndex());
    },

    addWindow: function (options){
      var self = this;
      
      options.id = self._makeUID();
//      options.title = self._makeUID();
      options.mode = "normal";
      var wnd = this._createDockContainer(options);
      
      options.id = self._makeUID();
//      options.title = self._makeUID();
      options.mode = "child";
      options.content = null;
      options.hideTitle = true;
      var innerWnd =  this._createDockContainer(options);

      
      self._windowIds[options.id] = wnd;
      self._windowObjs.push(wnd);
      self._viewport.append(wnd.$());
      wnd.setZIndex(self.incrZIndex());

      wnd.addWindow(innerWnd);

      return wnd;
    },

    _createDockContainer: function(options){
      var self = this;

      options = options || {};

      options.id = options.id || self._makeUID();

      options.parent = self;
      options.mgr = self;
      var wnd = new BULO.DockContainer(options);

      


      //wnd.addContent($("<div>PANEL 2</div>"));//.addClass("dummyOrange"));

      //$("<div id='"+options.id+"'></div>"));//.addClass("dummyGreen"));

      wnd.$().css({
        width: options.width+"px",
        height: options.height+"px",
        left: options.left+"px",
        top: options.top+"px"
      });

      wnd.bind("activate",{wnd:wnd,self:self},self._onWndActivate);

      wnd.bind("move",{self:this,wnd:wnd},function(ev,data){

        if(!data) return;

        var org_event = data.org_event;

        // for now, maximize/normal command is not providibf the org event
        // object so we are ignoring that here 
        //
        if(!org_event) return;


        var mouseX = org_event.clientX,
        mouseY = org_event.clientY,
        id = ev.data.wnd.id(),
        cur_wnd = null;


        // walk though all our windows
        for(var i in self._windowObjs) {

          // get the props of the current one
          var _wnd = self._windowObjs[i],
          _id = _wnd.id(),//$().attr("id"),
          _height = _wnd.$().outerHeight(),
          _width = _wnd.$().outerWidth(),
          _pos = _wnd.$().position(),
          padT = parseInt(_wnd.$().css("padding-top")),
          padL = parseInt(_wnd.$().css("padding-left")),
          padB = parseInt(_wnd.$().css("padding-bottom")),
          padR = parseInt(_wnd.$().css("padding-right"));

          if(
            // it is not myself
            (_id != id)

            // it is under the mouse pointer (horizontal check)
            && (mouseX > (_pos.left))
            && (mouseX < (_pos.left + _width))

            // it is under the mouse pointer (vertical check)
            && (mouseY > (_pos.top))
            && (mouseY < (_pos.top + _height))

            // it is more closer to me in z-axis than the last one
            // or last one was already null
            && (!cur_wnd || (_wnd.zIndex() > cur_wnd.zIndex()))
          ){

            // replace the chosen one
            cur_wnd = _wnd;

          }
        }

        // if we previously highlighted a different target,
        // de-activate it
        if((!cur_wnd && self._last_wnd) || (self._last_wnd && self._last_wnd.id() != cur_wnd.id())){
          clearTimeout(self._zReOrderFixTimer);
          self._last_wnd.$().removeClass("fh");
          self._last_wnd.hideProxy();
          self._last_wnd = null;
        }

        // if actually selected a valid target
        // activate it
        if(cur_wnd){

          // clear the z-order fix timer if there is any
          clearTimeout(self._zReOrderFixTimer);

          // highlight it 
          cur_wnd.$().addClass("fh");

          // store it as lastly highlighted window
          self._last_wnd = cur_wnd;

          // get the proxy window
          cur_wnd.showProxy(wnd);

          // we just dragging our window on one of the other windows
          // wait for 1sec then bring it to front just after the floating window
          // to do that, we need to bring it to front then bring the floating one to the front
          self._zReOrderFixTimer = setTimeout( function () {
            cur_wnd.setZIndex( self.incrZIndex());
            wnd.setZIndex( self.incrZIndex());
          },1000);

        }

        return wnd;

      });

      wnd.bind("smove", function () {
        console.log("smove!");
      });

      wnd.bind("aftermove",wnd,function(e) {
        //console.log(e,wnd,self._last_wnd,self._last_wnd._proxy.getActiveBtn());

        var sourceWnd = e.data;
        var destWnd = self._last_wnd;
        if(destWnd && destWnd._proxy) {
          var activeBtn = destWnd._proxy.getActiveBtn();
          destWnd._proxy.remove();
          destWnd._proxy = null;
          if(activeBtn) {
            switch(activeBtn.type) {
            case BULO.dockBtnType.CENTER:
              console.log("CENTER");break;
            case BULO.dockBtnType.RIGHT:
      
      

              if(!sourceWnd._taken) {
                if(destWnd) {
                  self.removeMe(sourceWnd);



                  // DOCKING
                  var children = sourceWnd.getChildren();
                  for(var i in children){
                    var wnd = children[i];
                    wnd.showTitle();
                    destWnd.addWindow(wnd);
                    wnd.changeWindowMode("child");
                    wnd.triggerResize();
                  }
                  sourceWnd.$().remove();

                }
              }
            case BULO.dockBtnType.LEFT:
              console.log("LEFT");break;
            case BULO.dockBtnType.TOP:
              console.log("TOP");break;
            case BULO.dockBtnType.BOTTOM:
              console.log("BOTTOM");break;
            default:
              console.log("Unknown Btn");break;
            }
          }
        }



        // look for the current hi-light window
        // actually get everything
        for(var i in self._windowObjs){
          var wnd = self._windowObjs[i];

          // clear the z-order fix timer if there is any
          if(self._zReOrderFixTimer)
            clearTimeout(self._zReOrderFixTimer);

          // ensure it is not hi-lighted
          wnd.$().removeClass("fh");

          wnd.hideProxy();

          //reset the active wnd storage
          self._last_wnd = null;
        }
      });

      return wnd;

    }
  };
})($);
