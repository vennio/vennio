var skillsHelper = require('./skills.js');

var exports = module.exports = {}

exports.skills = ["javascript","python","node_js","Express","Git","MongoDB","MySQL","CSS","grunt","Coffeescript","Product","Analytics","Editing","Angular_JS","Mobile","Payments","Scalability","Education"];

exports.test = function(req, res){
  res.send('test');
};

var currencyMultipliers = {"CAD":0.80,"USD":1,"INR":0.016,"EUR":1.09,"CNY":0.16,"GBP":1.54,"SGD":0.74,"JPY":0.0081};
var salaryUpperbound = {max: Math.pow(10,6), min: Math.pow(10,6)*0.5};
var salaryLowerbound = Math.pow(10,4) * 5;

exports.validSalaryAndConvertionToUSD = function(job){
  var runningSalary = null;
  var currencyMultiplier = currencyMultipliers[job.currency_code];
  runningSalary_min = job.salary_min * currencyMultiplier;
  runningSalary_max = job.salary_max * currencyMultiplier;
  var isDeveloper = false;
  for (var role in job.roles){
    if (role.indexOf("developer") > -1){
      isDeveloper = true;
      break;
    }
  }
  if (isDeveloper){
    if (job.currency_code === "USD" && runningSalary_max < salaryUpperbound.max && runningSalary_min < salaryUpperbound.min && runningSalary_max > salaryLowerbound && runningSalary_min > salaryLowerbound){
      runningSalary = {"min": runningSalary_min, "max": runningSalary_max};
    } else {
      runningSalary = null;
    }
  }
  return runningSalary;
};