(function () {

  var BULO = window.BULO = window.BULO || {};

  BULO.Splitter = function(options) {
    this._init(options);
  };

  BULO.Splitter.prototype = {
    _init: function(options) {
      this._e = $("<div class='splitter-root'></div>");
      $(".viewport").append(this._e);

      this._children = [];
    },

    get: function() {
      return this._e;
    },


    _createSplitter: function() {
      
      return new BULO.Movable({
        base: this._e,
        width:"6px",
        height:"100%",
        left:"0px",
        top:"0px",
        class:"testobj",
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


      console.log(total_width,left,e.data.splitter.id());
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

    oldParentSize: 0,

    onParentResize: function() {
      var newParentSize = this._e.width();
      if(this.oldParentSize <= 0) {
        this.oldParentSize=newParentSize;
        return;
      }
      var multiplier = newParentSize / this.oldParentSize;
      this.oldParentSize = newParentSize;
      
      for(var i in this._children) {
        var s = this._children[i];
        if(s.type == "splitter") {
          s.data.setLeft(s.data.getLeft() * multiplier);
          s.data.triggerMove();
        }
      }
    },

    tile: function() {
      var parentSize = this._e.width();
      
      var contents = 0;
      for(var i in this._children) {
        var c = this._children[i];
        if(c.type == "content") {
          contents++;
        }
      }

      var each = parentSize / contents;
     var num = 1; 
      for(var i in this._children) {
        var s = this._children[i];
        if(s.type == "splitter") {
          s.data.setLeft(each*num);
          num++;
          s.data.triggerMove();
        }
      }

    },

    addContent: function(content) {
      
      var splitter = null;
      
      if(this._children.length && this._children[this._children.length-1].type != "splitter") {
        var splitter = this._createSplitter();
        splitter.bind("omove", {self:this,splitter:splitter}, this._handleSplitterMove);

        this._e.append(splitter.get());
        this._children.push({
          type:"splitter",
          data:splitter
        });
      }

      content.css({
        float:"left",
        width:"100px",
        overflow:"hidden",
        padding:"10px",
        border:"1px solid #555"
      });

      this._e.append(content);

      this._children.push({
        type:"content",
        data:content
      });
      setTimeout( function () {
      if(splitter)
        splitter.triggerMove();
      },1);
      
      var self = this;
      setTimeout( function (){
        self.tile();
      },100);
    }
  };
})();
