
(function($,bulo,undefined) {
  
  function Proxy(options){
    this._visible = false;
    this._parent = options.parent;

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
    if(!this._visible){ 
      this._parent.$().append(this._element);
      console.log("Proxy show");
      this._element.fadeIn(100);
      this._visible = true;
    }
  };
  Proxy.prototype.remove = function(){
    if(this._visible) {
      console.log("Proxy remove");
      this._element.remove();
      this._element = null;
      this._visible = false;
    }
  };
  bulo.Proxy = Proxy;

})(jQuery,bulo);
