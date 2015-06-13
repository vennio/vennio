var WrapperModel = Backbone.Model.extend({
  
  urlRoot:'https://vennio.herokuapp.com/',

  initialize: function(params) {
    this.url = this.urlRoot + params.endpoint;
  },

  fetchCurrent: function(options, context) {
    var _this = context;
    this.fetch(options);
  },

  parse: function(data) {
    this.collection = new CompanyLocationsCollection(data);
  }

})