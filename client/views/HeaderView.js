var HeaderView = Backbone.View.extend({

  template: _.template('<div class="row main-header">' +
       '<h2>Skills Dashboard</h2>' +
       '<div class="filters">' +
       '<span>Filter By:</span>' +
       '<form>' +
       '<input type="text" name="role" class="role-input typeahead" placeholder="Role">' +
       '<input type="text" name="location" class="location-input typeahead" placeholder="Location">' +
       '<input type="submit" name="submit" class="filter-button">' +
       '</form>' +
       '</div>' +
       '</div>'),

  initialize: function(params){

  },

  render: function(){
    this.$el.empty();
    this.$el.append(this.template({}));
    return this.$el;
  }

});