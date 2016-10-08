module.export = function(){
    d3.select("body").append("div")
        .text("it works!");

    // var data = [{ "label": "chocolate", "text": "Chocolate Cookie", "img": "chocolate.jpg" },
        // { "label": "sugar", "text": "Sugar Cookie", "img": "sugar.jpg" }];

    // var diventer = d3.select(".wrapper").selectAll("div")
        // .data(data)
        // .enter().append("div")
        // .attr("id", function(d) { return d.label; });

    // diventer.append("p")
        //   .text(function(d) { return d.text; });

        // diventer.append("img")
        //   .attr("src", function(d) { return d.img; });​
        //   var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g").attr("transform", "translate(32," + (height / 2) + ")");

    function update(data) {
        console.log(data);

      // DATA JOIN
      // Join new data with old elements, if any.
      var text = g.selectAll("text")
        .data(data);

      // UPDATE
      // Update old elements as needed.
      text.attr("class", "update");

      // ENTER
      // Create new elements as needed.
      //
      // ENTER + UPDATE
      // After merging the entered elements with the update selection,
      // apply operations to both.
      text.enter().append("text")
          .attr("class", "enter")
          .attr("x", function(d, i) { return i * 32; })
          .attr("dy", ".35em")
        .merge(text)
          .text(function(d) { return d; });

      // EXIT
      // Remove old elements as needed.
      text.exit().remove();
    }

    // The initial display.
    update(alphabet);

    // Grab a random sample of letters from the alphabet, in alphabetical order.
    d3.interval(function() {
      update(d3.shuffle(alphabet)
          .slice(0, Math.floor(Math.random() * 26))
          .sort());
    }, 1500);

}
