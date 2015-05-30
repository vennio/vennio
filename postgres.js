var http = require('http');
var pg = require('pg');
var Sequelize = require('sequelize');
var express = require('express');
var app = express();

var Promise = require('bluebird');

var jobs = [{
  "_id": "556362ee76024a72d7c7fc21",
  "title": "Senior Back-End Engineer",
  "description": "RESPONSIBILITIES any",
  "equity_min": "0.01",
  "equity_max": "0.25",
  "currency_code": "USD",
  "job_type": "full-time",
  "salary_min": 80000,
  "salary_max": 160000,
  "angellist_url": "https://angel.co/bandpage/jobs/66124-senior-back-end-engineer",
  "skills": {
    "python": true,
    "java": true,
    "Brant": true,
  }
}, {
  "_id": "556362f076024a72d7c7fff8",
  "title": "Backend Software Engineer, Advertising",
  "description": "AdsNative is hiring ets",
  "created_at": "2015-05-18T18:17:05Z",
  "updated_at": "2015-05-18T18:17:05Z",
  "equity_cliff": "1.0",
  "equity_min": "0.1",
  "equity_max": "0.25",
  "equity_vest": "4.0",
  "currency_code": "USD",
  "job_type": "full-time",
  "salary_min": 110000,
  "salary_max": 130000,
  "angellist_url": "https://angel.co/adsnative/jobs/66776-backend-software-engineer-advertising",
  "skills": {
    "python": true,
    "django": true,
    "mysql": true,
    "mongodb": true,
    "git": true,
  }
}, {
  "_id": "556362ec76024a72d7c7f8b8",
  "title": "Full Stack Engineer",
  "description": "You geek out over nce",
  "equity_min": "1.0",
  "equity_max": "5.0",
  "currency_code": "USD",
  "job_type": "cofounder",
  "salary_min": 100000,
  "salary_max": 150000,
  "angellist_url": "https://angel.co/frontfix/jobs/67667-full-stack-engineer",
  "skills": {
    "python": true,
    "objective_c": true,
    "irfan": true,
  }
}];

var sequelize = new Sequelize('vennio', null, null, {
  host: 'localhost',
  dialect: 'postgres',
  port: '5432',
  logging: console.log,


  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

var Job = sequelize.define('Job', {
  id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  equity_min: Sequelize.FLOAT,
  equity_max: Sequelize.FLOAT,
  salary_min: Sequelize.FLOAT,
  salary_max: Sequelize.FLOAT,
  url: Sequelize.STRING,
});

var Skill = sequelize.define('Skill', {
  id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
  },
  name: Sequelize.STRING
});

// var Loc = skillsequelize.define('Loc', {
//   id: {
//         primaryKey: true,
//         type: DataTypes:UUID,
//         defaultValue: DataTypes.UUIDV4
//   },
//   name: Sequelize.STRING
// });

// var Role = sequelize.define('Role', {
//   id: {
//         primaryKey: true,
//         type: DataTypes:UUID,
//         defaultValue: DataTypes.UUIDV4
//   },
//   name: Sequelize.STRING
// });

// var Startup = sequelize.define('Startup', {
//   id: {
//         primaryKey: true,
//         type: DataTypes:UUID,
//         defaultValue: DataTypes.UUIDV4
//   },
//   name: Sequelize.STRING
// });

// Loc.belongsToMany(Job, {
//   through: 'loc_job',
//   foreignKey: 'Loc_rowId'
// });

// Job.belongsToMany(Loc, {
//   through: 'loc_job',
//   foreignKey: 'Job_rowId'
// });

// Role.belongsToMany(Job, {
//   through: 'role_job',
//   foreignKey: 'Role_rowId'
// });

// Job.belongsToMany(Role, {
//   through: 'role_job',
//   foreignKey: 'Job_rowId'
// });

Skill.belongsToMany(Job, {
  through: 'skill_job',
  foreignKey: 'Skill_rowId'
});

Job.belongsToMany(Skill, {
  through: 'skill_job',
  foreignKey: 'Job_rowId'
});


// var chainer = new Sequelize.Utils.QueryChainer;
// chainer.add(Job.sync());
// chainer.add(Loc.sync());
// chainer.add(Role.sync());
// chainer.add(Startup.sync());

var promiseWhile = function(condition, action) {
    var resolver = Promise.defer();

    var loop = function() {
        if (!condition()) return function(){resolver.resolve()};
        return Promise.cast(action())
            .then(loop)
            .catch(function() {resolver.reject});
    };

    process.nextTick(loop);

    return resolver.promise;
};

var jobCounter = 0;
var skillsCounter = 0;

var jobStop = function() {
  return jobCounter < jobs.length;
}

var skillsAction = function(skills, job) {
  return new Promise(function(resolve, reject) {
    Skill.findOne({
      where: {name: skills[skillsCounter]}
    })
    .then(function(skill) {
      if (!skill) {
        Skill.create({
          name: skills[skillsCounter]
        })
        .then(function(skill) {
          job.setSkills(skill);
        })
      }
      else {
        job.setSkills(skill);
      }
    })
    .then(function() {
      resolve();
    })
  })
}
var jobAction = function() {
  return new Promise(function(resolve,reject) {
    var job     =  jobs[jobCounter],
        skills  =  Object.keys(jobs[i].skills);
    Job.create({
      name: job.title,
      description:job.description,
      equity_min: job.equity_min,
      equity_max: job.equity_max,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      url: job.angellist_url,
    })
    .then(function() {
      return skillsStop = function() {
        return skillsCounter < skills.length
      }
    })
    .then(function(skillsStop) {
      return promiseWhile(skillsStop, skillsAction);
    })
    .then(function() {
      jobCounter++;
      resolve();
    })
  })
}

Job.sync({force:true})
.then(function() {Skill.sync({force:true})})
.then(function() {
  promiseWhile(jobStop, jobAction);
})
.then(function(){
  console.log('----------------------------DONE---------------------------');
})


// Job.sync({force:true})
// .then(function() {Skill.sync({force:true})})
// .then(function() {
//   for(var j = 0; j < jobs.length; j++) {
//     var dbJob = jobs[j];
//     dbSkills = dbJob.skills;
//     Job.create({
//       name: dbJob.title,
//       description:dbJob.description,
//       equity_min: dbJob.equity_min,
//       equity_max: dbJob.equity_max,
//       salary_min: dbJob.salary_min,
//       salary_max: dbJob.salary_max,
//       url: dbJob.angellist_url,
//     })
//     .then(function(job) {
//       for(var x in dbSkills) {
//         var concern = x;
//         Skill.findOne({
//           where: {name: concern}
//         })
//         .then(function(skill) {
//           if (!skill) {
//             Skill.create({
//               name: x
//             })
//             .then(function(skill) {
//               job.setSkills(skill);
//             })
//           }
//           else {
//             job.setSkills(skill);
//           }
//         })
//       }
//     })
//   }
// })

app.get('/', function(req,res) {
  Skill.findAll({where: {name:'javascript'}})
  .then(function(item) {
    console.log('ALL ITEMS', item);
    res.send(item);
  })
})


var server = app.listen(3001, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});