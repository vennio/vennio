var DashboardView = Backbone.View.extend({

	currentView: '',

  template: _.template('<div class="row main-content" id="dashboard-content"></div>'),
  // colWidth: $('.barchart').width(),

	initialize: function(params) {
    this.dashboardType = params.type;
    this.group = 'Skill';
    if (this.dashboardType === 'SalaryJobBySkill')
      this.initializeModels();
	},

  initializeModels: function() {

    var companyModel = new WrapperModel({endpoint: 'CompanyBySkill'});
    var jobSalaryModel = new WrapperModel({endpoint: 'SalaryJobBySkill'});

    var _this = this;
    return companyModel.fetchCurrent({success: function(model, response, options) {
      companyModel.parse(response);
      _this.chart2 = new ChartView({jobConfig: {colors: ['#9686E9'],metricLabel: 'Companies', group: this.group, dataLabel: 'Startups'}, model: companyModel, nodeId: 'wrapper2', title:'# OF COMPANIES'});
      return jobSalaryModel.fetchCurrent({success: function(model, response, options) {
        jobSalaryModel.parse(response);
        _this.chart1 = new ChartView({jobConfig: {colors: ['#19C999'],metricLabel: 'Jobs', group: this.group, dataLabel: 'Jobs'}, model: jobSalaryModel, nodeId: 'wrapper1', title:'# OF JOBS'});
        _this.chart3 = new ChartView({jobConfig: {colors: ['#E65E5E'],metricLabel: 'Dollars (Thousands)', group: this.group, dataLabel: 'AvgSal'}, model: jobSalaryModel, nodeId: 'wrapper3', title:'SALARY'});
        _this.$el.empty();
        _this.$el.append(_this.template({}));
        _this.$('#dashboard-content').empty();
        _this.$('#dashboard-content').html([_this.chart1.$el,_this.chart2.$el,_this.chart3.$el]);
        console.log('in dashboard', _this.el);
        return _this.$el;
      }});
    }});

  },

});