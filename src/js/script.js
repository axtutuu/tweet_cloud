import $ from 'jquery';

var d3 = require("d3"),
    cloud = require("d3.layout.cloud");

var fill = d3.scale.category20();

var width = 400;
var height = 300;

var layout = cloud()
    .size([1500, 1500])
    .padding(1)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw);


function draw(words) {
  d3.select("body").append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; })
      .on("click", function (d, i){
          window.open(d.url, "_blank");
      });
}


var words = [];
$.ajax({
  type:     'GET',
  url:      "/data/tweets.json",
  success: (data) => {
    console.log("success");
    data.forEach(function(data, index, array) {
      var size = (data.fb_share / 10000);
      if (size > 100) {
        size = 100;
      }
      console.log(size);
      words.push({"text": data.url, "url": data.url, "size": size});
    });
    console.log(words.length);

    // 描画処理
    layout.words(words).start();
  },
  error: (data) => {
    console.log("error");
  }
});
