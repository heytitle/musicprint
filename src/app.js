require('style!css!./css/style.css');
require('raw!../index.html');

var d3 = require('d3');

console.log('Loaded Thai Startup Scene');
console.log('d3 version ' + d3.version);

window.d3 = d3;

window.onload = function(){
    d3.select("body").append("div")
        .text("it works!");

    var screenWidth = window.innerWidth*0.8;
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

        console.log(classes(data));

        console.log(root);

        bubble(root);

        var node = svg.selectAll(".node")
            .data(root.children)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        // node.append("title")
            //     .text(function(d) { return d.data.className + ": " + format(d.value); });

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

    d3.select(self.frameElement).style("height", diameter + "px");
}

