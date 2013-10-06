(function($,undefined) {

  var BULO = window.BULO = window.BULO || {};

  BULO.WindowManager = function(options) {
    this._init(options);
  };

  BULO.WindowManager.prototype = {

    makeRandom: function(){
      return Math.round(Math.random()*1000000);
    },

    viewport: function() {
      return this._viewport;
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



      self._last_wnd = null;
      self._zindex = 4000;
      self._windowIds = {};
      self._windowObjs = [];

      self._viewport = self._createViewport(self._makeUID());
      
      
      /*
      self._viewport.bind("mousemove", function(e) {
        for(var i in self._windowObjs) {
          var wnd = self._windowObjs[i];
          wnd.resize(e);
        }
      });
      self._viewport.bind("mouseup", function(e) {
        for(var i in self._windowObjs) {
          var wnd = self._windowObjs[i];
          wnd.deActivateResize(e);
        }
      });
      */

    },

    removeMe: function(wnd){
      console.log("removeMe:",wnd);
      for(var i in this._windowObjs) {
        var o = this._windowObjs[i];
        if(o.isTheSame(wnd)) {
          this._windowObjs.splice(i,1);
          delete this._windowIds[o.$().attr("id")];
          return;
        }
      }
    },

    takeMe: function(wnd){
      console.log("takeMe:",wnd);
      this._windowObjs.push(wnd);
      this._windowIds[wnd.$().attr("id")] = wnd;
      this._viewport.append(wnd.$());
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

      options = options || {};

      options.id = options.id || self._makeUID();

      options.parent = self;
      //var wnd = new bulo.DockWindow(options);
      var wnd = new BULO.DockContainer(options);

      self._windowIds[options.id] = wnd;
      self._windowObjs.push(wnd);

      self._viewport.append(wnd.$());
      
      wnd.addContent($("<div>PANEL 2</div>"));//.addClass("dummyOrange"));
      wnd.addContent($("<div>PANEL 2</div>"));//.addClass("dummyGreen"));

      wnd.$().css({
        width: options.width+"px",
        height: options.height+"px",
        left: options.left+"px",
        top: options.top+"px"
      });

      wnd.bind("activate",{wnd:wnd,self:self},self._onWndActivate);
      
      //wnd.addSplitter();
      //wnd.on("mousedown", function(e) {
      //  wnd.activateResize(e);   
        // We've handled this event. Don't let anybody else see it.  
        //      if (e.stopPropagation) e.stopPropagation();  // DOM Level 2
        //      else e.cancelBubble = true;                      // IE

        // Now prevent any default action.
        //      if (e.preventDefault) e.preventDefault();   // DOM Level 2
        //      else e.returnValue = false;                     // IE
      //});
      
      wnd.bind("move",{self:this,wnd:wnd},function(ev,org_event){

        var mouseX = org_event.clientX,
        mouseY = org_event.clientY,
        id = ev.data.wnd.id(),
        cur_wnd = null;


        // walk though all our windows
        for(var i in self._windowObjs) {

          // get the props of the current one
          var _wnd = self._windowObjs[i],
          _id = _wnd.$().attr("id"),
          _height = _wnd.$().outerHeight(),
          _width = _wnd.$().outerWidth(),
          _pos = _wnd.$().position(),
          padT = parseInt(_wnd.$().css("padding-top")),
          padL = parseInt(_wnd.$().css("padding-left")),
          padB = parseInt(_wnd.$().css("padding-bottom")),
          padR = parseInt(_wnd.$().css("padding-right"));

          if(
            // it is not myself
            (_id != id) &&

            // it is under the mouse pointer (horizontal check)
            (mouseX > (_pos.left)) && 
            (mouseX < (_pos.left + _width)) && 

            // it is under the mouse pointer (vertical check)
            (mouseY > (_pos.top)) && 
            (mouseY < (_pos.top + _height)) &&

            // it is more closer to me in z-axis than the last one
            // or last one was already null
            (!cur_wnd || _wnd.hasHigherZ(cur_wnd))
          ){

            // replace the chosen one
            cur_wnd = _wnd;

          }
        }

        // if we previously highlighted a different target,
        // activate it
        if(self._last_wnd && !self._last_wnd.isTheSame(cur_wnd)){
          self._last_wnd.$().removeClass("fh");
          self._last_wnd.hideProxy();
          self._last_wnd = null;
        }

        // if actually selected a valid target
        // activate it
        if(cur_wnd){
          cur_wnd.$().addClass("fh");
          self._last_wnd = cur_wnd;
          cur_wnd.showProxy(wnd);

        }

      });
/*
      _del_wnd.bind("aftermove",this,function() {
        for(var i in self._windowObjs){
          var wnd = self._windowObjs[i];
          wnd.$().removeClass("fh");
          wnd.hideProxy();
          self._last_wnd = null;
        }
      });

      _del_wnd.setZIndex(self.incrZIndex());
*/
      return wnd;

    }
  };
})($);
