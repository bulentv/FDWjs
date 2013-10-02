// TEST CODE
$(document).ready( function () {
  var mgr = new bulo.WindowMgr();
  mgr.addWindow({left:"100px",top:"100px"});
  mgr.addWindow({left:"200px",top:"200px"});
  mgr.addWindow({left:"300px",top:"300px"});
  mgr.addWindow({left:"400px",top:"400px"});
  mgr.addWindow({left:"500px",top:"500px"});
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


    self._makeUID = function() {
      return uidPrefix+"_"+(++uidCounter);
    };

    self._last_wnd = null;
    self._zindex = 4000;
    self._windowIds = {};
    self._windowObjs = [];

    self._viewport = _createViewport(self._makeUID());

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

    self._viewport.append(wnd.getElement());

    wnd.on("move",function(sender,x,y,mouseX,mouseY){
      var id = sender.getElement().attr("id");

      var cur_wnd = null;

      for(var i in self._windowObjs) {
        var wnd = self._windowObjs[i];
        var _element = wnd.getElement();
        var _id = _element.attr("id");
        if(_id != id) {

          var pos = _element.position();
          if( (mouseX > (pos.left)) && (mouseX < (pos.left + _element.width())) && (mouseY > (pos.top)) && (mouseY < (pos.top + _element.height())) ) {

            if(!cur_wnd || wnd.hasHigherZ(cur_wnd)){
              cur_wnd = wnd;
            }
          }
        }
      }

      if(self._last_wnd && !self._last_wnd.isTheSame(cur_wnd))
        self._last_wnd.getElement().removeClass("fh");

      if(cur_wnd){
        cur_wnd.getElement().addClass("fh");
        self._last_wnd = cur_wnd;
      }

    });

    wnd.on("aftermove",function() {
      for(var i in self._windowObjs){
        var wnd = self._windowObjs[i];
        wnd.getElement().removeClass("fh");
      }
    });

    wnd.bringToFront();

  };
  window.bulo = {};
  bulo.WindowMgr = windowMgr;
})($);
