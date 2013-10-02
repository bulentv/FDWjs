














// TEST CODE
$(document).ready( function () {
  var mgr = new bulo.WindowMgr();
  mgr.addWindow({title:"First Panel",left:"100px",top:"100px",width:"300px",height:"200px"});
  mgr.addWindow({title:"Second Panel",left:"100px",top:"400px",width:"400px",height:"200px"});
  mgr.addWindow({title:"Third Panel",left:"500px",top:"150px",width:"250px",height:"200px"});
});

(function($,undefined) {

  /// WINDOW MGR
  function makeRandom(){
    return Math.round(Math.random()*1000000);
  }

  function _createViewport(id){
    return $("<div />")
    .addClass("viewport")
    .attr("id", id)
    .appendTo( $("body") );
  }

  function windowMgr(options){
    var self = this,
    uidPrefix = "bulownd",
    uidCounter = 10000;
    self._sizing = false;



    self._makeUID = function() {
      return uidPrefix+"_"+(++uidCounter);
    };

    self._last_wnd = null;
    self._zindex = 4000;
    self._windowIds = {};
    self._windowObjs = [];

    self._viewport = _createViewport(self._makeUID());
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

  }

  windowMgr.prototype.incrZIndex = function(){
    return ++this._zindex;
  }

  windowMgr.prototype.addWindow = function (options){
    var self = this;

    options = options || {};

    options.id = options.id || self._makeUID();

    options.parent = self;
    var wnd = new bulo.DockWindow(options);

    self._windowIds[options.id] = wnd;
    self._windowObjs.push(wnd);

    self._viewport.append(wnd.$());
    wnd.on("mousedown", function(e) {
        wnd.activateResize(e);   
      // We've handled this event. Don't let anybody else see it.  
      if (e.stopPropagation) e.stopPropagation();  // DOM Level 2
      else e.cancelBubble = true;                      // IE

      // Now prevent any default action.
      if (e.preventDefault) e.preventDefault();   // DOM Level 2
      else e.returnValue = false;                     // IE
    });
    wnd.on("move",function(ev){

      var mouseX = ev.detail.mouseX,
          mouseY = ev.detail.mouseY,
          id = $(ev.target).attr("id"),
          cur_wnd = null;


      // walk though all our windows
      for(var i in self._windowObjs) {
        
        // get the props of the current one
        var _wnd = self._windowObjs[i],
            _id = _wnd.$().attr("id"),
            _height = _wnd.$().height(),
            _width = _wnd.$().width(),
            _pos = _wnd.$().position();

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
      if(self._last_wnd && !self._last_wnd.isTheSame(cur_wnd))
        self._last_wnd.$().removeClass("fh");

      // if actually selected a valid target
      // activate it
      if(cur_wnd){
        cur_wnd.$().addClass("fh");
        self._last_wnd = cur_wnd;
      }

    });

    wnd.on("aftermove",function() {
      for(var i in self._windowObjs){
        var wnd = self._windowObjs[i];
        wnd.$().removeClass("fh");
      }
    });

    wnd.bringToFront();

  };
  window.bulo = {};
  bulo.WindowMgr = windowMgr;
})($);
