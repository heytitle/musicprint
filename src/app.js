require('style!css!./css/style.css');
require('style!css!./css/hoja.css');
require('raw!../index.html');

var $ = require('jquery');
var d3 = require('d3');
var _ = require('lodash');

window.d3 = d3;
window.$ = $;

var loadedData;

window.onload = function(){
    $(document).ready(function(){
        var viewpointHeight = $(window).height();
        var viewpointWidth  = $(window).width();

        $('.page').height(viewpointHeight);

        var svg = d3.select("svg");
        var width  = viewpointWidth * 0.7;
        var height = viewpointHeight * 1;

        console.log(svg.style("width"));

        var format = d3.format(",d");

        var color = d3.scaleOrdinal(d3.schemeCategory20c);

        var pack = d3.pack()
            .size([width, height])
            .padding(1.5);

        // d3.csv("flare.csv", function(d) {
        d3.csv("berlin-city.csv", function(d) {
          d.value = +d.value;
          if (d.value) return d;
        }, function(error, classes) {
          if (error) throw error;

          var root = d3.hierarchy({children: classes})
              .sum(function(d) { return d.value; })
              .each(function(d) {
                if (id = d.data.id) {
                  var id, i = id.lastIndexOf(".");
                  d.id = id;
                  d.package = id.slice(0, i);
                  d.class = id.slice(i + 1);
                }
              });

          var node = svg.selectAll(".node")
            .data(pack(root).leaves())
            .enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

          node.append("image")
              .attr("xlink:href", function(d) {
                  return "./icons/"+d.data.icon+".png";
              })
              .attr('width', function(d){ return d.r*2 } )
              .attr('height', function(d){ return d.r*2 } )
              .attr("transform", function(d) { return "translate(" + -d.r + "," + -d.r + ")"; })
              .on('click', function(d){
                  console.log(d);
                  if( d.data.category == 'artists'){
                        changePage(null, 'artists-page');
                  }
              });

          node.append("circle")
              .attr("id", function(d) { return d.id; })
              .attr("r", function(d) { return d.r; });



              // .style("fill", "red");

          node.append("clipPath")
              .attr("id", function(d) { return "clip-" + d.id; })
              .append("use")
              .attr("xlink:href", function(d) { return "#" + d.id; });

          node.append("title")
              .text(function(d) { return d.data.category + "\n" + d.data.name + "" + format(d.value); });
        });
    });

    var prevClicked;
    window.changePage = function( event, page ){

        if(event){
            $(event.target).toggleClass("focus");
        }
        $(prevClicked).toggleClass("focus");



         $('html, body').animate({
            scrollTop: $("#"+page).offset().top
         }, 500);

        if(event){
            prevClicked = event.target;
            event.preventDefault();
        }



    }
}
