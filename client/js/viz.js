'use strict';

var categories= [156,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160];

var dollars = [156,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160];

var colors = ['#9686E9','#86E9E4','#E98686'];

var xscale = d3.scale.linear()
  .domain([10,250])
  .range([0,500]);

var yscale = d3.scale.linear()
  .domain([0,categories.length])
  .range([0,30*categories.length]);

var colorScale = d3.scale.quantize()
  .domain([0,categories.length])
  .range(colors);

var canvas = d3.select('#wrapper')
  .append('svg')
  .attr({'width':900,'height':37*categories.length});


var xAxis = d3.svg.axis();
xAxis
  .orient('bottom')
  .tickPadding(19/2);

var yAxis = d3.svg.axis();
yAxis
  .orient('left')
  .scale(yscale)
  .tickSize(0)
  .tickFormat(function(d,i){ return categories[i]; })
  .tickValues(d3.range(categories.length))

var y_xis = canvas.append('g')
          .attr("transform", "translate(150,30)")
          .attr('id','yaxis')
          .call(yAxis)

var chart = canvas.append('g')
          .attr("transform", "translate(150,0)")
          .attr('id','bars')
          .selectAll('rect')
          .data(dollars)
          .enter()
          .append('rect')
          .attr('height',19)
          .attr({'x':0,'y':function(d,i){ return yscale(i)+19; }})
          .style('fill',function(d,i){ return colorScale(i); })
          .attr('width',function(d){ return 0; });


var transit = d3.select("svg").selectAll("rect")
            .data(dollars)
            .transition()
            .duration(1000) 
            .attr("width", function(d) {return xscale(d); });

var transitext = d3.select('#bars')
          .selectAll('text')
          .data(dollars)
          .enter()
          .append('text')
          .attr({'x':function(d) {return xscale(d)-200; },'y':function(d,i){ return yscale(i)+35; }})
          .text(function(d){ return d+"$"; }).style({'fill':'#fff','font-size':'14px'});

