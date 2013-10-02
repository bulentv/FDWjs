
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

function createDT(id) {
  webix.ready(function(){
    grid = new webix.ui({
      container:id,
      view:"datatable",
      drag:true,
      navigation:true,
      columns:[
        { id:"rank",  header:"", css:"rank", width:50, sort:"int"},
        { id:"title", header:"Film title", fillspace:true, width:200,  sort:"string"},
        { id:"year",  header:"Released" , width:80, sort:"int"},
        { id:"votes", header:"Votes",   width:100,  sort:"int"}
      ],
      select: "row",
      data:small_film_set
    });     
  });     
}

// TEST CODE
$(document).ready( function () {

  var mgr = new bulo.WindowMgr();

  // Add the first panel, we will then add a third party grid inside  
  var panel = mgr.addWindow({
    title:"First Panel",
    left:"1150px",
    top:"225px",
    width:"500px",
    height:"300px"
  });

  var id = panel.$().attr("id");
  $("<div style='width:100%;height:100%;' id='test_div'></div>").appendTo($("#"+id));

  // Create the grid
  createDT("test_div");

  panel.on("resize", function(e) {
    window.grid.resize();
  });

  // Add two more panels
  mgr.addWindow({title:"Second Panel",left:"100px",top:"500px",width:"400px",height:"200px"});
  mgr.addWindow({title:"Third Panel",left:"800px",top:"150px",width:"250px",height:"200px"});

});

