var frontEndSkills = ['Backbone.js', 'Coffeescript', 'Ember.js', 'HTML', 'CSS', 'Angular.js', 'D3', 'Bootstrap'];
var backEndSkills = ['Node.js', 'Express.js', 'MySQL', 'MongoDB', 'PostgreSQL', 'Django', 'Ruby on Rails'];
var center = ['javascript'];


var node = function(skill, group){
  this.name = skill;
  this.group = group;
};

var link = function(source, target, value){
  this.source = source;
  this.target = target;
  this.value = value;
};

var createGroupLinks = function(skills){
  var links = [];
  for (var i = 0; i < skills.length; i++){
    for (var j = i + 1; j < skills.length; j++){
      var yes = (Math.random() > 0.5);
      if (true){
        var value = Math.floor(Math.random() * 100);
        links.push(new link(i, j, value));
      }
    }
  }
  return links;
};

var generateMockData = function(){
  var jsonData = {};
  jsonData.nodes = [];
  jsonData.links = [];
  jsonData.nodes = frontEndSkills.map(function(skill){
    return new node(skill, 1);
  });
  jsonData.links = createGroupLinks(frontEndSkills); 
  return jsonData; 
};

// var jsonData = generateMockData();
// console.log(JSON.stringify(jsonData.links));

var skills = frontEndSkills.concat(backEndSkills,center);
console.log(skills);