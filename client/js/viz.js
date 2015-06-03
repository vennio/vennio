 var updateData = function(input){
    var categories = input.categories;
    var dollars = input.salaries;
    var colors = input.colors;

    var width = 900;
    var height = 750;
    var offset = 19;

    var grid = d3.range(25).map(function(i){
      return {'x1':0,'y1':0,'x2':0,'y2':480};
    });

    var tickVals = grid.map(function(d,i){
      if(i>0){ return i*10; }
      else if(i===0){ return "100";}
    });

    // 
    var xscale = d3.scale.linear()
            .domain([70,130])
            .range([0,722]);


    var yscale = d3.scale.linear()
            .domain([0,categories.length])
            // .range([0,480]); // Original
            .range([0,70*categories.length]);

    var colorScale = d3.scale.quantize()
            .domain([0,categories.length])
            .range(colors);

    // Remove previous svg if exists
    d3.select('svg').remove();

    var canvas = d3.select('.wrapper')
            .append('svg')
            .attr({'width':width,'height':height});

    var yAxis = d3.svg.axis()
        .orient('right')
        .scale(yscale)
        .tickSize(0)
        .tickFormat(function(d,i){ return categories[i]; })

    var chart = canvas.append('g')
              .attr("transform", "translate(0,0)")
              .attr('id','bars')
              .selectAll('rect')
              .data(dollars)
              .enter()
              .append('rect')
              .attr('height',65)
              .attr({'x':0,'y':function(d,i){ return yscale(i) ; }})
              .style('fill',function(d,i){ return colorScale(i); })
              .attr('width',function(d){ return 0; });

    var y_xis = canvas.append('g')
              .attr("transform", "translate(10,-40)")
              .attr('id','yaxis')
              .call(yAxis);


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
              .attr('text-anchor', 'end')
              .attr({'x':function(d) {return xscale(d) - 10; },'y':function(d,i){ return yscale(i)+42; }})
              .text(function(d){ return "$" + d+"k"; }).style({'fill':'#fff','font-size':'30px'});
  };

  // Skills 
  var frontEndSkills = ['Backbone.js', 'Coffeescript', 'Ember.js', 'HTML', 'CSS', 'Angular.js', 'D3', 'Bootstrap'];
  var backEndSkills = ['Node.js', 'Express.js', 'MySQL', 'MongoDB', 'PostgreSQL', 'Django', 'Ruby on Rails'];
  var center = ['javascript'];
  var skills = [''].concat(frontEndSkills,backEndSkills,center);
  
  // Original dataset
  // var categories= ['','Accessories', 'Audiophile', 'Camera & Photo', 'Cell Phones', 'Computers','eBook Readers','Gadgets','GPS & Navigation','Home Audio','Office Electronics','Portable Audio','Portable Video','Security & Surveillance','Service','Television & Video','Car & Vehicle'];

  // var dollars = [213,209,190,179,156,209,190,179,213,209,190,179,156,209,190,190];

  var colors = ['#19C999'];

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
    input.salaries = generateSalaries(input.categories.length - 1);
    input.colors = colors;
    return input;
  };

  updateData(generateInput());
  $("#update").click(function(){
    updateData(generateInput());
  });



