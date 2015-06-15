var HeaderView = Backbone.View.extend({

  template: _.template(
    '<div class="row main-header">' +
       '<h2>Skills Dashboard</h2>' +
       '<div class="filters">' +
       '<span>Filter By:</span>' +
       '<form>' +
       '<input type="text" name="role" class="role-input typeahead" placeholder="Role">' +
       '<input type="text" name="<%= inputType %>" class="<%= inputType %>-input typeahead" placeholder="<%= inputType_upper %>">' +
       '<input type="submit" name="submit" class="filter-button">' +
       '</form>' +
       '</div>' +
       '</div>'),

  initialize: function(params) {
    if (params.dashboardType === 'SalaryJobBySkill') {
      this.inputType = 'location';
      this.inputType_upper = 'Location';
    } else {
      this.inputType = 'skill';
      this.inputType_upper = 'Skill';
    }
  },

  events: {
    'click .filter-button': function(e) {
      e.preventDefault();
      var map = {};
      $('.twitter-typeahead input.tt-input').each(function() {
        map[$(this).attr('name')] = $(this).val();
      });
      Backbone.trigger('filterReport', map);
    }
  },

  render: function(params) {
    if (params.dashboardType === 'SalaryJobBySkill') {
      this.inputType = 'location';
      this.inputType_upper = 'Location';
    } else {
      this.inputType = 'skill';
      this.inputType_upper = 'Skill';
    }

    this.$el.empty();
    this.$el.append(this.template({inputType: this.inputType, inputType_upper: this.inputType_upper}));

    var skillArray = ['javascript', 'python'];
    var locArray = ['san_francisco', 'new_york,_ny', 'bangalore', 'london', 'los_angeles', 'boston', 'new_delhi', 'mumbai', 'palo_alto', 'toronto', 'washington,_dc', 'chicago', 'mountain_view', 'berlin', 'seattle', 'gurgaon', 'austin', 'silicon_valley', 'amsterdam', 'singapore', 'vancouver', 'cambridge,_ma', 'montreal', 'san_mateo', 'hyderabad', 'paris', 'san_diego', 'santa_monica', 'redwood_city', 'atlanta', 'india', 'sunnyvale', 'hong_kong', 'united_states', 'san_jose', 'philadelphia', 'oakland', 'san_francisco_bay_area', 'menlo_park', 'sydney', 'pune', 'remote', 'barcelona', 'denver', 'united_kingdom', 'dallas', 'noida', 'boulder', 'santa_clara,_ca', 'berkeley', 'earth', 'brooklyn', 'miami', 'istanbul', 'houston', 'munich', 'tel_aviv_yafo', 'new_york', 'melbourne', 'beijing', 'cincinnati', 'florida', 'detroit', 'baltimore', 'phoenix', 'madrid', 'pittsburgh', 'las_vegas', 'durham', 'irvine', 'santa_barbara', 'dubai', 'europe', 'anywhere', 'salt_lake_city', 'bangkok', 'portland', 'pasadena,_ca', 'newport_beach', 'hamburg', 'madras', 'stockholm', 'los_altos', 'raleigh', 'orange_county'];
    var roleArray = ['office_manager', 'frontend_developer', 'devops', 'sales', 'operations', 'finance', 'designer', 'hardware_engineer', 'product_manager', 'data_scientist', 'mobile_developer', 'full_stack_developer', 'attorney', 'human_resources', 'marketing', 'developer', 'backend_developer'];

    var locations = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: locArray
    });

    var skills = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: skillArray
    });

    var roles = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: roleArray
    });

    $(function() {
      $('.location-input.typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      },
      {
        name: 'locations',
        source: locations
      });

      $('.skill-input.typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      },
      {
        name: 'skills',
        source: skills
      });

      $('.role-input.typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      },
      {
        name: 'roles',
        source: roles
      });
    });

    this.setElement(this.$el);
    return this.$el;
  }

});
