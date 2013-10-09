window.bping = function() {
  $(document).trigger("bping");
};

$(document).ready(function() {
    $(document).bind('mousedown selectstart', function(e) {
        return $(e.target).is('input, textarea, select, option');
    });
//var BULO = window.BULO || {};    
 
var mgr = new BULO.WindowManager();

var panelsToCreate = 5;
for(var i=0;i<panelsToCreate;i++) {
  var r = randomBetween(100,155)
  var g = randomBetween(100,155)
  var b = randomBetween(100,155)
  mgr.addWindow({
    left:300 * (Math.random()*5),
    top:100 * (Math.random()*8),
    width:400,
    height:300,
    title:"Window " + (i+1),
    content: $("<div id='_c' style='width:100%;height:100%;color:black;background-color:rgba("+r+","+g+","+b+",1)'>Default Content</div>")
    
  });

}

function randomBetween(from,to)
{
      return Math.floor(Math.random()*(to-from+1)+from);
}

/*
// Create the grid
createDT("test_div1",function(grid) {
  $(document).bind("dmove", null, function(e) {
    grid.resize();
  });
});
*/
//var pane1 = new BULO.DockContainer({parent:$(".viewport"),width:"600px",height:"500px"});
//pane1.addContent();



//
/*
var pane2 = new BULO.DockContainer({parent:$(".viewport"),width:"1200px",height:"800px"});
pane2.addContent($("<div id='test_div1' class=''></div>"));


  // Create the grid
  createDT("test_div1",function(grid) {
    pane2.on("dc_resize", function(e) {
      grid.resize();
    });
  });
*/
    
});




    

var small_film_set = [
  { id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rating:9.2, rank:1, category:"Thriller"},
  { id:2, title:"The Godfather", year:1972, votes:511495, rating:9.2, rank:2, category:"Crime"},
  { id:3, title:"The Godfather: Part II", year:1974, votes:319352, rating:9.0, rank:3, category:"Crime"},
  { id:4, title:"The Good, the Bad and the Ugly", year:1966, votes:213030, rating:8.9, rank:4, category:"Western"},
  { id:5, title:"Pulp fiction", year:1994, votes:533848, rating:8.9, rank:5, category:"Crime"},
  { id:6, title:"12 Angry Men", year:1957, votes:164558, rating:8.9, rank:6, category:"Western"},
  { id:7, title:"The Shawshank Redemption", year:1994, votes:678790, rating:9.2, rank:1, category:"Thriller"},
  { id:8, title:"The Godfather", year:1972, votes:511495, rating:9.2, rank:2, category:"Crime"},
  { id:9, title:"The Godfather: Part II", year:1974, votes:319352, rating:9.0, rank:3, category:"Crime"},
  { id:10, title:"The Good, the Bad and the Ugly", year:1966, votes:213030, rating:8.9, rank:4, category:"Western"},
  { id:11, title:"Pulp fiction", year:1994, votes:533848, rating:8.9, rank:5, category:"Crime"},
  { id:12, title:"12 Angry Men", year:1957, votes:164558, rating:8.9, rank:6, category:"Western"},
  { id:13, title:"The Shawshank Redemption", year:1994, votes:678790, rating:9.2, rank:1, category:"Thriller"},
  { id:14, title:"The Godfather", year:1972, votes:511495, rating:9.2, rank:2, category:"Crime"},
  { id:15, title:"The Godfather: Part II", year:1974, votes:319352, rating:9.0, rank:3, category:"Crime"},
  { id:16, title:"The Good, the Bad and the Ugly", year:1966, votes:213030, rating:8.9, rank:4, category:"Western"},
  { id:17, title:"Pulp fiction", year:1994, votes:533848, rating:8.9, rank:5, category:"Crime"},
  { id:18, title:"12 Angry Men", year:1957, votes:164558, rating:8.9, rank:6, category:"Western"}
];

function createDT(id,cb) {
  webix.ready(function(){
    cb( new webix.ui({
      container:id,
      view:"datatable",
      drag:true,
      navigation:true,
      dragColumn:true,
      resizeColumn:true,
      columns:[
        { id:"rank",  header:"", css:"rank", width:50, sort:"int"},
        { id:"title", header:"Film title", fillspace:true, width:200,  sort:"string"},
        { id:"year",  header:"Released" , width:80, sort:"int"},
        { id:"votes", header:"Votes",   width:100,  sort:"int"}
      ],
      select: "row",
      data:small_film_set
    }));
  });     
}
