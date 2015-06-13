var AppView = Backbone.View.extend({

  template: _.template('<div class="nav" id="nav">' +
    '</div>' +
    '<div class="main">' +
    '<div class="container">' +
    '<div class="header" id="header">' +
    '</div>' +
    '<div class="dashboard" id="dashboard">' +
    '</div>' +
    '</div>' +
    '</div>'),


  initialize: function(params){
    this.dashboardType = 'SalaryJobBySkill',
    this.navView = new NavView();
    this.headerView = new HeaderView();
    this.dashboardView = new DashboardView({type: this.dashboardType});

    // var jobSkills = this.fetchData('SalaryJobBySkill');
    // var companySkills = this.fetchData('SalaryJobBySkill');

    // this.jobsSkillsCollection = new JobsSkillsCollection({jobSkills:jobSkills});
    // this.companySkillsCollection = new CompanySkillsCollection({companySkills:companySkills});

    // this.

    // this.chartLeftView = new ChartLeftView({collection: this.jobsSkillsCollection});
    // this.chartCenterView = new ChartCenterView({collection: this.companySkillsCollection});
    // this.chartRightView = new ChartRightView({collection: this.jobsSkillsCollection});

  },


  // fetchData: function(endpoint) {
  //   //make API call to fetch data
  //   if (endpoint === 'SalaryJobBySkill')
  //     return [{"Jobs":3577,"AvgSal":67316.48592395878,"Skill":"javascript"},{"Jobs":2249,"AvgSal":56052.100933748334,"Skill":"html"},{"Jobs":2146,"AvgSal":76506.49767008387,"Skill":"python"},{"Jobs":2094,"AvgSal":57329.604584527224,"Skill":"css"},{"Jobs":1777,"AvgSal":45154.27630838492,"Skill":"sales_and_marketing"},{"Jobs":1577,"AvgSal":72103.9086873811,"Skill":"ruby_on_rails"},{"Jobs":1574,"AvgSal":72583.86785260483,"Skill":"java"}];

  //   return [];
  // },

  render: function(){
    this.$el.html(this.template({}));
    this.$('#nav').html(this.navView.$el);
    this.$('#header').html(this.headerView.$el);
    this.$('#dashboard').html(this.dashboardView.$el);
    this.navView.render();
    this.headerView.render();
    return this.$el;
  }

});
