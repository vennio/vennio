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
  },

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
