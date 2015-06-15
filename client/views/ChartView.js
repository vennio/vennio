var ChartView = Backbone.View.extend({

  colors: ['#19C999','#9686E9','#E65E5E'],

  template: _.template('<div class="barchart one-third column">' +
          '<h3><%= title %></h3>' +
          '<div class="wrapper1" id="<%= nodeId %>">' +
          '</div>' +
        '</div>'),

  apiEndpoint: 'http://vennio.herokuapp.com/',
  numOfDatapoints: 10,

  initialize: function(config) {
    this.title = config.title;
    this.nodeId = config.nodeId;
    this.model = config.model;
    this.data = this.model.collection.toJSON();
    this.width = 400;
    this.height = config.jobConfig.height || 700;
    this.offset = config.jobConfig.offset || 19;
    this.colors = config.jobConfig.colors || ['#000000'];
    this.selector = config.jobConfig.selector;
    this.metricLabel = config.jobConfig.metricLabel;
    this.dataLabel = config.jobConfig.dataLabel;

    this.element = document.createElement("div")
    this.canvas = d3.select(this.element)
      .append('svg')
      .attr({
        width: this.width,
        height: this.height
      });

    return this.createSalaryJobCharts(config.jobConfig.group, this);

    // if (this.model)
    //   this.model.on("sync", _.bind(this.render, this));
  },

  generateCompareFunction: function(metric) {
    return function(a, b) {
      if (a[metric] > b[metric]) {
        return -1;
      } else if (a[metric] === b[metric]) {
        return 0;
      } else {
        return 1;
      }
    };

  },

/*
  metric: metric used
  group: what grouping
  limit: number of data points visualizing
  data: returned data from server endpoint
  */
  generateInput: function(metric, group, limit, data, context) {
    var input = {};

    // Sort based on metric
    var sortedData = data.sort(context.generateCompareFunction(metric));

    // Take a subset of data based on the limit
    var dataLimited = data.slice(0, limit);
    // categories are the yaxis labels
    input.categories = [''].concat(
      dataLimited.map(function(item) {
        return item[group];
      })
    );

    console.log('group',group)

    input.metrics = dataLimited.map(function(item) {
      return item[metric];
    });

    // Changed this based on UI style. Chit Chat Time: what's up Brant? How is your day?
    return input;
  },


  createSalaryJobCharts: function(group, context) {
    var data = context.generateInput(this.dataLabel, group, context.numOfDatapoints, this.data, context);
    if (this.dataLabel === 'AvgSal') {
      data.metrics = data.metrics.map(function(m) {
        return Math.round(m / 1000);
      });
      }
    return context.render(data);
  },

  render: function(data) {
    this.$('#wrapper1').empty();
    return this.draw(data);
  },

  draw: function(data) {
    console.log(data);
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
    d3.select(this.element).selectAll('rect')
      .transition()
      .duration(1000)
      .attr({width: function(d) {return _this.xscale(d); }});

    var labels = d3.select(this.element).selectAll('.bars')
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

    this.$el.empty();
    this.$el.append(this.template({nodeId: this.nodeId, title: this.title}));
    this.$('#' + this.nodeId).append(this.element);
    return this.$el;

  }


});
