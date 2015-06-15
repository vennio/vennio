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
    this.headerView = new HeaderView({type: this.dashboardType});
    this.dashboardView = new DashboardView({type: this.dashboardType});

    this.listenTo(Backbone, 'renderSkillsReport', function () {
      this.dashboardType = 'SalaryJobBySkill';
      this.dashboardView = new DashboardView({type: this.dashboardType});
      this.headerView.render({dashboardType: this.dashboardType});
      this.$('#dashboard').html(this.dashboardView.$el);
    }, this);

    this.listenTo(Backbone, 'renderLocationsReport', function () {
      this.dashboardType = 'SalaryJobByLocation';
      this.dashboardView = new DashboardView({type: this.dashboardType});
      this.headerView.render({dashboardType: this.dashboardType});
      this.$('#dashboard').html(this.dashboardView.$el);
    }, this);

    this.listenTo(Backbone, 'filterReport', function (filter) {
      this.dashboardView = new DashboardView({type: this.dashboardType, filter: filter});
      this.headerView.render({dashboardType: this.dashboardType});
      this.$('#dashboard').html(this.dashboardView.$el);
    }, this);

  },

  render: function(){
    this.$el.html(this.template({}));
    this.$('#nav').html(this.navView.$el);
    this.$('#header').html(this.headerView.$el);
    this.$('#dashboard').html(this.dashboardView.$el);
    this.navView.render();
    this.headerView.render({dashboardType: this.dashboardType});
    return this.$el;
  }

});
