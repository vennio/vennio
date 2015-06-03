var barChart = function(data, config) {
  
  this.width = config.width || 400;
  this.height = config.height || 700;
  this.offset = config.offset || 19;
  this.colors = config.colors || ['#000000'];
  this.selector = config.selector;

  this.categories = data.categories;
  this.metrics = data.metrics;

  this.xscale = d3.scale.linear()
    .domain([0, 130])
    .range([0, this.width]);

  this.yscale = d3.scale.linear()
    .domain([0, this.categories.length])
    .range([0, 70 * this.categories.length]);

  this.colorScale = d3.scale.quantize()
    .domain([0, this.categories.length])
    .range(this.colors);

  this.canvas = d3.select(this.selector)
    .append('svg')
    .attr({
      'width': this.width, 
      'height': this.height
    });

  this.yAxis = d3.svg.axis()
    .orient('right')
    .scale(this.yscale)
    .tickSize(0)
    .tickFormat(function(d, i){ return data.categories[i]; })
};

barChart.prototype.render = function() {
  var that = this;
  that.canvas.selectAll('g').remove();
  var bars = that.canvas.append('g')
    .attr("transform", "translate(0,0)")
    .attr('class','bars')
    .selectAll('rect')
    .data(this.metrics)
    .enter()
      .append('rect')
      .attr('height',65)
      .attr({
        'x': 0,
        'y': function(d, i){ return that.yscale(i); }
      })
      .style('fill', function(d, i){ return that.colorScale(i); })
      .attr('width', function(d){ return 0; });

  this.canvas.append('g')
    .attr("transform", "translate(10,-40)")
    .attr('id','yaxis')
    .call(this.yAxis);

  //ANIMATION
  d3.selectAll("svg").selectAll("rect")
    .transition()
    .duration(1000) 
    .attr("width", function(d) { return that.xscale(d); });

  d3.selectAll('.bars')
    .selectAll('text')
    .data(this.metrics)
    .enter()
      .append('text')
      .attr('text-anchor', 'end')
      .attr({'x':function(d) {return b.xscale(d) - 10; },'y':function(d,i){ return that.yscale(i) + 42; }})
      .text(function(d){ return "$" + d+"k"; }).style({'fill':'#fff','font-size':'30px'});
}

var frontEndSkills = ['Backbone.js', 'Coffeescript', 'Ember.js', 'HTML', 'CSS', 'Angular.js', 'D3', 'Bootstrap'];
var backEndSkills = ['Node.js', 'Express.js', 'MySQL', 'MongoDB', 'PostgreSQL', 'Django', 'Ruby on Rails'];
var center = ['javascript'];
var skills = [''].concat(frontEndSkills,backEndSkills,center);

var generateSalaries = function(n){
  var salaries = [];
  for (var i = 0; i < n; i++){
    var base = 90;
    var salary = Math.floor(Math.random() * 20) + base;
    salaries.push(salary);
  }
  return salaries;
};

var generateInput = function(){
  var input = {};
  var inputSize = Math.floor(skills.length * Math.random());
  input.categories = skills.slice(0,10);
  input.metrics = generateSalaries(input.categories.length - 1);
  return input;
};

var colWidth = $('.barchart').width();

var b = new barChart(generateInput(), {
  selector: '.wrapper1',
  colors: ['#19C999'],
  width: colWidth
});

b.render();

var b2 = new barChart(generateInput(), {
  selector: '.wrapper2',
  colors: ['#9686E9'],
  width: colWidth
})

b2.render();

var b3 = new barChart(generateInput(), {
  selector: '.wrapper3',
  colors: ['#E65E5E'],
  width: colWidth
})

b3.render();

$("#update").click(function(){
  b.render();
  b2.render();
  b3.render();
});



