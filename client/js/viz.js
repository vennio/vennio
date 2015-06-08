var BarChart = function(config) {

  this.width = config.width || 400;
  this.height = config.height || 700;
  this.offset = config.offset || 19;
  this.colors = config.colors || ['#000000'];
  this.selector = config.selector;

  this.canvas = d3.select(this.selector)
    .append('svg')
    .attr({
      width: this.width,
      height: this.height
    });

  return this;
};

BarChart.prototype.render = function(data) {
  var _this = this;

  this.canvas.selectAll('g').remove();

  this.categories = data.categories;
  this.metrics = data.metrics;

  this.xscale = d3.scale.linear()
    .domain([data.metrics.slice(-1).pop(), data.metrics[0]])
    .range([300, this.width]);

  this.yscale = d3.scale.linear()
    .domain([0, this.categories.length])
    .range([0, 70 * this.categories.length]);

  this.colorScale = d3.scale.quantize()
    .domain([0, this.categories.length])
    .range(this.colors);

  this.yAxis = d3.svg.axis()
    .orient('right')
    .scale(this.yscale)
    .tickSize(0)
    .tickFormat(function(d, i) { return data.categories[i]; })

  var bars = this.canvas.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'bars')
    .selectAll('rect')
    .data(data.metrics)
    .enter()
      .append('rect')
      .attr('height', 65)
      .attr({
        x: 0,
        y: function(d, i) { return _this.yscale(i); }
      })
      .style('fill', function(d, i) { return _this.colorScale(i); })
      .attr('width', function(d) { return 0; });

  this.canvas.append('g')
    .style('opacity', '0')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(10,-40)')
    .style('opacity', '1')
    .attr('id', 'yaxis')
    .style({'fill':'#fff', 'font-size':'22px'})
    .call(this.yAxis);

  //ANIMATION
  d3.select(this.selector).selectAll('rect')
    .transition()
    .duration(1000)
    .attr({width: function(d) { return _this.xscale(d); }});

  d3.selectAll('.bars')
    .selectAll('text')
    .data(data.metrics)
    .enter()
      .append('text')
      .attr('text-anchor', 'end')
      .attr('x', 0)
      .transition()
      .duration(1000)
      .attr({x:function(d) {return _this.xscale(d) - 10; }, y:function(d, i) { return _this.yscale(i) + 42; }})
      .text(function(d) { return d + 'test'; }).style({'fill':'#fff', 'font-size':'40px'});
}

var generateCompareFunction = function(metric) {
  return function(a, b) {
    if (a[metric] > b[metric]) {
      return -1;
    } else if (a[metric] === b[metric]) {
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
var generateInput = function(metric, group, limit, data) {
  var input = {};

  // Sort based on metric
  var sortedData = data.sort(generateCompareFunction(metric));

  // Take a subset of data based on the limit
  var dataLimited = data.slice(0, limit);

  // categories are the yaxis labels
  input.categories = [''].concat(
    dataLimited.map(function(item) {
      return item[group];
    })

  );

  input.metrics = dataLimited.map(function(item) {
    return item[metric];
  });

  // Changed this based on UI style. Chit Chat Time: what's up Brant? How is your day?
  return input;
};

// Server configuration
var apiEndpoint = 'http://vennio.herokuapp.com/';
var colWidth = $('.barchart').width();

// D3 configuration
var numOfDatapoints = 10;

var jobConfig = {
  selector: '.wrapper1',
  colors: ['#19C999'],
  width: colWidth
};

var companyConfig = {
  selector: '.wrapper2',
  colors: ['#9686E9'],
  width: colWidth
};

var salaryConfig = {
  selector: '.wrapper3',
  colors: ['#E65E5E'],
  width: colWidth
};

var jobChart = new BarChart(jobConfig);
var salaryChart = new BarChart(salaryConfig);
var companyChart = new BarChart(companyConfig)

// Initial load overall without any filters
var createSalaryJobCharts = function(endpoint, group) {
  $.get(apiEndpoint + endpoint, function(data, status) {
    if (status === 'success') {
      var jobData = generateInput('Jobs', group, numOfDatapoints, data);
      var salaryData = generateInput('AvgSal', group, numOfDatapoints, data);
      salaryData.metrics = salaryData.metrics.map(function(m) {
        return Math.round(m / 1000);
      });

      jobChart.render(jobData);
      salaryChart.render(salaryData);
    }
  });
};

var createCompanyChart = function(endpoint, group) {
  $.get(apiEndpoint + endpoint, function(data, status) {
    if (status === 'success') {
      var companyData = generateInput('Startups', group, numOfDatapoints, data);
      companyChart.render(companyData);
    }
  });
};

var locArray = ["san_francisco", "new_york,_ny", "bangalore", "london", "los_angeles", "boston", "new_delhi", "mumbai", "palo_alto", "toronto", "washington,_dc", "chicago", "mountain_view", "berlin", "seattle", "gurgaon", "austin", "silicon_valley", "amsterdam", "singapore", "vancouver", "cambridge,_ma", "montreal", "san_mateo", "hyderabad", "paris", "san_diego", "santa_monica", "redwood_city", "atlanta", "india", "sunnyvale", "hong_kong", "united_states", "san_jose", "philadelphia", "oakland", "san_francisco_bay_area", "menlo_park", "sydney", "pune", "remote", "barcelona", "denver", "united_kingdom", "dallas", "noida", "boulder", "santa_clara,_ca", "berkeley", "earth", "brooklyn", "miami", "istanbul", "houston", "munich", "tel_aviv_yafo", "new_york", "melbourne", "beijing", "cincinnati", "florida", "detroit", "baltimore", "phoenix", "madrid", "pittsburgh", "las_vegas", "durham", "irvine", "santa_barbara", "dubai", "europe", "anywhere", "salt_lake_city", "bangkok", "portland", "pasadena,_ca", "newport_beach", "hamburg", "madras", "stockholm", "los_altos", "raleigh", "orange_county"];
var roleArray = [
  'office_manager',
  'frontend_developer',
  'devops',
  'sales',
  'operations',
  'finance',
  'designer',
  'hardware_engineer',
  'product_manager',
  'data_scientist',
  'mobile_developer',
  'full_stack_developer',
  'attorney',
  'human_resources',
  'marketing',
  'developer',
  'backend_developer'
];

var locations = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  local: locArray
});

var roles = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  local: roleArray
});

$(function() {

  $('.location-input.typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'roles',
    source: locations
  });

  $('.role-input.typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'roles',
    source: roles
  });

  var filterSubmit = function(e) {
    e.preventDefault();
    var map = {};
    $('.twitter-typeahead input.tt-input').each(function() {
      map[$(this).attr('name')] = $(this).val();
    });

    createSalaryJobCharts('FilterJobSalaryBySkill/' + map.location + '|' + map.role, 'Skill');
    createCompanyChart('FilterCompanyBySkill/' + map.location + '|' + map.role, 'Skills');
  }

  $('.filter-button').on('click', filterSubmit);

  createSalaryJobCharts('SalaryJobBySkill', 'Skill');
  createCompanyChart('CompanyBySkill', 'Skills');

});
