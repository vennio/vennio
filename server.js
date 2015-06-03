var http = require('http');
var Sequelize = require('sequelize');
var express = require('express');
var app = express();

var currencyMultipliers = {"CAD":0.80,"USD":1,"INR":0.016,"EUR":1.09,"CNY":0.16,"GBP":1.54,"SGD":0.74,"JPY":0.0081};

/******************** Sequelize and MySQL Integration with Table Schemas ***************************/

var sequelize = new Sequelize('vennio', 'root', null, {
  host		: 	'localhost',
  dialect	: 	'mysql',
  port		: 	'3306',
  logging	: 	console.log,


  pool: {
    max 	: 	5,
    min 	: 	0,
    idle	: 	10000
  },
});


var Job   = 	sequelize.define('Job', {
                id          :  {
                      			     primaryKey   :true,
                      			     type         :Sequelize.UUID,
                      			     defaultValue :Sequelize.UUIDV4,
                      			   },
          			name        : Sequelize.STRING,
          			description : Sequelize.TEXT,
          			equity_min  : Sequelize.FLOAT,
          			equity_max  : Sequelize.FLOAT,
          			salary_min  : Sequelize.FLOAT,
          			salary_ma  : Sequelize.FLOAT,
          			currency    : Sequelize.STRING,
              }),

    Skill =   sequelize.define('Skill', {
                id   : {
                         primaryKey   : true,
                         type         : Sequelize.UUID,
                         defaultValue : Sequelize.UUIDV4
                       },
                name : Sequelize.STRING
              }),

    Loc   =   sequelize.define('Loc', {
                id   : {
                         primaryKey   : true,
                         type         : Sequelize.UUID,
                         defaultValue : Sequelize.UUIDV4
                       },
                name : Sequelize.STRING
              }),

    Role  =   sequelize.define('Role', {
                id   : {
                         primaryKey   : true,
                         type         : Sequelize.UUID,
                         defaultValue : Sequelize.UUIDV4
                       },
                name : Sequelize.STRING
              }),

    Startup = sequelize.define('Startup', {
                id   : {
                         primaryKey   : true,
                         type         : Sequelize.UUID,
                         defaultValue : Sequelize.UUIDV4
                       },
                name : Sequelize.STRING
              });

Skill.belongsToMany(Job, {
  through    : 'skill_job',
  foreignKey : 'Skill_rowId'
});

Job.belongsToMany(Skill, {
  through    : 'skill_job',
  foreignKey : 'Job_rowId'
});

Loc.belongsToMany(Job, {
  through    : 'loc_job',
  foreignKey : 'Loc_rowId'
});

Job.belongsToMany(Loc, {
  through    : 'loc_job',
  foreignKey : 'Job_rowId'
});

Role.belongsToMany(Job, {
  through    : 'role_job',
  foreignKey : 'Role_rowId'
});

Job.belongsToMany(Role, {
  through    : 'role_job',
  foreignKey : 'Job_rowId'
});

Startup.belongsToMany(Job, {
  through    : 'startup_job',
  foreignKey : 'Startup_rowId'
});

Job.belongsToMany(Startup, {
  through    : 'startup_job',
  foreignKey : 'Job_rowId'
});

/******************** END Sequelize and MySQL connections ***************************/


/******************** Endpoint Configuration ***************************/


// Group Average Salary and Job Count by Location
app.get('/SalaryJobByLocation', function(req, res) {
  sequelize.query("SELECT COUNT(Jobs.name) AS Jobs, AVG((Jobs.salary_max + Jobs.salary_min)/2) AS AvgSal, Locs.name AS Location " + 
                  "FROM Jobs, Locs, loc_job " +
                  "WHERE Locs.id = loc_job.Loc_rowId " +
                  "AND loc_job.Job_rowId = Jobs.id " +
                  "AND Jobs.salary_max < 500000 " +
                  "AND Jobs.salary_min < 200000 " +
                  "GROUP BY Locs.name " +
                  "ORDER BY COUNT(Jobs.name) DESC, AVG((Jobs.salary_max + Jobs.salary_min)/2) DESC"
                  , { type: sequelize.QueryTypes.SELECT})
  .then(function(data) {
    res.send(data.slice(0,85));
  });
});

// Group Average Salary and Job Count by Skill
app.get('/SalaryJobBySkill', function(req, res) {
  sequelize.query("SELECT COUNT(Jobs.name) as Jobs, AVG((Jobs.salary_max + Jobs.salary_min)/2) AS AvgSal, Skills.name AS Skill " + 
                  "FROM Jobs, Skills, skill_job " +
                  "WHERE Skills.id = skill_job.Skill_rowId " +
                  "AND skill_job.Job_rowId = Jobs.id " +
                  "AND Jobs.salary_max < 500000 " +
                  "AND Jobs.salary_min < 200000 " +
                  "GROUP BY Skills.name " +
                  "ORDER BY COUNT(Jobs.name) DESC, AVG((Jobs.salary_max + Jobs.salary_min)/2) DESC"
                  , { type: sequelize.QueryTypes.SELECT})
  .then(function(data) {
    res.send(data.slice(0,485));
  });
});

// Group Company Count by Skill
app.get('/CompanyBySkill', function(req, res) {
  sequelize.query("SELECT COUNT(Startups.name), Skills.name " + 
                  "FROM Jobs, Startups, startup_job, Skills, skill_job " +
                  "WHERE Jobs.id = startup_job.Job_rowId " +
                  "AND startup_job.Startup_rowId = Startups.id " +
                  "AND Jobs.id = skill_job.Job_rowId " +
                  "AND skill_job.Skill_rowId = Skills.id " +
                  "GROUP BY Skills.name " +
                  "ORDER BY COUNT(Startups.name) DESC"
                  , { type: sequelize.QueryTypes.SELECT})
  .then(function(data) {
    res.send(data.slice(0,180));
  });
});

// Group Company Count by Location
app.get('/CompanyByLocation', function(req, res) {
  sequelize.query("SELECT COUNT(Startups.name), Locs.name " + 
                  "FROM Jobs, Startups, startup_job, Locs, loc_job " +
                  "WHERE Jobs.id = startup_job.Job_rowId " +
                  "AND startup_job.Startup_rowId = Startups.id " +
                  "AND Jobs.id = loc_job.Job_rowId " +
                  "AND loc_job.Loc_rowId = Locs.id " +
                  "GROUP BY Locs.name " +
                  "ORDER BY COUNT(Startups.name) DESC"
                  , { type: sequelize.QueryTypes.SELECT})
  .then(function(data) {
    res.send(data.slice(0,35));
  });
});

/******************** END Endpoint Configuration ***************************/


/******************** Start Server ********************/
var server = app.listen(9000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

/******************** END Start Server ********************/







