(function () {

  var BULO = window.BULO = window.BULO || {};

  BULO.Movable = function(options) {
    this._init(options);
  }

  BULO.Movable.prototype = {
    _init: function(options) {
      this._e = $("<div></div>")
        .addClass(options.class);

      this._e.css({width:options.width,height:options.height,left:options.left,top:options.top});
      
      if(options.cursor) 
        this._e.css({"cursor":options.cursor});


      this._cursor = options.cursor;
      this._base = options.base;
      this._base.append(this._e);

      this._e.bind("mousedown", this, this._downHandler);

      this._moving = false;

      this._startX = 0;
      this._startY = 0;
      this._startL = 0;
      this._startT = 0;

      this._leftLimit = -1;
      this._rightLimit = -1;
      this._topLimit = -1;
      this._bottomLimit = -1;
      this._lockX = false;
      this._lockY = false;

      this.setLockX(true);

      this._id = Math.random();

    },

    setLeftLimit: function(l){
      this._leftLimit = l;
    },

    setRightLimit: function(r){
      this._rightLimit = r;
    },
    
    setTopLimit: function(t){
      this._topLimit = t;
    },

    setBottomLimit: function(b){
      this._bottomLimit = b;
    },

    setLockX: function (lock) {
      if(lock !== false) {
        lock = true;
      }
      this._lockX = lock;
    },

    setLockY: function (lock) {
      if(lock !== false) {
        lock = true;
      }
      this._lockY = lock;
    },

    id: function() {
      return this._id;
    },

    // returns main jQuery object this object build on top of
    $: function() {
      return this._e;
    },
    
    bind: function(){
      this._e.bind.apply(this._e, arguments);
    },

    triggerMove: function() {
      this._e.trigger("move",[this._e.position().left,this._e.position().top, this]);
    },

    setLeft: function(left) {
      this._e.css({left:left+"px"});
      this.triggerMove();
    },

    getLeft: function(){
      return this._e.position().left;
    },
    
    setTop: function(top) {
      this._e.css({top:top+"px"});
      this.triggerMove();
    },
    
    getTop: function(){
      return this._e.position().top;
    },
    _upHandler: function(e) {
      var self = e.data;

      self._base.unbind("mousemove", self._moveHandler);
      $(document).unbind("mouseup", self._upHandler);
      self._moving = false;
      
      if(self._cursor)
        self._base.css({"cursor":"default"});
      
      self._e.trigger("aftermove");

    },

    _downHandler: function(e){
      var self = e.data;

      $(document).bind("mouseup", self, self._upHandler);
      self._base.bind("mousemove", self, self._moveHandler);
      self._moving = true;

      if(self._cursor)
        self._base.css({"cursor":self._cursor});

      self._startX = e.clientX;
      self._startY = e.clientY;
      self._startL = self._e.position().left;
      self._startT = self._e.position().top;
    },

    _moveHandler: function(e) {
      var self = e.data;

      var baseOffset = self._base.offset();

      var pos = {};
      if(!self._lockX) {

        pos.left =  Math.min(Math.max( 0, e.clientX - self._startX + self._startL),self._base.outerWidth()-self._e.outerWidth());

        if(self._leftLimit != -1)
          pos.left = Math.max(self._leftLimit, pos.left);

        if(self._rightLimit != -1)
          pos.left = Math.min(self._rightLimit, pos.left);

        pos.left += "px";

      }


      if(!self._lockY) {

        pos.top =  Math.min(Math.max( 0, e.clientY - self._startY + self._startT),self._base.outerHeight()-self._e.outerHeight());

        if(self._topLimit != -1)
          pos.top = Math.max(self._topLimit, pos.top);

        if(self._bottomLimit != -1)
          pos.top = Math.min(self._bottomLimit, pos.top);

        pos.top += "px";
      }

      self._e.css(pos);
      
      self._e.trigger("move",
        //we will deprecate these return values soon
        [parseInt(pos.left),parseInt(pos.top),self]
      );

    }

  };
})();
