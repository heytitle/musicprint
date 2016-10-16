require('style!css!./css/style.css');
require('raw!../index.html');

var d3 = require('d3');
var _ = require('lodash');

console.log('Loaded Thai Startup Scene');
console.log('d3 version ' + d3.version);

window.d3 = d3;

var forms = {
    size: {
        '1M': false,
        '10-20M': true
    },
    state: {
        'Prototype': false,
        'Launched': true,
    },
    sector: {
        'Fintech': true,
        'Media / Content': true,
        'Food': false
    }
};

var loadedData;

window.onload = function(){
    d3.select("body").append("div")
        .text("it works!");

    // Set up form
    var cats = d3.select('.category-list')
        .selectAll('div')
        .data(Object.keys(forms))
        .enter()
        .append('div')
        .attr('class','category')
        .html(function(d){
            var elm = d3.select(this);

            elm.append('div')
                .attr('class','header')
                .text(d);

            var options = Object.keys(forms[d]);

            elm.append('ul')
                .selectAll('li')
                .data(options)
                .enter()
                .append('li')
                .attr('class', 'checkbox')
                .html(function(od){
                    var li = d3.select(this);
                    li.attr('query-key', d+'.'+od)
                        .classed('checked', forms[d][od] )
                        .append('span');
                    return li.html() + od;
                })

            return elm.html();
        })

    // cats.append('div')

    // End

    var dispatch = d3.dispatch("click-node");

    var screenWidth = window.innerWidth*0.55;
    var screenHeight = window.innerHeight*0.8;

    var diameter = screenHeight;
    format = d3.format(",d"),
        color = d3.scaleOrdinal(d3.schemeCategory10);

    var bubble = d3.pack()
        .size([ screenWidth, screenHeight ])
        .padding(5);

    var svg = d3.select("svg")
        .attr("height", diameter)
        .attr("class", "bubble");

    d3.csv('startups.csv', function(error,data) {
        if (error) throw error;

        data = _.map( data, function(d){
            d.value = parseInt(d['funded']);
            return d;
        });

        loadedData = data;

        renderCircles( filterData(data) );
    });

    function filterData( data ) {
        var selectedCheckboxes = d3.selectAll('.checked').nodes();

        var selectedKeys = _.map( selectedCheckboxes, function(n){
            return d3.select(n).attr('query-key');
        });

        console.log('selected key : ' + selectedKeys.join(', '));

        var keys = _.map( selectedKeys, function(k){ return k.split('.') } );

        var filteredData = _.filter( loadedData, function(d){
            return _.some(keys, function(k){
                return d[k[0]] == k[1]
            });
        });

        console.log('Filtered data');
        console.log(filteredData);

        return filteredData;
    }

    function renderCircles(data){
        // Remove old things
        d3.selectAll('g.node').remove();

        var root = d3.hierarchy({ children: data })
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
                return color(d.data.sector);
            });

        node.append('text')
            .text(function(d){ return d.data.sector });


        circle.transition()
            .duration(750)
            .delay(function(d, i) { return i * 5; })
            .attrTween("r", function(d) {
                var i = d3.interpolate(1, d.r);
                return function(t) {
                    return d.r = i(t);
                };
           });

        var totalValue = _.sumBy( data, 'value' );
        d3.select('#total-value').text( totalValue);
        d3.select('#no-startups').text( data.length );
    }

    d3.selectAll('.checkbox').on('click',function(){
        var elm = d3.select(this);
        var checked = elm.classed('checked');

        d3.select(this).classed('checked', !checked);

        renderCircles( filterData(loadedData) );
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
