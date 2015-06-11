var DashboardView = Backbone.View.extend({

	currentView: '',

  template: _.template('<div class="row main-content" id="dashboard-content"></div>'),
  // colWidth: $('.barchart').width(),

	initialize: function() {
    var jobConfig = {
        selector: '.wrapper1',
        colors: ['#19C999'],
        // width: colWidth,
        metricLabel: 'Jobs'
      };
    this.chartView = new ChartView(jobConfig);
	},

	renderSkillsGroup: function() {
		this.$('#dashboard-content').empty();
    this.$('#dashboard-content').html([this.chartView.$el]);
    // this.chartView.render();
    return this.$el;
	},

	renderLocationsGroup: function() {

	},

	renderSummary: function() {

	}

});