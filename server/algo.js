//TO RUN: node algo.js

'use strict';

var data = require('./data.js');

var getCount = function(jobs) {
  var storage = {};
  for(var i = 0; i < jobs.length; i++) {
    for(var j = 0; j < jobs[i].tags.length; j++) {
      if(jobs[i].tags[j].tag_type === 'SkillTag') {
        storage[jobs[i].tags[j].name] = true;
      }
    }
  }
  return storage;
}

var unique_skills = Object.keys(getCount(data.jobs));

var calculateValue = function(test, jobs) {
  var t = [];
  var f = [];

  for (var i = 0; i < jobs.length; i++) {
    for(var j = 0; j < jobs[i].tags.length; j++) {
      if(jobs[i].tags[j].name === test) {
        t.push(jobs[i]);
      } else {
        f.push(jobs[i]);
      }
    }
  };

  console.log('TEST: ' + test + " true: " + t.length + " false: " + f.length);

  var has = t.reduce(function(a, b){
    return a + b.salary_max; 
  }, 0) / t.length;

  var hasnt = f.reduce(function(a, b){
    return a + b.salary_max; 
  }, 0) / f.length;

  return has - hasnt;
}

unique_skills.forEach(function(val, k){
  console.log(val + ": " + calculateValue(val, data.jobs));
});
