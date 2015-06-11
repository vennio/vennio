var NavView = Backbone.View.extend({

  template: _.template('<div class="container">' +
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
          "click #skillsReport": "doSomething",
          "click #locationsReport": "doSomething",
      },

  doSomething: function() {
    return console.log('I AM HERE');
  },

  initialize: function(params){
    // this.render();
  },

  render: function(){
    this.$el.empty();
    this.$el.append(this.template({}));
    return this.$el;
  }

});