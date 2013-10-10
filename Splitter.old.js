(function () {

  var BULO = window.BULO = window.BULO || {};

  BULO.SplitterOld = function(options) {
    this._init(options);
  };

  BULO.SplitterOld.prototype = {
    _init: function(options) {
      this._e = $("<div class='splitter-root'></div>");
      this._parent = options.parent;

      this._parent.$().append(this._e);
      this._direction = options.direction;

      // get notifed when parent resizes 
      this._parent.bind("resize", this, this._onParentResize);

      this._children = [];
      this._oldParentSize= 0;

      //this.addContent();

    },


    // returns main jQuery object this object build on top of
    $: function() {
      return this._e;
    },
    bind: function() {
      this._e.bind.apply(this._e, arguments);
    },

    itemCount: function() {
      var count = this._children.length;
      // calculate the number of windows (except the bars) so :
      // for 5 total it should return 3
      // for 3 total it should return 2
      // for 1 total it should return 1
      return Math.floor(count/2)+1;
    },

    getChildren: function () {
      if(this._children.length <= 0)
        return null;

      var ret = [];
      for(var i in this._children) {
        var c = this._children[i];
        if(c.type == "content") {
          ret.push(c.data);
        }
      }
      return ret;
    },

    _onParentResize: function(e) {

      var self = e.data;
      var newParentSize;
      if(self._direciton == "h") {
        newParentSize = self._e.width();
      }else {
        newParentSize = self._e.height();
      }

      if(self._oldParentSize <= 0) {
        self._oldParentSize = newParentSize;
        return;
      }

      var multiplier = newParentSize / self._oldParentSize;

      self._oldParentSize = newParentSize;

      for(var i in self._children) {
        var s = self._children[i];
        if(s.type == "splitter") {
          if(this._direction == "h") {
            s.data.setLeft(s.data.getLeft() * multiplier);
          }else {
            s.data.setTop(s.data.getTop() * multiplier);
          }
          s.data.triggerMove();
        }
      }

    },
    
    direction: function() {
      return this._direction;
    },


    _createSplitter: function() {

      var width,height;
      if(this._direction == "h") {
        width = "6px";
        height = "100%";
        cursor = "e-resize";
      }else if (this._direction == "v") {
        width = "100%";
        height = "6%";
        cursor = "n-resize";
      }

      return new BULO.Movable({
        base: this._e,
        width:width,
        height:height,
        right:"0px",
        top:"0px",
        class:"splitter-handle",
        cursor: cursor
      });

    },

    _handleSplitterMove: function (e, left, top)
    {
      var self = e.data.self;
      if(self._direction == "h") {
        return self._handleSplitterMoveHor(e,left);
      }else {
        return self._handleSplitterMoveVer(e,top);
      }
    },

    _handleSplitterMoveVer: function(e, top) {
      // increase the left value by the half of the 
      // splitter object width
      top += 3;


      var self = e.data.self,
      splitter = e.data.splitter,

      items_before = [],
      items_after = [],
      ratio,

      total_height = self._e.height(),

      sfound = false;

      var top_content, bottom_content, last_s;
      for(var i in self._children) {
        var c = self._children[i];
        if(c.type == "content") {
          if(!sfound) {
            top_content = c.data;
          }else{
            if(!bottom_content)
              bottom_content = c.data;
          }
        }else {
          if(sfound) {
            last_s = c.data;
          }else
          if(splitter && c.data.id() == splitter.id()) {
            sfound=true;
          }
        }
      }

      var old_top_top = top_content.$().position().top;
      top_content.$().css({
        height: top - old_top_top - 2 +"px",
        position: "absolute"
      });
      if(bottom_content) {
        var old_bottom_height = bottom_content.$().outerHeight();
        var old_bottom_top = bottom_content.$().position().top;

        var new_height;
        if(!last_s) {
          new_height = total_height - top;
        }else {
          new_height = old_bottom_top + old_bottom_height - top;
        }
        bottom_content.$().css({
          top: top + 3 + "px",
          height: new_height - 3 + "px" ,
          position: "absolute"
        });
      }
      self.$().trigger("smove");
      $(document).trigger("dmove");

      //console.log(total_width,left,e.data.splitter.id());
    },

    _handleSplitterMoveHor: function (e, left) {


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
          if(splitter && c.data.id() == splitter.id()) {
            sfound=true;
          }
        }
      }

      var old_left_left = left_content.$().position().left;
      left_content.$().css({
        width: left - old_left_left - 2 +"px",
        position: "absolute"
      });
      if(right_content) {
        var old_right_width = right_content.$().outerWidth();
        var old_right_left = right_content.$().position().left;

        var new_width;
        if(!last_s) {
          new_width = total_width - left;
        }else {
          new_width = old_right_left + old_right_width - left;
        }
        right_content.$().css({
          left: left + 3 + "px",
          width: new_width - 3 + "px" ,
          position: "absolute"
        });
      }
      self.$().trigger("smove");
      $(document).trigger("dmove");

      //console.log(total_width,left,e.data.splitter.id());
    },

    _fillSpace: function() {

      var last_child = {};

      var splitters = [];

      // remove repeated splitters
      for(var i=0;i<this._children.length;i++) {
        var child = this._children[i];
        if(child.type == "splitter"){
          if(i==0 || last_child.type == "splitter") {
            this._children.splice(i,1);
            child.data.$().remove();
            i--;
          }else if(i==this._children.length-1){
            this._children.pop();
            child.data.$().remove();
            break;
          }else{
            splitters.push(child.data);
          }
        }
        last_child = child;
      }

      
      if(splitters.length == 0) {
        if(this._direction == "h") {
          this.$().children().css({
            width:"100%",
            left:"0px"
          });
        }else {
          this.$().children().css({
            height:"100%",
            top:"0px"
          });
        }
        if(this._children.length == 1){
          this._children[0].data.hideTitle();
          this._parent.getTitleFromInner();
        }

      }else {
        if(this._direction) {
          this._children[0].data.$().css({left:"0px"});
        }else {
          this._children[0].data.$().css({top:"0px"});
        }
        for(var i in splitters) {
          splitters[i].triggerMove();
        }
      }
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
          if(this._direction == "h") {
            s.data.setLeft(s.data.getLeft() * (1-(1/(contents+1))) );
          }else {
            s.data.setTop(s.data.getTop() * (1-(1/(contents+1))) );
          }
          s.data.triggerMove();
        }
      }

    },

    unDockContent: function (e) {
      var self = e.data.self;
      var wnd = e.data.wnd;
      console.log("unDockContent:",e);
      for(var i in self._children) {
        var c = self._children[i];
        if(c.type == "content") {
          if(c.data.id() == wnd.id()) {
            self._children.splice(i,(i>=(self._children.length-1))?2:1);
            self._fillSpace();
            return;
          }
        }
      }


    },

    RawContent: function(content){
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
        left:"0px",
        top:"0px",
        overflow:"hidden",
        border:"1px solid #555"
      });

      this._e.append(content);

      if(splitter)
        splitter.triggerMove();

    },

    addContent: function(wnd,place) {



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

      var content,data;
      content = wnd.$();
      data = wnd;

      // check if this is another splitter or DockContainer object
      // better check required here
      if(wnd.setBase) {
        wnd.setBase(this.$());
        wnd.bind("undock", {self:this,wnd:wnd}, this.unDockContent);
      }

      this.makeRoom();

      this._children.push({
        type:"content",
        data:wnd,
      });
/*
      if(this._children.length <= 0) {
        wnd.
      }
*/      
      content.css({
        float:"left",
        width:"100%",
        height:"100%",
        left:"0px",
        top:"0px",
        overflow:"hidden",
//        padding:"10px",
        border:"1px solid #555"
      });


      this._e.append(content);

      if(splitter) {
        splitter.triggerMove();
        this.$().trigger("hide_main_title");
        for(var i in this._children) {
          var child = this._children[i];
          if(child.type == "content") {

            if(child.data.showTitle)
              child.data.showTitle();
          }
        }
        console.log("show sub title");
      }



    }
  };
})();
