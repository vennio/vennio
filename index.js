var express = require('express');
var app = express();
var request = require('request');
var rp = require('request-promise');
var promise = require('bluebird');
var fs = promise.promisifyAll(require('fs'));
var mongoose = require('mongoose');

var port = process.env.PORT || 3000;
var db = process.env.MONGOLAB_URI || 'mongodb://localhost/vennio';
mongoose.connect(db);

var Schema = mongoose.Schema;

//Schema for the first version of Jobs from the angel list API
var jobsSchema = new Schema({
  jobs: Object,
  page: Number
});

//Not being used at the moment, but will use it to get average minimum and maximum salaries for each skill in the database
var salarySchema = new Schema({
  skill: String,
  salary_min: Number,
  salary_max: Number
});

//Schema is not being used, but it is there as a reference for the object stored in "Startup" property of each job in "jobsClean" schema
var startupSchema = new Schema({
  name: String,
  angellist_url: String,
  logo_url: String,
  thumb_url: String,
  quality: Number,
  product_desc: String,
  high_concept: String,
  follower_count: Number,
  company_url: String,
  created_at: String,
  updated_at: String
});

//Schema for each job
var jobsClean = new Schema({
  title: String,
  description: String,
  created_at: String,
  updated_at: String,
  equity_cliff: String,
  equity_min: String,
  equity_max: String,
  equity_vest: String,
  currency_code: String,
  job_type: String,
  salary_min: Number,
  salary_max: Number,
  angellist_url: String,
  locations: Object,
  roles: Object,
  skills: Object,
  startup: Object
})

var Jobs = mongoose.model('Jobs', jobsSchema);
var JobsClean = mongoose.model('JobsClean', jobsClean);
  
//Used an array of pages to iterate through all objects in the initial dirty version of angel list data
var pages = [];
for(var x = 0; x <= 440; x++) {
  pages.push(x);
}

//Home page
app.get('/', function (req, res) {
  res.send('Hello World!');
});

//Poll Angel List API to get 440 pages of jobs
app.get('/getjobs', function(req,res) {
  promise.map(pages, function(item) {
    var currPage = item+1;
    rp('https://api.angel.co/1/jobs?page='+currPage+'&access_token=6c28aa3c9a31bbd42774ca9aae29824d61cf6f86dc2dcfbe')
    .then(function (body) {
      console.log('made REQ', body);
      var job = new Jobs({
        jobs: body,
        page: currPage
      })
      //Write all jobs to a text file for backup
      fs.appendFileSync('data.txt', JSON.stringify(body));
      job.save(function(err) {
        console.log('in SAVE');
        if (err) console.log('ERROR IN MONGO: ', err);
      });
    })
    //End when we reach the last page
    .then(function(body) {
      if(item >= 440) {
        res.send('END');
      }
    })
    .catch(function(err){console.log('in catch', err); res.sendStatus(401);})
  });
});


//Send all jobs from the table "JobsClean" to the user
app.get('/viewJobs', function(req, res) {
  JobsClean.find({}, function(err, jobs) {
    res.send(jobs);
  });
});

//Send all jobs from the table "JobsClean" that have really high salaries to the user
app.get('/outliers', function(req, res) {
  var query = {};
  var skill = req.params.skill;
  var outlier = {"salary_max": {"$gt": 10000000}}
  JobsClean.find(outlier, function(err, jobs) {
    console.log(jobs);
    res.send(jobs);
  });
});

//A shell for getting all currencies from the database
app.get('/getCurrencies', function(req, res) {
  res.send('END');
});

//Send average salaries for Jobs that have a specific skill
app.get('/skill/:skill', function(req, res) {
  var query = {};
  var skill = req.params.skill;
  query['skills.' + skill] = {$exists: true};
  JobsClean.find(query, function(err, jobs) {
    var count = jobs.length;
    console.log(count);
    var runningSalary_min = 0;
    var runningSalary_max = 0;
    jobs.forEach(function(job) {
      runningSalary_min += job.salary_min;
      runningSalary_max += job.salary_max;
    });
    var avg = (runningSalary_min+runningSalary_max)/2
    res.send(avg/count + '');
  });
});

//Send average salaries for Jobs that do not have a specific skill
app.get('/notSkill/:skill', function(req, res) {
  var query = {};
  var skill = req.params.skill;
  query['skills.' + skill] = {$exists: false};
  JobsClean.find(query, function(err, jobs) {
    var count = jobs.length;
    console.log(count);
    var runningSalary_min = 0;
    var runningSalary_max = 0;
    jobs.forEach(function(job) {
      runningSalary_min += job.salary_min;
      runningSalary_max += job.salary_max;
    });
    var avg = (runningSalary_min+runningSalary_max)/2
    res.send(avg/count + '');
  });
});

