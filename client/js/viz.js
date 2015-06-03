// 'use strict';

// var categories= ['Angular','d3js', 'Something Long',160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160];

// var dollars = [156,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160,160, 156,160];

// var margin = {top: 20, right: 0, bottom: 20, left: 0};
// var width = 1300 - margin.left - margin.right;
// var height = 37*categories.length - margin.top - margin.bottom;


// var colors = ['#9686E9','#86E9E4','#E98686'];

// var xscale = d3.scale.linear()
//     .domain([0,250])
//     .range([0,1200]);

// var yscale = d3.scale.linear()
//     .domain([0,categories.length])
//     .range([0,30*categories.length]);

// var colorScale = d3.scale.quantize()
//     .domain([0,categories.length])
//     .range(colors);

// var yAxis = d3.svg.axis()
//     .orient('left')
//     .scale(yscale)
//     .tickSize(0)
//     .tickFormat(function(d,i){ return categories[i]; })
//     .tickValues(d3.range(categories.length));

// var svg = d3.select('#wrapper').append('svg')
//     .attr({'width', width + margin.left + margin.right})
//     .attr({'height', height + margin.top + margin.bottom})
//   .append('g')
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var gy = svg.append('g')
//     .attr("class", "y axis")
//     .attr("transform", "translate(0," + width + ")")
//     .call(yAxis);

// var chart = svg.append('g')
//           .attr("transform", "translate(20,0)")
//           .attr('id','bars')
//           .selectAll('rect')
//           .data(dollars)
//           .enter()
//           .append('rect')
//           .attr('height',28)
//           .attr({'x':0,'y':function(d,i){ return yscale(i)+30; }})
//           .style('fill',function(d,i){ return colorScale(i); })
//           .attr('width',function(d){ return 0; });


// var transit = d3.select("svg").selectAll("rect")
//             .data(dollars)
//             .transition()
//             .duration(1000) 
//             .attr("width", function(d) {return xscale(d); });

// var transitext = d3.select('#bars')
//           .selectAll('text')
//           .data(dollars)
//           .enter()
//           .append('text')
//           .attr({'x':function(d) {return xscale(d)-40; },'y':function(d,i){ return yscale(i); }})
//           .text(function(d){ return d+"$"; }).style({'fill':'#fff','font-size':'14px'});

