var http = require('http');
var Sequelize = require('sequelize');
var express = require('express');
// middleware for dynamically or statically enabling CORS in express/connect applications
var cors = require('cors');
var mysql = require('mysql');
var fs = require('fs')
var path = require('path');
var app = express();

// Enable all cors request
app.use(cors());

var currencyMultipliers = {"CAD":0.80,"USD":1,"INR":0.016,"EUR":1.09,"CNY":0.16,"GBP":1.54,"SGD":0.74,"JPY":0.0081};

/******************** Sequelize and MySQL Integration with Table Schemas ***************************/

// var sequelize = new Sequelize('heroku_9dc6f7a43b753af', 'bae5d84c4b9b57', '49ada8f9', {
//   host		: 	'us-cdbr-iron-east-02.cleardb.net',
//   dialect	: 	'mysql',
//   port		: 	'3306',
//   logging	: 	console.log,


//   pool: {
//     max 	: 	5,
//     min 	: 	0,
//     idle	: 	10000
//   },
// });

var sequelize = new Sequelize('vennio', 'root', null, {
  host    :   'localhost',
  dialect :   'mysql',
  port    :   '3306',
  logging :   console.log,


  pool: {
    max   :   5,
    min   :   0,
    idle  :   10000
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

//Static files
app.use(express.static(__dirname + '/../build'));


//Default front page
app.get('/', function(req,res) {
  fs.readFile(__dirname+'/../build/index.html', function (err, data) {
    if (err) throw err;
    res.writeHeader(200, {"Content-Type": "text/html"});
    res.write(data);
    res.end();
  });
});


// Group Average Salary and Job Count by Location
app.get('/SalaryJobByLocation', function(req, res) {
  sequelize.query("SELECT COUNT(Jobs.name) AS Jobs, AVG((Jobs.salary_max + Jobs.salary_min)/2) AS AvgSal, Locs.name AS Location " + 
                  "FROM Jobs, Locs, loc_job " +
                  "WHERE Locs.id = loc_job.Loc_rowId " +
                  "AND loc_job.Job_rowId = Jobs.id " +
                  "AND Jobs.salary_max < 500000 " +
                  "AND Jobs.salary_min < 500000 " +
                  "GROUP BY Locs.name " +
                  "ORDER BY COUNT(Jobs.name) DESC, AVG((Jobs.salary_max + Jobs.salary_min)/2) DESC"
                  , { type: sequelize.QueryTypes.SELECT})
  .then(function(data) {
    res.send(data.slice(0,85));
  });
});

// Group Average Salary and Job Count by Skill
app.get('/SalaryJobBySkill', function(req, res) {
  sequelize.query("SELECT COUNT(Jobs.name) AS Jobs, AVG((Jobs.salary_max + Jobs.salary_min)/2) AS AvgSal, Skills.name AS Skill " + 
                  "FROM Jobs, Skills, skill_job " +
                  "WHERE Skills.id = skill_job.Skill_rowId " +
                  "AND skill_job.Job_rowId = Jobs.id " +
                  "AND Jobs.salary_max < 500000 " +
                  "AND Jobs.salary_min < 500000 " +
                  "GROUP BY Skills.name " +
                  "ORDER BY COUNT(Jobs.name) DESC, AVG((Jobs.salary_max + Jobs.salary_min)/2) DESC"
                  , { type: sequelize.QueryTypes.SELECT})
  .then(function(data) {
    res.send(data.slice(0,485));
  });
});



// Group Company Count by Skill
app.get('/CompanyBySkill', function(req, res) {
  sequelize.query("SELECT COUNT(Startups.name) AS Startups, Skills.name AS Skills " + 
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
  sequelize.query("SELECT COUNT(Startups.name) AS Startups, Locs.name AS Locations " + 
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

// Output Job Numbers and Average Salary, filter by skill and role, group by Location
app.get('/FilterJobSalaryByLocation/:skillAndRole', function(req, res) {
  var filters = req.params.skillAndRole.split('|'),
      skillFilter = filters[0],
      roleFilter  = filters[1],
      query;

  if (skillFilter && roleFilter && skillFilter.length && roleFilter.length) {
    console.log('here')
    query = "SELECT COUNT(Jobs.name) AS Jobs, AVG((Jobs.salary_max + Jobs.salary_min)/2) AS AvgSal, Locs.name AS Location " + 
            "FROM Jobs, Locs, loc_job, Skills, skill_job, Roles, role_job " +
            "WHERE Locs.id = loc_job.Loc_rowId " +
            "AND loc_job.Job_rowId = Jobs.id " +
            "AND Skills.id = skill_job.Skill_rowId " +
            "AND skill_job.Job_rowId = Jobs.id " +
            "AND Skills.name = '" + skillFilter + "' " +
            "AND Roles.id = role_job.Role_rowId " +
            "AND role_job.Job_rowId = Jobs.id " +
            "AND Roles.name = '" + roleFilter + "' " +
            "AND Jobs.salary_max < 500000 " +
            "AND Jobs.salary_min < 500000 " +
            "GROUP BY Locs.name " +
            "ORDER BY COUNT(Jobs.name) DESC, AVG((Jobs.salary_max + Jobs.salary_min)/2) DESC"
  } else if (skillFilter && skillFilter.length) {
    console.log('HERE IN SKILL')
    query = "SELECT COUNT(Jobs.name) AS Jobs, AVG((Jobs.salary_max + Jobs.salary_min)/2) AS AvgSal, Locs.name AS Location " + 
            "FROM Jobs, Locs, loc_job, Skills, skill_job " +
            "WHERE Locs.id = loc_job.Loc_rowId " +
            "AND loc_job.Job_rowId = Jobs.id " +
            "AND Skills.id = skill_job.Skill_rowId " +
            "AND skill_job.Job_rowId = Jobs.id " +
            "AND Skills.name = '" + skillFilter + "' " +
            "AND Jobs.salary_max < 500000 " +
            "AND Jobs.salary_min < 500000 " +
            "GROUP BY Locs.name " +
            "ORDER BY COUNT(Jobs.name) DESC, AVG((Jobs.salary_max + Jobs.salary_min)/2) DESC" 
  } else if (roleFilter && roleFilter.length) {
    query = "SELECT COUNT(Jobs.name) AS Jobs, AVG((Jobs.salary_max + Jobs.salary_min)/2) AS AvgSal, Locs.name AS Location " + 
            "FROM Jobs, Locs, loc_job, Roles, role_job " +
            "WHERE Locs.id = loc_job.Loc_rowId " +
            "AND loc_job.Job_rowId = Jobs.id " +
            "AND Roles.id = role_job.Role_rowId " +
            "AND role_job.Job_rowId = Jobs.id " +
            "AND Roles.name = '" + roleFilter + "' " +
            "AND Jobs.salary_max < 500000 " +
            "AND Jobs.salary_min < 500000 " +
            "GROUP BY Locs.name " +
            "ORDER BY COUNT(Jobs.name) DESC, AVG((Jobs.salary_max + Jobs.salary_min)/2) DESC"
  } else res.send(401, 'invalid input');

  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
  .then(function(data) {
    console.log('data', data)
    res.send(data.slice(0,85));
  });
});

// Output Job Numbers and Average Salary, filter by skill and role, group by Skill
app.get('/FilterJobSalaryBySkill/:locAndRole', function(req, res) {
  var filters = req.params.locAndRole.split('|'),
      locFilter = filters[0],
      roleFilter  = filters[1],
      query;

  if (locFilter && roleFilter && locFilter.length && roleFilter.length) {
    query = "SELECT COUNT(Jobs.name) AS Jobs, AVG((Jobs.salary_max + Jobs.salary_min)/2) AS AvgSal, Skills.name AS Skill " + 
            "FROM Jobs, Skills, skill_job, Locs, Roles, loc_job, role_job " +
            "WHERE Skills.id = skill_job.Skill_rowId " +
            "AND skill_job.Job_rowId = Jobs.id " +
            "AND Locs.id = loc_job.Loc_rowId " +
            "AND loc_job.Job_rowId = Jobs.id " +
            "AND Locs.name = '" + locFilter + "' " +
            "AND Roles.id = role_job.Role_rowId " +
            "AND role_job.Job_rowId = Jobs.id " +
            "AND Roles.name = '" + roleFilter + "' " +
            "AND Jobs.salary_max < 500000 " +
            "AND Jobs.salary_min < 500000 " +
            "GROUP BY Skills.name " +
            "ORDER BY COUNT(Jobs.name) DESC, AVG((Jobs.salary_max + Jobs.salary_min)/2) DESC";
  } else if (locFilter && locFilter.length) {
    query = "SELECT COUNT(Jobs.name) AS Jobs, AVG((Jobs.salary_max + Jobs.salary_min)/2) AS AvgSal, Skills.name AS Skill " + 
            "FROM Jobs, Skills, skill_job, Locs, loc_job " +
            "WHERE Skills.id = skill_job.Skill_rowId " +
            "AND skill_job.Job_rowId = Jobs.id " +
            "AND Locs.id = loc_job.Loc_rowId " +
            "AND loc_job.Job_rowId = Jobs.id " +
            "AND Locs.name = '" + locFilter + "' " +
            "AND Jobs.salary_max < 500000 " +
            "AND Jobs.salary_min < 500000 " +
            "GROUP BY Skills.name " +
            "ORDER BY COUNT(Jobs.name) DESC, AVG((Jobs.salary_max + Jobs.salary_min)/2) DESC";
  } else if (roleFilter && roleFilter.length) {
    query = "SELECT COUNT(Jobs.name) AS Jobs, AVG((Jobs.salary_max + Jobs.salary_min)/2) AS AvgSal, Skills.name AS Skill " + 
            "FROM Jobs, Skills, skill_job, Roles, role_job " +
            "WHERE Skills.id = skill_job.Skill_rowId " +
            "AND skill_job.Job_rowId = Jobs.id " +
            "AND Roles.id = role_job.Role_rowId " +
            "AND role_job.Job_rowId = Jobs.id " +
            "AND Roles.name = '" + roleFilter + "' " +
            "AND Jobs.salary_max < 500000 " +
            "AND Jobs.salary_min < 500000 " +
            "GROUP BY Skills.name " +
            "ORDER BY COUNT(Jobs.name) DESC, AVG((Jobs.salary_max + Jobs.salary_min)/2) DESC";
  } else res.send('invalid input');

  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
  .then(function(data) {
    res.send(data.slice(0,85));
  });
});


// Output Company Count, filter by skill and role, group by Location
app.get('/FilterCompanyByLocation/:skillAndRole', function(req, res) {
  var filters = req.params.skillAndRole.split('|'),
      skillFilter = filters[0],
      roleFilter  = filters[1],
      query;

  if (skillFilter && roleFilter && skillFilter.length && roleFilter.length) {
    query = "SELECT COUNT(Startups.name) AS Startups, Locs.name AS Locations " + 
             "FROM Jobs, Startups, startup_job, Locs, loc_job, Skills, skill_job, Roles, role_job " +
             "WHERE Jobs.id = startup_job.Job_rowId " +
             "AND startup_job.Startup_rowId = Startups.id " +
             "AND Jobs.id = loc_job.Job_rowId " +
             "AND loc_job.Loc_rowId = Locs.id " +
             "AND Skills.id = skill_job.Skill_rowId " +
             "AND skill_job.Job_rowId = Jobs.id " +
             "AND Skills.name = '" + skillFilter + "' " +
             "AND Roles.id = role_job.Role_rowId " +
             "AND role_job.Job_rowId = Jobs.id " +
             "AND Roles.name = '" + roleFilter + "' " +
             "GROUP BY Locs.name " +
             "ORDER BY COUNT(Startups.name) DESC";
  } else if (skillFilter && skillFilter.length) {
    query = "SELECT COUNT(Startups.name) AS Startups, Locs.name AS Locations " + 
             "FROM Jobs, Startups, startup_job, Locs, loc_job, Skills, skill_job " +
             "WHERE Jobs.id = startup_job.Job_rowId " +
             "AND startup_job.Startup_rowId = Startups.id " +
             "AND Jobs.id = loc_job.Job_rowId " +
             "AND loc_job.Loc_rowId = Locs.id " +
             "AND Skills.id = skill_job.Skill_rowId " +
             "AND skill_job.Job_rowId = Jobs.id " +
             "AND Skills.name = '" + skillFilter + "' " +
             "GROUP BY Locs.name " +
             "ORDER BY COUNT(Startups.name) DESC";
  } else if (roleFilter && roleFilter.length) {
    query = "SELECT COUNT(Startups.name) AS Startups, Locs.name AS Locations " + 
             "FROM Jobs, Startups, startup_job, Locs, loc_job, Roles, role_job " +
             "WHERE Jobs.id = startup_job.Job_rowId " +
             "AND startup_job.Startup_rowId = Startups.id " +
             "AND Jobs.id = loc_job.Job_rowId " +
             "AND loc_job.Loc_rowId = Locs.id " +
             "AND Roles.id = role_job.Role_rowId " +
             "AND role_job.Job_rowId = Jobs.id " +
             "AND Roles.name = '" + roleFilter + "' " +
             "GROUP BY Locs.name " +
             "ORDER BY COUNT(Startups.name) DESC";
  } else res.send(401, 'invalid input');


  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
  .then(function(data) {
    res.send(data.slice(0,35));
  });
});

// Output Company Count, filter by location and role, group by Skill
app.get('/FilterCompanyBySkill/:locAndRole', function(req, res) {
  var filters = req.params.locAndRole.split('|'),
      locFilter = filters[0],
      roleFilter  = filters[1],
      query;

  if (locFilter && roleFilter && locFilter.length && roleFilter.length) {
    query = "SELECT COUNT(Startups.name) AS Startups, Skills.name AS Skills " + 
            "FROM Jobs, Startups, startup_job, Skills, skill_job, Locs, loc_job, Roles, role_job " +
            "WHERE Jobs.id = startup_job.Job_rowId " +
            "AND startup_job.Startup_rowId = Startups.id " +
            "AND Jobs.id = skill_job.Job_rowId " +
            "AND skill_job.Skill_rowId = Skills.id " +
            "AND Jobs.id = loc_job.Job_rowId " +
            "AND loc_job.Loc_rowId = Locs.id " +
            "AND Locs.name = '" + locFilter + "' " +
            "AND Roles.id = role_job.Role_rowId " +
            "AND role_job.Job_rowId = Jobs.id " +
            "AND Roles.name = '" + roleFilter + "' " +
            "GROUP BY Skills.name " +
            "ORDER BY COUNT(Startups.name) DESC"
  } else if (locFilter && locFilter.length) {
    query = "SELECT COUNT(Startups.name) AS Startups, Skills.name AS Skills " + 
            "FROM Jobs, Startups, startup_job, Skills, skill_job, Locs, loc_job " +
            "WHERE Jobs.id = startup_job.Job_rowId " +
            "AND startup_job.Startup_rowId = Startups.id " +
            "AND Jobs.id = skill_job.Job_rowId " +
            "AND skill_job.Skill_rowId = Skills.id " +
            "AND Jobs.id = loc_job.Job_rowId " +
            "AND loc_job.Loc_rowId = Locs.id " +
            "AND Locs.name = '" + locFilter + "' " +
            "GROUP BY Skills.name " +
            "ORDER BY COUNT(Startups.name) DESC"
  } else if (roleFilter && roleFilter.length) {
    query = "SELECT COUNT(Startups.name) AS Startups, Skills.name AS Skills " + 
            "FROM Jobs, Startups, startup_job, Skills, skill_job, Roles, role_job " +
            "WHERE Jobs.id = startup_job.Job_rowId " +
            "AND startup_job.Startup_rowId = Startups.id " +
            "AND Jobs.id = skill_job.Job_rowId " +
            "AND skill_job.Skill_rowId = Skills.id " +
            "AND Roles.id = role_job.Role_rowId " +
            "AND role_job.Job_rowId = Jobs.id " +
            "AND Roles.name = '" + roleFilter + "' " +
            "GROUP BY Skills.name " +
            "ORDER BY COUNT(Startups.name) DESC"
  } else res.send(401, 'invalid input');


  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
  .then(function(data) {
    res.send(data.slice(0,35));
  });
});



// Output total number of jobs and average salary
app.get('/SalaryJob', function(req, res){
  var query = "SELECT COUNT(Jobs.`name`) as Jobs, ((AVG(Jobs.`salary_min`) + AVG(Jobs.`salary_max`) )/ 2) as AvgSal " + 
              "FROM Jobs " +
              "WHERE Jobs.`salary_min` < 500000 " + // Filters to validate super high salaries
              "AND Jobs.`salary_max` < 500000 ";
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    .then(function(data) {
      res.send(data);
    });
});

// Output total number of companies
app.get('/Company', function(req, res){
  var query = "SELECT count(*) AS Startups " +
              "FROM (SELECT Startups.`name` " +
                    "FROM Jobs, Startups, startup_job " +
                    "WHERE Jobs.`id` = startup_job.`Job_rowId` " +
                    "AND Startups.`id`= startup_job.`Startup_rowId` " +
                    "AND Jobs.`salary_min` < 500000 " +
                    "AND Jobs.`salary_max` < 500000 " +
                    "GROUP BY Startups.`name`) AS temp_table";
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    .then(function(data) {
      res.send(data);
    });
});

// Output total Job Numbers and Average Salary, filter by loc and role
app.get('/FilterOverviewJobSalaryBySkill/:locAndRole', function(req, res) {
  var filters = req.params.locAndRole.split('|'),
      locFilter = filters[0],
      roleFilter  = filters[1],
      query;
      
  if (locFilter && roleFilter && locFilter.length && roleFilter.length) {
    query = "SELECT COUNT(Jobs.`name`) as Jobs, ((AVG(Jobs.`salary_min`) + AVG(Jobs.`salary_max`) )/ 2) as AvgSal " +
            "FROM Jobs, Roles, role_job, Locs, loc_job " +
            "WHERE Jobs.`salary_min` < 500000 " +
            "AND Jobs.`salary_max` < 500000 " +
            "AND Jobs.`id` = role_job.`Job_rowId` " +
            "AND Roles.`id`= role_job.`Role_rowId` " +
            "AND Roles.name = '" + roleFilter + "' " +
            "AND Jobs.`id` = loc_job.`Job_rowId` " +
            "AND locs.`id`= loc_job.`Loc_rowId` " +
            "AND Locs.name = '" + locFilter + "' ";
  } else if (locFilter && locFilter.length) {
    query = "SELECT COUNT(Jobs.`name`) as Jobs, ((AVG(Jobs.`salary_min`) + AVG(Jobs.`salary_max`) )/ 2) as AvgSal " + 
            "FROM Jobs, locs, loc_job " + 
            "WHERE Jobs.`salary_min` < 500000 " + 
            "AND Jobs.`salary_max` < 500000 " + 
            "AND Jobs.`id` = loc_job.`Job_rowId` " + 
            "AND locs.`id`= loc_job.`Loc_rowId` " + 
            "AND Locs.name = '" + locFilter + "' ";
  } else if (roleFilter && roleFilter.length) {
    query = "SELECT COUNT(Jobs.`name`) as Jobs, ((AVG(Jobs.`salary_min`) + AVG(Jobs.`salary_max`) )/ 2) as AvgSal " +
            "FROM Jobs, Roles, role_job " +
            "WHERE Jobs.`salary_min` < 500000 " +
            "AND Jobs.`salary_max` < 500000 " +
            "AND Jobs.`id` = role_job.`Job_rowId` " +
            "AND Roles.`id`= role_job.`Role_rowId` " +
            "AND Roles.name = '" + roleFilter + "' ";
  } else res.send('invalid input');

console.log(query);
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
  .then(function(data) {
    res.send(data);
  });
});

// Output Total Company Count, filter by location and role
app.get('/FilterOverviewCompanyBySkill/:locAndRole', function(req, res) {
  var filters = req.params.locAndRole.split('|'),
      locFilter = filters[0],
      roleFilter  = filters[1],
      query;

  if (locFilter && roleFilter && locFilter.length && roleFilter.length) {
    query = "SELECT count(*) AS Startups " +
            "FROM (SELECT Startups.`name` " +
            "FROM Jobs, Startups, startup_job, Roles, role_job, Locs, loc_job " +
            "WHERE Jobs.`id` = startup_job.`Job_rowId` " +
            "AND Startups.`id`= startup_job.`Startup_rowId` " +
            "AND Jobs.`id` = role_job.`Job_rowId` " +
            "AND Roles.`id` = role_job.`Role_rowId` " +
            "AND Jobs.`id` = loc_job.`Job_rowId` " +
            "AND Locs.`id` = loc_job.`Loc_rowId` " +
            "AND Jobs.`salary_min` < 500000 " +
            "AND Jobs.`salary_max` < 500000 " +
            "AND Roles.name = '" + roleFilter + "' " +
            "AND Locs.name = '" + locFilter + "' " +
            "GROUP BY Startups.`name`) AS temp_table ";
  } else if (locFilter && locFilter.length) {
    query = "SELECT COUNT(*) AS Startups " +
            "FROM (SELECT Startups.`name` " +
            "FROM Jobs, Startups, startup_job, Locs, loc_job " +
            "WHERE Jobs.`id` = startup_job.`Job_rowId` " +
            "AND Startups.`id`= startup_job.`Startup_rowId` " +
            "AND Jobs.`id` = loc_job.`Job_rowId` " +
            "AND Locs.`id` = loc_job.`Loc_rowId` " +
            "AND Jobs.`salary_min` < 500000 " +
            "AND Jobs.`salary_max` < 500000 " +
            "AND Locs.name = '" + locFilter + "' " +
            "GROUP BY Startups.`name`) AS temp_table ";
  } else if (roleFilter && roleFilter.length) {
    query = "SELECT count(*) AS Startups " +
            "FROM (SELECT Startups.`name` " +
            "FROM Jobs, Startups, startup_job, Roles, role_job " +
            "WHERE Jobs.`id` = startup_job.`Job_rowId` " +
            "AND Startups.`id`= startup_job.`Startup_rowId` " +
            "AND Jobs.`id` = role_job.`Job_rowId` " +
            "AND Roles.`id` = role_job.`Role_rowId` " +
            "AND Jobs.`salary_min` < 500000 " +
            "AND Jobs.`salary_max` < 500000 " +
            "AND Roles.name = '" + roleFilter + "' " +
            "GROUP BY Startups.`name`) AS temp_table ";
  } else res.send(401, 'invalid input');


  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
  .then(function(data) {
    res.send(data);
  });
});


// Output total Job Numbers and Average Salary, filter by skill and role
app.get('/FilterOverviewJobSalaryByLocation/:SkillAndRole', function(req, res) {
  var filters = req.params.SkillAndRole.split('|'),
      skillFilter = filters[0],
      roleFilter  = filters[1],
      query;
      
  if (skillFilter && roleFilter && skillFilter.length && roleFilter.length) {
    query = "SELECT COUNT(Jobs.`name`) as Jobs, ((AVG(Jobs.`salary_min`) + AVG(Jobs.`salary_max`) )/ 2) as AvgSal " +
            "FROM Jobs, Roles, role_job, Skills, skill_job " +
            "WHERE Jobs.`salary_min` < 500000 " +
            "AND Jobs.`salary_max` < 500000 " +
            "AND Jobs.`id` = role_job.`Job_rowId` " +
            "AND Roles.`id`= role_job.`Role_rowId` " +
            "AND Roles.name = '" + roleFilter + "' " +
            "AND Jobs.`id` = skill_job.`Job_rowId` " + 
            "AND Skills.`id`= skill_job.`Skill_rowId` " + 
            "AND Skills.name = '" + skillFilter + "' ";
  } else if (skillFilter && skillFilter.length) {
    query = "SELECT COUNT(Jobs.`name`) as Jobs, ((AVG(Jobs.`salary_min`) + AVG(Jobs.`salary_max`) )/ 2) as AvgSal " + 
            "FROM Jobs, Skills, skill_job " + 
            "WHERE Jobs.`salary_min` < 500000 " + 
            "AND Jobs.`salary_max` < 500000 " + 
            "AND Jobs.`id` = skill_job.`Job_rowId` " + 
            "AND Skills.`id`= skill_job.`Skill_rowId` " + 
            "AND Skills.name = '" + skillFilter + "' ";
  } else if (roleFilter && roleFilter.length) {
    query = "SELECT COUNT(Jobs.`name`) as Jobs, ((AVG(Jobs.`salary_min`) + AVG(Jobs.`salary_max`) )/ 2) as AvgSal " +
            "FROM Jobs, Roles, role_job " +
            "WHERE Jobs.`salary_min` < 500000 " +
            "AND Jobs.`salary_max` < 500000 " +
            "AND Jobs.`id` = role_job.`Job_rowId` " +
            "AND Roles.`id`= role_job.`Role_rowId` " +
            "AND Roles.name = '" + roleFilter + "' ";
  } else res.send('invalid input');

console.log(query);
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
  .then(function(data) {
    res.send(data);
  });
});

// Output Total Company Count, filter by skill and role
app.get('/FilterOverviewCompanyByLocation/:SkillAndRole', function(req, res) {
  var filters = req.params.SkillAndRole.split('|'),
      skillFilter = filters[0],
      roleFilter  = filters[1],
      query;

  if (skillFilter && roleFilter && skillFilter.length && roleFilter.length) {
    query = "SELECT count(*) AS Startups " +
            "FROM (SELECT Startups.`name` " +
            "FROM Jobs, Startups, startup_job, Roles, role_job, Skills, skill_job " +
            "WHERE Jobs.`id` = startup_job.`Job_rowId` " +
            "AND Startups.`id`= startup_job.`Startup_rowId` " +
            "AND Jobs.`id` = role_job.`Job_rowId` " +
            "AND Roles.`id` = role_job.`Role_rowId` " +
            "AND Jobs.`id` = skill_job.`Job_rowId` " +
            "AND Skills.`id` = skill_job.`Skill_rowId` " +
            "AND Jobs.`salary_min` < 500000 " +
            "AND Jobs.`salary_max` < 500000 " +
            "AND Roles.name = '" + roleFilter + "' " +
            "AND Skills.name = '" + skillFilter + "' " +
            "GROUP BY Startups.`name`) AS temp_table ";
  } else if (skillFilter && skillFilter.length) {
    query = "SELECT COUNT(*) AS Startups " +
            "FROM (SELECT Startups.`name` " +
            "FROM Jobs, Startups, startup_job, Skills, skill_job " +
            "WHERE Jobs.`id` = startup_job.`Job_rowId` " +
            "AND Startups.`id`= startup_job.`Startup_rowId` " +
            "AND Jobs.`id` = skill_job.`Job_rowId` " +
            "AND Skills.`id` = skill_job.`Skill_rowId` " +
            "AND Jobs.`salary_min` < 500000 " +
            "AND Jobs.`salary_max` < 500000 " +
            "AND Skills.name = '" + skillFilter + "' " +
            "GROUP BY Startups.`name`) AS temp_table ";
  } else if (roleFilter && roleFilter.length) {
    query = "SELECT count(*) AS Startups " +
            "FROM (SELECT Startups.`name` " +
            "FROM Jobs, Startups, startup_job, Roles, role_job " +
            "WHERE Jobs.`id` = startup_job.`Job_rowId` " +
            "AND Startups.`id`= startup_job.`Startup_rowId` " +
            "AND Jobs.`id` = role_job.`Job_rowId` " +
            "AND Roles.`id` = role_job.`Role_rowId` " +
            "AND Jobs.`salary_min` < 500000 " +
            "AND Jobs.`salary_max` < 500000 " +
            "AND Roles.name = '" + roleFilter + "' " +
            "GROUP BY Startups.`name`) AS temp_table ";
  } else res.send(401, 'invalid input');


  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
  .then(function(data) {
    res.send(data);
  });
});

/******************** END Endpoint Configuration ***************************/


/******************** Start Server ********************/
var server = app.listen(process.env.PORT || 9000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

/******************** END Start Server ********************/







