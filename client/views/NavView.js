var NavView = Backbone.View.extend({

  template: _.template(
    '<div class="container">' +
      '<div class="row">' +
        '<a href="#" class="logo">Vennio</a>' +
        '<span class="tagline">The Current State of Tech Startup Jobs</span>' +
       ' <nav>' +
          '<a href="#" id="skillsReport">Skills Report</a>' +
          '<a href="#" id="locationsReport">Locations Report</a>' +
        '</nav>' +
      '</div>' +
    '</div>'),

  events: {
    'click #skillsReport': function() {
      $('#locationsReport').removeClass('nav-highlight');
      $('#skillsReport').addClass('nav-highlight');
      return console.log('Switch to Skills View');
    },

    'click #locationsReport': function() {
      $('#skillsReport').removeClass('nav-highlight');
      $('#locationsReport').addClass('nav-highlight');
      return console.log('Switch to Locations View');
    }
  },

  initialize: function(params){
    // this.render();
  },

  render: function() {
    this.setElement(this.$el);
    this.$el.empty();
    this.$el.append(this.template({}));
    return this.$el;
  }

});
