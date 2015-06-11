var ChartView = Backbone.View.extend({
  constructor: function(options) {
    this.default_options = {
      base_height: 320,
      breakpoints: {
        // width->height multiplier
        "768": 0.9,
        "420": 0.7
      },
      margin: {
        top: 20,
        right: 30,
        bottom: 30,
        left: 50
      },
      type: ""
    };

    this.options = $.extend(true, this.default_options, options);

    var breakpoints = _.pairs(this.options.breakpoints);
    this.options.breakpoints = _.sortBy(breakpoints, function(item) {
      return Number(item[0]);
    });

    // Fallback if d3 is unavailable, add some formatters otherwise.
    if (!this.d3) {
      this.draw = this.fallback_draw;
    }
    else {
      this.formatNumber = d3.format(".lf");
      this.formatCommas = d3.format(",");
      this.formatPercent = d3.format("%");
    }
    Backbone.View.apply(this, arguments);
  },
  initialize: function(options) {
    // Wrap chart
    this.$el.wrap($('<div class="chart-wrapper">'));
    this.$chart_container = this.$el.parent();
    this.chart_container = this.$chart_container.get(0);
    this.get_dimensions();

    if (this.collection)
      this.collection.on("sync", _.bind(this.render, this));
    else if (this.options.data)
      this.data = this.options.data;

    // $(window).on("resize", _.debounce(_.bind(this.render, this), 100));
  },
  get_dimensions: function() {
    var window_width = $(window).width();

    var wrapperWidth = this.$chart_container.width();
    var width = wrapperWidth - this.options.margin.left - this.options.margin.right;
    var height = this.options.base_height - this.options.margin.bottom - this.options.margin.top;

    _.every(this.options.breakpoints, _.bind(function(breakpoint) {
      var width = breakpoint[0];
      if (window_width <= width) {
        var multiplier = breakpoint[1];
        height = (height - this.options.margin.bottom - this.options.margin.top) * multiplier;
        return false;
      }
      return true;
    }, this));

    wrapperHeight = height + this.options.margin.top + this.options.margin.bottom;

    //console.log('VIEW OPTIONS', this.options);
    this.$el
      .height(wrapperHeight)
      ;

    this.dimensions = {
      width: width,
      height: height,
      wrapperWidth: wrapperWidth,
      wrapperHeight: wrapperHeight
    };
  },
  // The render function wraps drawing with responsivosity
  render: function() {
    if (this.collection)
      this.data = this.collection.toJSON();
    this.$el.empty();
    this.get_dimensions();
    this.draw();
  },
  draw: function() {
    console.log("override ChartView's draw function with your d3 code");
    return this;
  },
  fallback_draw: function() {
    this.$el.html(
      '<div class="alert"><p><strong>Warning!</strong> You are using an unsupported browser. ' +
      'Please upgrade to Chrome, Firefox, or Internet Explorer version 9 or higher to view ' +
      'charts on this site.</p></div>');
    return this;
  },
  d3: function() {
    return (typeof d3 !== 'undefined');
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////

$(function() {
  var BarChartView = ChartView.extend({
    draw: function() {

      var BarChart = function(config) {

        this.width = config.width || 400;
        this.height = config.height || 700;
        this.offset = config.offset || 19;
        this.colors = config.colors || ['#000000'];
        this.selector = config.selector;
        this.metricLabel = config.metricLabel;

        this.canvas = d3.select(this.selector)
          .append('svg')
          .attr({
            width: this.width,
            height: this.height
          });

        return this;
      };

      BarChart.prototype.render = function(data) {

        if (data.metrics.length === 0) {
          this.canvas.selectAll('g').remove();
          $('.barchart').text('No Results - Please Try Another Query');
        }

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
          .tickFormat(function(d, i) { return data.categories[i]; });

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
          .style({'fill':'#fff', 'font-size':'14px'})
          .call(this.yAxis);

        //ANIMATION
        d3.select(this.selector).selectAll('rect')
          .transition()
          .duration(1000)
          .attr({width: function(d) { return _this.xscale(d); }});

        var labels = d3.selectAll('.bars')
          .selectAll('text')
          .data(data.metrics)
          .enter();


        labels.append('text')
          .attr('text-anchor', 'end')
          .attr('x', 0)
          .transition()
          .duration(1000)
          .attr({x:function(d) {return _this.xscale(d) - 10; }, y:function(d, i) { return _this.yscale(i) + 32; }})
          .text(function(d) { return d; }).style({'fill':'#fff', 'font-size':'30px'});

        labels.append('text')
          .attr('text-anchor', 'end')
          .attr('x', 0)
          .transition()
          .duration(1000)
          .attr({x:function(d) {return _this.xscale(d) - 10; }, y:function(d, i) { return _this.yscale(i) + 49; }})
          .text(this.metricLabel)
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
        width: colWidth,
        metricLabel: 'Jobs'
      };

      var companyConfig = {
        selector: '.wrapper2',
        colors: ['#9686E9'],
        width: colWidth,
        metricLabel: 'Companies'
      };

      var salaryConfig = {
        selector: '.wrapper3',
        colors: ['#E65E5E'],
        width: colWidth,
        metricLabel: 'Dollars (Thousands)'
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
 
    }
  });

  var chart_one = new BarChartView({
    el: '.wrapper1',
    base_height: 220
  }).render();

  // var chart_one = new BarChartView({
  //   el: '.wrapper2',
  //   base_height: 220
  // }).render();

  // var chart_one = new BarChartView({
  //   el: '.wrapper3',
  //   base_height: 220
  // }).render();
    
});




/////////////////////////////////////////////////////////////////////////////////////////////////////////////