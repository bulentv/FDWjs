(function () {

  window["BULO"] = window["BULO"] || {};
  window["BULO"]["Splitter"] = function (options) {
    this._init(options);
  };
  
  window["BULO"]["Splitter"].prototype = {
    
    _init: function(options) {
      
      // storage for edge value connection rules 
      this._connections = [];
      
      // root container
      this._base = options.base;
      
      //this._handle_base = $("<div id='handles' class='handle_base' />");
      this._base.append(this._handle_base);
      
      // storage for the lastly came window
      this._lastWnd = null;
      this._lastPlace = null;
      
      // container position
      this._left = 0;
      this._top = 0;
    },
    
    _connect: function(handle,srcVal,dstObj,dstVal) {
      
      // make one edge position of an element depended to another element's edge
      for(var i in this._connections) {
        var connection = this._connections[i];
        
        if(connection.dst == dstObj && connection.dstVal == dstVal) {
          this._connections.splice(i,1);
          i--;
          continue;
        }
      }
      
      // add the rule to the rules table
      this._connections.push({
        uid:window.genUID(),
        handle:handle,
        srcVal:srcVal,
        dst:dstObj,
        dstVal:dstVal
      });
      
    },
    
    _connect2: function(handle, paneBefore, paneAfter, orientation) {
      
      // shortcut to connect a handle's position to one of the windows
      if(orientation == "h") {
        
        this._connect(handle,"left",paneBefore,"right"); 
        this._connect(handle,"right",paneAfter,"left"); 
        
      }else {
        
        this._connect(handle,"top",paneBefore,"bottom"); 
        this._connect(handle,"bottom",paneAfter,"top"); 
        
      }
      
    },
    
    _deleteConnection: function(connection){
      for(var i in this._connections) {
        if(this._connections[i] == connection) {
          this._connections.splice(i,1);
          return;
        }
      }
      
    },
    
    _getConnectionsBySrc: function (src){
      
      var ret = [];
      
      for(var i in this._connections) {
        var c = this._connections[i];
        if(c.src == src) {
          ret.push(c);    
        }
      }
      
      return ret;
      
    },
    
    _getConnectionsByDst: function(dst){
      
      var ret = [];
      
      for(var i in this._connections) {
        var c = this._connections[i];
        if(c.dst == dst) {
          ret.push(c);    
        }
      }
      
      return ret;
    },
    
    _afterHandleMove: function(e) {
      var handle = e.data;
      
      // collect the position from the current handle
      var myLeft = handle.getLeft();
      var myRight = myLeft + handle.$().outerWidth();
      var myTop = handle.getTop();
      var myBottom = myTop + handle.$().outerHeight();
      
      // check for the previous handle
      var prevs = handle.$().prevAll(".splitter-handle");
      
      if(handle.orientation == "v") {
        
        //if there is at least one handle in same orientation (v)..
        if(prevs.length>0) {
          
          // adjust that other handle limits to our current position
          var otherHandle = $.data(prevs[0],"handle");
          otherHandle.setBottomLimit(myTop-20);
          
        }
      }
      if(handle.orientation == "h") {
        
        //if there is at least one handle in same orientation (h)..
        if(prevs.length>0) {
          
          // adjust that other handle limits to our current position
          var otherHandle = $.data(prevs[0],"handle");
          otherHandle.setRightLimit(myLeft-20);
          
        }
      }
      
      // check for the next handle
      var nexts = handle.$().nextAll(".splitter-handle");
      if(handle.orientation == "v") {
        
        //if there is at least one handle in same orientation (v)..
        if(nexts.length>0) {
          
          // adjust that other handle limits to our current position
          var otherHandle = $.data(nexts[0],"handle");
          otherHandle.setTopLimit(myBottom+20);
          
        }
      }
      if(handle.orientation == "h") {
        
        //if there is at least one handle in same orientation (h)..
        if(nexts.length>0) {
          
          // adjust that other handle limits to our current position
          var otherHandle = $.data(nexts[0],"handle");
          otherHandle.setLeftLimit(myRight+20);
          
        }
      }
    },
    
    removeWindow: function(id){
      
      var element = null;
      
      this._base.find(".w").each(function(index,el){
        if($(el).attr("uid") == id) {
          element = el;
        }
      });
      
      if(element) {
        var objConns = this._getConnectionsByDst(element);
        
        var handleConns_0 = this._getConnectionsBySrc(objConns[0].src);
        var handleConns_1 = this._getConnectionsBySrc(objConns[1].src);
        
        handleConns_0[0].src = handleConns_1[1].src;
        
        var handle = handleConns_1[1].handle;
        
        handleConns_0[0].handle = handle;
        
        handle.setBottomLimit(-1);
        handle.setTopLimit(-1);
        handle.setLeftLimit(-1);
        handle.setRightLimit(-1);
        
        
        objConns[0].src.remove();
        objConns[0].dst.remove();
        
        this._deleteConnection(objConns[0]);
        this._deleteConnection(objConns[1]);
        
        
        // trigger the after move event to re-set the limits of the neigbour handles
        this._afterHandleMove({data:handle});
        
        // trigger other handle after move events to re-arrange all existing handles
        var self = this;
        handle.$().siblings(".splitter-handle").each(function (index,handle) {
          self._afterHandleMove({data:$.data(handle,"handle")});
        });
        
        // trigger the move event for the first time to initialize starting positions
        handle.triggerMove();
        
        
        
        
        
        
        
        
        
        
      
        console.log(objConns,handleConns_0,handleConns_1);
      }
      
    },
    
    addWindow: function(wnd, place) {
      
      // create a splitter handle if there is at least one existing window
      if(this._lastWnd) {
        
        var cursor, width, height, orientation,
            initFunc, initVal;
        
        if(place == "n" || place == "s") {
          
          // set initial properties according to the orientation (v)
          cursor = place + "-resize";
          height = "6px";
          width = "100%";
          orientation = "v";
          initFunc = "setTop";
          this._top += 100;
          initVal = this._top;
          
        }else if (place == "w" || place == "e") {
          
          // set initial properties according to the orientation (v)
          cursor = place + "-resize";
          width = "6px";
          height = "100%";
          orientation = "h";
          initFunc = "setLeft";
          this._left += 100;
          initVal = this._left;
          
        }
        
        // get the existing last window
        var neighbour = this._lastWnd;
        
        // if the last added window was added to a different direction
        if(this._lastPlace && (this._lastPlace != place)){
          
          // create a new base and move existing content to one side
          var new_base =  $("<div class='trans_base' />");
          new_base.append(this._base.children());
          this._base.append(new_base);
          neighbour = new_base;
          this._handle_base  = $("<div id='handles' class='handle_base' />");
          this._base.append(this._handle_base);
        }
        
        // now the current place is the new last place
        this._lastPlace = place;
        
        // add window to the container
        wnd.addClass("subwnd");
        this._base.append(wnd);
        
        // create the handle
        var handle = new BULO.Movable({
          base: this._base,
          left:"0px",
          top:"0px",
          height:height,
          width:width,
          cursor: cursor,
          class: "splitter-handle"
        });
        
        // store our point in the html element to be able to recall it later
        $.data(handle.$().get()[0],"handle",handle);
        
        // lock the other axis of the handle
        if(orientation == "h") {
          handle.setLockY(true);  
        }else{
          handle.setLockX(true);
        }
        
        // store the orientation info in the handle
        handle.orientation = orientation;
        
        // bind after move event listener to update limits when a movement occurs
        handle.bind("aftermove", handle, this._afterHandleMove);
        
        // connect window edge to the handle
        this._connect2(handle,neighbour.get()[0],wnd.get()[0],orientation);
        
        // set initial position
        handle[initFunc](initVal);
        
        // trigger the after move event to re-set the limits of the neigbour handles
        this._afterHandleMove({data:handle});
        
        // trigger other handle after move events to re-arrange all existing handles
        var self = this;
        handle.$().siblings(".splitter-handle").each(function (index,handle) {
          self._afterHandleMove({data:$.data(handle,"handle")});
        });
        
        // bind the listener for move event
        var bindData = {
          self: this,
          handle: handle
        };
        
        handle.bind("move",bindData,this._tier);
        
        // trigger the move event for the first time to initialize starting positions
        handle.triggerMove();
        
      }else{
        
        // this is the first window in this container
        // so don't create a handle, just add it to the base
        wnd.addClass("subwnd");
        this._base.append(wnd);
      }
      
      this._lastWnd = wnd;
      
      wnd.attr("uid",window.genUID());
      
    },
    
    _tier: function(e){
      
      // event listener for movements of the handles
      // re-positions the windows according to the rule table
      var self = e.data.self;
      var handle = e.data.handle;
      
      // walk thru the rules
      for(var i in self._connections) {
        
        // get one rule
        var c = self._connections[i];
        
        // check if it ties the handle which has generated the event
        if(c.handle === handle) {
          
          // get the reference object from the rule
          c.src = handle.$().get()[0];
          
          // start position calculation
          var val;
          
          switch(c.srcVal) {
              
              // if current rule says, a "right" value
              // will be the reference
            case "right":
              
              // calculate the reference right value
              val = 
                (parseInt(c.src.style.left,10) || 0) + 
                (parseInt(c.src.offsetWidth,10) || 0);
              break;
              
              // or a bottom val            
            case "bottom":
              
              // calculate the reference bottom value
              val = 
                (parseInt(c.src.style.top,10) || 0) + 
                (parseInt(c.src.offsetHeight,10) || 0);
              break;
              
            default:
              
              // otherwise get the value as it is
              val = parseInt(c.src.style[c.srcVal],10) || 0;
              break;
          }
          
          switch(c.dstVal) {
            case "right":
              
              // if we are going to set a "right" value
              var width = val - parseInt(c.dst.offsetLeft,10) || 0;
              
              // just set the width of the target
              c.dst.style.width = width + "px";
              break;
              
            case "left":
              
              // if the a "left" value will be set
              var nextSame = $(c.dst).nextAll(".w");
              
              // **** workaround css fix
              // if this is the last window of the current base
              if(nextSame.length==0) {
                
                // set it's width as auto and set a "right" css value
                // this will tie it's end to the container's end
                c.dst.style.width="auto";
                c.dst.style.right="0px";
                
              }else{
                
                // calculate the width because the right edge
                // should stay in the same pos while we are moving the left
                c.dst.style.width = 
                  (parseInt(c.dst.offsetWidth,10) || 0) - 
                  (val - (parseInt(c.dst.offsetLeft,10) || 0)) + "px";
              }
              
              // set the left value
              // this line should come after setting the width
              // because width calculation uses the current left value
              // of the element
              c.dst.style.left = val + "px";
              break;
              
            case "bottom":
              
              // if we are going to set a "bottom" value
              var height = val - parseInt(c.dst.offsetTop,10) || 0;
              
              // just set the bottom of the target
              c.dst.style.height = height + "px";
              break;
              
            case "top":
              
              // if the a "top" value will be set
              var nextSame = $(c.dst).nextAll(".w");
              
              // **** workaround css fix
              // if this is the last window of the current base            
              if(nextSame.length==0) {
                
                // set it's height as auto and set a "bottom" css value
                // this will tie it's end to the container's end              
                c.dst.style.height="auto";
                c.dst.style.bottom="0px";
                
              }else {
                
                // calculate the height because the bottom edge
                // should stay in the same pos while we are moving the top              
                c.dst.style.height = 
                  (parseInt(c.dst.offsetHeight,10) || 0) - 
                  (val - (parseInt(c.dst.offsetTop,10) || 0)) + "px";
              }
              
              // set the top value
              // this line should come after setting the height
              // because height calculation uses the current top value
              // of the element            
              c.dst.style.top = val + "px";
              break;
          }
          
        }
      }    
    }
  }
})();

