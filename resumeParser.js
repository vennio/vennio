var fs = require('fs');
var skillsHelper = require('./skills.js');
require('./node_modules/fuzzyset.js/lib/fuzzyset.js');

var resumePath = './assets/yao.txt';
var matchnessThreshold = 0.9;
var resumeParserRegEx = /,\s|\s|\//;

var exports = module.exports = {};

exports.test = function(req, res){
  res.send('test');
};

exports.readResume = function(req,res){
  fs.readFile(resumePath, {encoding: 'utf8'}, function (err, data) {
    if (err) throw err;
    var resumeWords = data.split(resumeParserRegEx);
    res.send(resumeWords);
  });
};

exports.readResumePDF = function(req,res){
  fs.readFile('./assets/mikeyao.pdf', function (err, data) {
    if (err) throw err;
    // var resumeWords = data.split(/,\s|\s/);
    res.setHeader('Content-type', 'text');
    res.send(data);
  });
};

  
var skills = skillsHelper.skillsMore;
var skillsObj = {};
skills.forEach(function(val,i){
  if (!skillsObj.hasOwnProperty(val)){
    skillsObj[val] = true;
  }
});


exports.skills = function(req, res){
  res.send(skillsObj);
};

exports.countSkills = function(req,res){
  fs.readFile(resumePath, {encoding: 'utf8'}, function (err, data) {
    if (err) throw err;
    // Do something with data
    // Reg-ex: split by "comma + space" or "space"
    var resumeWords = data.split(resumeParserRegEx);
    var result = {};
    // Iterate thru resumeWords
    for (var i = 0; i < resumeWords.length; i++){
      // if word in skills dictionary
      var word = resumeWords[i];
      if (skillsObj.hasOwnProperty(word)){
        // if result already exist word as key
        if (result.hasOwnProperty(word)){
          // yes: increment the counter
          result[word] += 1;
        } else {
          // no: initialize to be count as 1
          result[word] = 1;
        }
      }
    }
    // res.send(result);
    res.send(resumeWords);
  });
};


exports.fuzzySet = function(req, res){
  // Sample test: 

  // a = FuzzySet();
  // a.add("michael axiak");
  // var result = a.get("micael asiak");
  // var expectedResult = [[0.8461538461538461, 'michael axiak']];

  var a = FuzzySet(skills);
  var result = a.get("htmlcss");
  res.send(result);
};

exports.countSkillsFuzzy = function(req,res){
  fs.readFile(resumePath, {encoding: 'utf8'}, function (err, data) {
    if (err) throw err;
    // Do something with data
    // Reg-ex: split by "comma + space" or "space"
    var resumeWords = data.split(resumeParserRegEx);
    var skillsFuzzified = FuzzySet(skills);
    var resultObj = {};
    // Iterate thru resumeWords
    for (var i = 0; i < resumeWords.length; i++){
      // if word in skills dictionary
      var word = resumeWords[i];
      // perform FuzzSet.get() upon a word in the resume, return [['matchnessRate', 'matchedString'], etc..]
      var matchness = skillsFuzzified.get(word);
      // only use the one with highest matchness rate
      // If there is any match
      if (matchness){
        // Now only considers the first match in the returned matches, there might be more than one match eg:
        // a.get("ang"); returns [[0.5,"Erlang"],[0.5,"Golang"],[0.5,"Django"]] 
        var matchnessRate = matchness[0][0];
        if (matchnessRate >= matchnessThreshold){
          var skillMatched = matchness[0][1];
          if (resultObj.hasOwnProperty(skillMatched)){
            // yes: increment the counter
            resultObj[skillMatched]["counts"] += 1;
          } else {
            // no: initialize to be count as 1
            resultObj[skillMatched] = {};
            resultObj[skillMatched] = 1;
            // resultObj[skillMatched]["counts"] = 1;
            // resultObj[skillMatched]["popularity"] = skills.indexOf(skillMatched);
          }
        }
      }
    }
    // Append priorities of skills based on number of job openings
    // Final goal: [{skill: counts},{},]
    // Step 1: convert to Array 
    var resultArray = [];
    for (var skill in resultObj){
      var skillEntry = {};
      skillEntry[skill] = resultObj[skill];
      resultArray.push(skillEntry);
    }
    // Sort
    resultArray.sort(function(a, b){
      if (a.popularity < b.popularity){
        return 1;
      }
      if (a.popularity > b.popularity){
        return -1;
      }
      return 0;
    });

    res.send(resultObj);
  });
};
