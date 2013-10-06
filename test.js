$(document).ready(function() {
    $(document).bind('mousedown selectstart', function(e) {
        return $(e.target).is('input, textarea, select, option');
    });
    
 
//var mgr = new bulo.WindowMgr();

//new BULO.DockContainer({parent:$(".viewport")});
//new BULO.DockContainer({parent:$(".viewport")});
//

var m = new BULO.Movable({
  base: $("#test"),
  class: "testobj",
  width:"10px",
  height:"100%",
  left:"0",
  top:"0",
  cursor:"e-resize"
});

m.on("omove", function(e, left, top, sender) {
  console.log("hohoooyt",left, top, sender);
});

/*
  // Add the first panel, we will then add a third party grid inside  
  var panel = window.pp = mgr.addWindow({
    title:"Panel with a grid",
    left:"50px",
    top:"125px",
    width:"800px",
    height:"500px"
  });
  var id = panel.$().attr("id");
  */



/*
  // Create the grid
  createDT("test_div1",function(grid) {
    window.grid1 = grid;
    panel.on("resize", function(e) {
      window.grid1.resize();
      window.grid2.resize();
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
