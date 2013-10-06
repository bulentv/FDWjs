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

      this._id = Math.random();

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
    
    _upHandler: function(e) {
      var self = e.data;

      self._base.unbind("mousemove", self._moveHandler);
      $(document).unbind("mouseup", self._upHandler);
      self._moving = false;
      
      if(self._cursor)
        self._base.css({"cursor":"default"});

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

      var calcLeft =  Math.min(Math.max( 0, e.clientX - self._startX + self._startL),self._base.outerWidth()-self._e.outerWidth());
      var calcTop =  Math.min(Math.max( 0, e.clientY - self._startY + self._startT),self._base.outerHeight()-self._e.outerHeight());

      self._e.css({
        left: calcLeft+"px",
        top: calcTop+"px"
      });

      self._e.trigger("move",[calcLeft,calcTop, self]);
    }

  };
})();