//getTags is used to get a clean version of Tags, because the raw data consists of multiple versions of the same skill ex. Project_Manager, project-manager
var getTags = function (str) {
  var result = [];
  var allSkills = str.split('/');
  for (var t = 0; t < allSkills.length; t++) {
    var tag_name = '';
    var curr_tag = allSkills[t].toLowerCase();
    for (var s = 0; s < curr_tag.length; s++) {
      if (curr_tag[s] === ' ' || curr_tag[s] === '-' || curr_tag[s] === '.') {
        tag_name = tag_name + '_';
      }
      else {
        tag_name = tag_name + curr_tag[s];
      }
    }
    result.push(tag_name);
  }
  return result;
}

//Do not run this!! It has already been run once. It parses the raw database with Angellist data and cleans it. 
app.get('/cleanDataaaaaa', function(req, res) {
  for (var x = 1; x <= 440; x++) {
    Jobs.find({page:x}, function(err, item) {
      if (err) res.send('ERROR: ' + err);
      else {
        //get an array of jobs
        var jobsArr = JSON.parse(item[0]['jobs'])['jobs'];
        // iterate through the jobs array and make a Schema for each job
        for(var j = 0; j < jobsArr.length; j++) {
          var locations = {};
          var roles = {};
          var skills = {};

          //iterate through all tags to get locations, roles, skills
          for (var t = 0; t < jobsArr[j].tags.length; t++) {
            var cleanTags = getTags(jobsArr[j].tags[t].name);
            console.log('cleantags: ', cleanTags);
            //cleanTags is an array. Iterate through it and add tags to locations, roles, skills
            for (var c = 0; c < cleanTags.length; c++) {
              if (jobsArr[j].tags[t].tag_type === 'LocationTag') {
                if (!locations.hasOwnProperty(cleanTags[c])) {
                  locations[cleanTags[c]] = true;
                }
              } else if (jobsArr[j].tags[t].tag_type === 'RoleTag') {
                if (!roles.hasOwnProperty(cleanTags[c])) {
                  roles[cleanTags[c]] = true;
                }
              } else if (jobsArr[j].tags[t].tag_type === 'SkillTag') {
                if (!skills.hasOwnProperty(cleanTags[c])) {
                  skills[cleanTags[c]] = true;
                }
              } else ;
            }
          }
          console.log('LOCATIONS: ', locations);
          console.log('ROLES: ', roles);
          console.log('SKILLS: ', skills);

          var startup = {
            name: jobsArr[j].startup.name,
            angellist_url: jobsArr[j].startup.angellist_url,
            logo_url: jobsArr[j].startup.logo_url,
            thumb_url: jobsArr[j].startup.thumb_url,
            quality: jobsArr[j].startup.quality,
            product_desc: jobsArr[j].startup.product_desc,
            high_concept: jobsArr[j].startup.high_concept,
            follower_count: jobsArr[j].startup.follower_count,
            company_url: jobsArr[j].startup.company_url,
            created_at: jobsArr[j].startup.created_at,
            updated_at: jobsArr[j].startup.updated_at
          }
          var job = {
            title: jobsArr[j].title,
            description: jobsArr[j].description,
            created_at: jobsArr[j].created_at,
            updated_at: jobsArr[j].updated_at,
            equity_cliff: jobsArr[j].equity_cliff,
            equity_min: jobsArr[j].equity_min,
            equity_max: jobsArr[j].equity_max,
            equity_vest: jobsArr[j].equity_vest,
            currency_code: jobsArr[j].currency_code,
            job_type: jobsArr[j].job_type,
            salary_min: jobsArr[j].salary_min,
            salary_max: jobsArr[j].salary_max,
            angellist_url: jobsArr[j].angellist_url,
            locations: locations,
            roles: roles,
            skills: skills,
            startup: startup
          }
          console.log('JOB: ', job);
          var jobsClean = new JobsClean(job);
          jobsClean.save(function(err){
            if (err) {
              console.log('ERR in CLEAN: ' + err);
              res.send(err);
            }
          });
        }
      }
    });
  }
  res.send('END');
});


//This function is incomplete. It's a shell function to get the average salaries for each skill using cleanData table
app.get('/tagSalary', function(req, res) {
  var skills = {

  }
  JobsClean.find({}, function(jobs) {
    jobs.forEach(function(){

    })
  })
  res.send('END');
});


var server = app.listen(port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});