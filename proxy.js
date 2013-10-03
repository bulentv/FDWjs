(function($,bulo,undefined) {

  bulo.dockBtnType = {
    CENTER:0,
    LEFT:1,
    TOP:2,
    RIGHT:3,
    BOTTOM:4,
    SLEFT:5,
    STOP:6,
    SRIGHT:7,
    SBOTTOM:8
  };

  var BTN_WIDTH = 32;
  var BTN_HEIGHT = 32;

  function CreateDockBtn(options){
    var btn = $("<div class='dock-btn'></div>");

    var left, top, ref_pos, proxy_w, proxy_h, from_proxy = false;

    if(options.ref) {
       ref_w = options.ref.outerWidth();
       ref_h = options.ref.outerHeight();
    }

    if(options.ref)
      ref_pos = options.ref.position();
    

    var proxy_left=0, proxy_width=ref_w;
    var proxy_top=0, proxy_height=ref_h;

    switch(options.btnType) {
      
      case bulo.dockBtnType.CENTER:
        left = ref_pos.left + (ref_w/ 2) - (BTN_WIDTH/2);
        top = ref_pos.top + (ref_h / 2) - (BTN_HEIGHT/2);
        break;
      
      case bulo.dockBtnType.LEFT:
        left = ref_pos.left + (ref_w/ 2) - ((BTN_WIDTH/2) + BTN_WIDTH + 3);
        top = ref_pos.top + (ref_h / 2) - (BTN_HEIGHT/2);
        proxy_left = 0; proxy_width = ref_w/2;
        break;

      case bulo.dockBtnType.RIGHT:
        left = ref_pos.left + (ref_w/ 2) + (BTN_WIDTH/2) + 3;
        top = ref_pos.top + (ref_h / 2) - (BTN_HEIGHT/2);
        proxy_left = ref_w/2; proxy_width = ref_w/2;
        break;

      case bulo.dockBtnType.TOP:
        left = ref_pos.left + (ref_w/ 2) - (BTN_WIDTH/2);
        top = ref_pos.top + (ref_h / 2) - ( BTN_HEIGHT + (BTN_HEIGHT/2) + 3);
        proxy_top = 0, proxy_height = ref_h/2;
        break;

      case bulo.dockBtnType.BOTTOM:
        left = ref_pos.left + (ref_w/ 2) - (BTN_WIDTH/2);
        top = ref_pos.top + (ref_h / 2) + (BTN_HEIGHT/2) + 3;
        proxy_top = ref_h/2; proxy_height = ref_h/2;
        break;

      case bulo.dockBtnType.SLEFT:
        left = 100 - (BTN_WIDTH/2);
        top = $(".viewport").outerHeight()/2 - (BTN_HEIGHT/2);
        break;

      case bulo.dockBtnType.SRIGHT:
        left = $(".viewport").outerWidth() - 100 - (BTN_WIDTH/2);
        top = $(".viewport").outerHeight()/2 - (BTN_HEIGHT/2);
        break;

      case bulo.dockBtnType.STOP:
        left = $(".viewport").outerWidth()/2 - (BTN_WIDTH/2);
        top = 100 - (BTN_HEIGHT/2);
        break;

      case bulo.dockBtnType.SBOTTOM:
        left = $(".viewport").outerWidth()/2 - (BTN_WIDTH/2);
        top = $(".viewport").outerHeight() - 100 - (BTN_HEIGHT/2);
        break;

      default:
        console.log("Unknown dockBtnType : " + options.btnType);
        return;

    }

    btn.css({
      left:left+"px",
      top:top+"px"
    });

    $(".viewport").append(btn);

    btn.on("mouseenter",function(e){
      $(this).addClass("dock-btn-active")
      options.proxy.css({
        left:proxy_left+"px",
        width:proxy_width+"px",
        top:proxy_top+"px",
        height:proxy_height+"px"
      });
      options.proxy.fadeIn(200);
    });

    btn.on("mouseleave",function(e){
      $(this).removeClass("dock-btn-active")
    });

    btn.on("mouseup",function(e){
      options.proxy.hide();
    });

    return btn;
    
  }

  
  function Proxy(options){
    var self = this;

    this._visible = false;
    this._parent = options.parent;
    this._moving = options.moving;

    this._to = null;

    this._buttons = [];

    var element = $("<div />");
    element.css({
      left:"0px",
      top:"0px",
      width:this._parent.$().outerWidth()+"px",
      height:this._parent.$().outerHeight()+"px",
      position:"absolute",
      "background-color":"rgba(255,255,255,0.3)",
      "z-index":"10",
      "display":"none"
    });
    element.attr("id","proxy");

    this._element = element;

  }

  Proxy.prototype.test = function(){
    console.log("Proxy test");
  };

  Proxy.prototype.show = function(){
    var self = this;
    if(!this._visible){ 
      this._parent.$().append(this._element);
      console.log("Proxy show");
      
      this._visible = true;

      self._to = setTimeout( function () {
        self._parent.bringToFront();    
        self._moving.bringToFront();    
      },1000);

      var btnsToCreate = [
        bulo.dockBtnType.LEFT,
        bulo.dockBtnType.RIGHT,
        bulo.dockBtnType.TOP,
        bulo.dockBtnType.BOTTOM,
        bulo.dockBtnType.CENTER
      ];
      for(var i in btnsToCreate) {
        var options = {
          btnType: btnsToCreate[i],
          ref: this._parent.$(),
          proxy: this._element
        };
        this._buttons.push({
          btn:CreateDockBtn(options)
        });
      }
    }
  };
  Proxy.prototype.remove = function(){
    
    if(this._to) clearTimeout(this._to);

    if(this._visible) {
      console.log("Proxy remove");

      for(var i in this._buttons) {
        this._buttons[i].btn.remove();
        this._buttons[i] = null;
      }
      
      this._element.remove();
      this._element = null;
      this._visible = false;
    }
  };
  bulo.Proxy = Proxy;

})(jQuery,bulo);
