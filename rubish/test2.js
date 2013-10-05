$(document).ready(function() {
  var con = create_container(); 


  function addWindow(newcontent) {

    var right = con.find(".right_panel");

    if(right.length){

      right.removeClass("right_panel");
      right.css({left:300});
      right.width(300);
      
      var s_left = $("<div class='def'></div>");
      s_left.append(right.children());

      var s_right = newcontent;

      right.append(s_left);
      right.append(s_right);

      right.width(300).split({orientation:'vertical',limit:10});
    }else{

      var s = $("<div class='def'><div class='def'></div><div class='def'></div></div>");
      s.width(600).height(300).split({orientation:'vertical',limit:10});
      con.append(s);
    }
    
    rc();
    
  }

  $("#addw").click( function() {
    var newc = $("<div></div>");
    addWindow(newc);
  });

//  mal.split({orientation:'vertical'});
});

function rc() {
  $("div").each( function () {
    if($(this).css("background-color") == "rgba(0, 0, 0, 0)") {
      $(this).css({
        "background-color": get_random_color()
      });
    }
  });
}

function create_container(){
  var con = $("<div id='container' class='container' style='background-color:#ccc !important;'></div>"); 
  $("body").append(con);

 window.w = new     webix.ui({
        container:"container",
        id:"layout",
        height:600,
        width:700,
        borderless: true,
        type:"clean",
        rows:[
          {cols:[
            {
              id:"a1",
              template:"column 1",
              width:150,
            },
            {
              view:"resizer",
              id:"resizer"
            },
            { template:"column 2"

            }
          ]
          }
        ]
      });
window.w.show();



  return con;
}

function get_random_color() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}
