'use strict';

var calculateValue = function(test, jobs) {
  var t = [];
  var f = [];

  //populate two arrays defining all the jobs that have a particular skill VS an array that doesnt
  for (var i = 0; i < jobs.length; i++) {
    for(var j = 0; j < jobs[i].tags.length; j++) {
      if(jobs[i].tags[j].name === test) {
        t.push(jobs[i]);
      } else {
        f.push(jobs[i]);
      }
    }
  };

  //reduce to a single value for the average salary of those that have a skill vs those that don't
  var has = t.reduce(function(a, b){
    return a + b.salary_max; 
  }, 0) / t.length;

  var hasnt = f.reduce(function(a, b){
    return a + b.salary_max; 
  }, 0) / f.length;

  return has - hasnt;
}
