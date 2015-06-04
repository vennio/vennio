var barChart = function(data, config) {
  
  this.width = config.width || 400;
  this.height = config.height || 700;
  this.offset = config.offset || 19;
  this.colors = config.colors || ['#000000'];
  this.selector = config.selector;

  this.categories = data.categories;
  this.metrics = data.metrics;
  console.log(config.xmax)
  this.xscale = d3.scale.linear()
    .domain([0, config.xmax])
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
  this.canvas.selectAll('g').remove();
  var bars = this.canvas.append('g')
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
      .attr({'x':function(d) {return that.xscale(d) - 10; },'y':function(d,i){ return that.yscale(i) + 42; }})
      .text(function(d){ return d; }).style({'fill':'#fff','font-size':'30px'});
}

var generateCompareFunction = function(metric){
  return function(a,b){
    if (a[metric] > b[metric]){
      return -1;
    } else if (a[metric] === b[metric]){
      return 0; 
    } else {
      return 1;
    }
  };

};


/*
metric: metric used
group: what grouping
limit: number of data points visualizing
data: returned data from server endpoint
*/
var generateInput = function(metric, group, limit, data){
  var input = {};

  // Sort based on metric
  var sortedData = data.sort(generateCompareFunction(metric));
  // Take a subset of data based on the limit
  var dataLimited = data.slice(0, limit);
  // categories are the yaxis labels
  // The leading empty string needs refactor
  input.categories = [''].concat(
    dataLimited.map(function(item){
      return item[group];
    })
  );

  input.metrics = dataLimited.map(function(item){
    return item[metric];
  });

  // Changed this based on UI style. Chit Chat Time: what's up Brant? How is your day? 
  return input;
};

var colWidth = $('.barchart').width();

var data1 = generateInput('Jobs', 'Skill', 10, SalaryJobBySkill);
var b = new barChart(data1, {
  selector: '.wrapper1',
  colors: ['#19C999'],
  width: colWidth,
  xmax: data1.metrics[0]
});

b.render();

var data2 = generateInput('Startups', 'Skills', 10, CompanyBySkill)
var b2 = new barChart(data2, {
  selector: '.wrapper2',
  colors: ['#9686E9'],
  width: colWidth,
  xmax: data2.metrics[0]
})

b2.render();

var data3 = generateInput('AvgSal', 'Skill', 10, SalaryJobBySkill);
var b3 = new barChart(data3, {
  selector: '.wrapper3',
  colors: ['#E65E5E'],
  width: colWidth,
  xmax: data3.metrics[0]
})

b3.render();

// $("#update").click(function(){
//   b.render();
//   b2.render();
//   b3.render();
// });



