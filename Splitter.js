(function () {

  var BULO = window.BULO = window.BULO || {};

  BULO.Splitter = function(options) {
    this._init(options);
  };

  BULO.Splitter.prototype = {
    _init: function(options) {
      this._e = $("<div class='splitter-root'></div>");
      this._parent = options.parent;

      this._parent.$().append(this._e);

      // get notifed when parent resizes 
      this._parent.bind("resize", this, this._onParentResize);

      this._children = [];
      this._oldParentSize= 0;

    },


    // returns main jQuery object this object build on top of
    $: function() {
      return this._e;
    },

    _onParentResize: function(e) {

      var self = e.data;
      var newParentSize = self._e.width();

      if(self._oldParentSize <= 0) {
        self._oldParentSize = newParentSize;
        return;
      }

      var multiplier = newParentSize / self._oldParentSize;

      self._oldParentSize = newParentSize;

      for(var i in self._children) {
        var s = self._children[i];
        if(s.type == "splitter") {
          s.data.setLeft(s.data.getLeft() * multiplier);
          s.data.triggerMove();
        }
      }

    },

    _createSplitter: function() {

      return new BULO.Movable({
        base: this._e,
        width:"6px",
        height:"100%",
        right:"0px",
        top:"0px",
        class:"splitter-handle",
        cursor: "e-resize"
      });

    },

    _handleSplitterMove: function(e, left) {

      // increase the left value by the half of the 
      // splitter object width
      left += 3;


      var self = e.data.self,
      splitter = e.data.splitter,

      items_before = [],
      items_after = [],
      ratio,

      total_width = self._e.width(),

      sfound = false;

      var left_content, right_content, last_s;
      for(var i in self._children) {
        var c = self._children[i];
        if(c.type == "content") {
          if(!sfound) {
            left_content = c.data;
          }else{
            if(!right_content)
              right_content = c.data;
          }
        }else {
          if(sfound) {
            last_s = c.data;
          }else
          if(c.data.id() == splitter.id()) {
            sfound=true;
          }
        }
      }

      var old_left_left = left_content.position().left;
      left_content.css({
        width: left - old_left_left - 2 +"px",
        position: "absolute"
      });
      if(right_content) {
        var old_right_width = right_content.outerWidth();
        var old_right_left = right_content.position().left;

        var new_width;
        if(!last_s) {
          new_width = total_width - left;
        }else {
          new_width = old_right_left + old_right_width - left;
        }
        right_content.css({
          left: left + 3 + "px",
          width: new_width - 3 + "px" ,
          position: "absolute"
        });
      }


      //console.log(total_width,left,e.data.splitter.id());
    },

    makeRoom: function() {
      this.first= false;

      var contents = 0;
      for(var i in this._children) {
        var c = this._children[i];
        if(c.type == "content") {
          contents++;
        }
      }

      var total_width = this._e.width();

      for(var i in this._children) {
        var s = this._children[i];
        if(s.type == "splitter") {
          s.data.setLeft(s.data.getLeft() * (1-(1/(contents+1))) );
          s.data.triggerMove();
        }
      }

    },


    addContent: function(content) {


      var splitter = null;

      if(this._children.length && this._children[this._children.length-1].type != "splitter") {
        var splitter = this._createSplitter();
        splitter.bind("move", {self:this,splitter:splitter}, this._handleSplitterMove);

        this._e.append(splitter.$());
        this._children.push({
          type:"splitter",
          data:splitter
        });
      }

      this.makeRoom();
      this._children.push({
        type:"content",
        data:content
      });
      content.css({
        float:"left",
        width:"100%",
        height:"100%",
        overflow:"hidden",
        padding:"10px",
        border:"1px solid #555"
      });

      this._e.append(content);

      if(splitter)
        splitter.triggerMove();

    }
  };
})();
