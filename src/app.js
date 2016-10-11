require('style!css!./css/style.css');
require('raw!../index.html');

var d3 = require('d3');

console.log('Loaded Thai Startup Scene');
console.log('d3 version ' + d3.version);

window.d3 = d3;

window.onload = function(){
    d3.select("body").append("div")
        .text("it works!");

    var dispatch = d3.dispatch("click-node");

    var screenWidth = window.innerWidth*0.55;
    var screenHeight = window.innerHeight*0.8;

    var diameter = screenHeight;
    format = d3.format(",d"),
        color = d3.scaleOrdinal(d3.schemeCategory20c);

    var bubble = d3.pack()
        .size([ screenWidth, screenHeight ])
        .padding(5);

    var svg = d3.select("svg")
        .attr("height", diameter)
        .attr("class", "bubble");

    d3.json("flare.json", function(error, data) {
        if (error) throw error;

        var root = d3.hierarchy(classes(data))
            .sum(function(d) { return d.value; })
            .sort(function(a, b) { return b.value - a.value; });

        bubble(root);

        var node = svg.selectAll(".node")
            .data(root.children)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .on('click', function(d){
                dispatch.call('click-node', this, { data: d, mouse: d3.event });
            });

        var circle = node.append("circle")
            .attr("r", function(d) { return 0; })
            .style("fill", function(d) {
                return color(d.data.packageName);
            });

        circle.transition()
            .duration(750)
            .delay(function(d, i) { return i * 5; })
            .attrTween("r", function(d) {
                var i = d3.interpolate(1, d.r);
                return function(t) {
                    return d.r = i(t);
                };
           });

    });


    dispatch.on('click-node', function(data){
        console.log('node click');
        console.log(data);
        data = data.data;
        var x  = data.x - 150;
        x = 1000;
        var y  = data.y;
        console.log(x,y);
        // var y  = 0 - 10;

        // d3.select('#pop-up')
        //     .style('display', 'block')
        //     .style('transform','translate('+ x +'px,'+y+'px)');
    });

    // Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classes.push({packageName: name, className: node.name, value: node.size});
        }

        recurse(null, root);
        return {children: classes};
    }

}

