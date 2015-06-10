var expect = require('chai').expect;
var request = require('request');

describe('test', function(){
  it('should be true', function(){
    expect(true).to.equal(true);
  });
});

describe('Server Integration', function(){
  it('should return salary and jobs grouped by skills', function(done){
    request('http://vennio.herokuapp.com/SalaryJobBySkill', function(err, response, body){
      if (!err && response.statusCode == 200) {
          var data = JSON.parse(body);
          // data returned from server should be [{'Jobs': 10, 'AvgSal': 100, 'Skill': 'javascript' }]
          expect(data).to.be.an('array');
          // Check if the size of the array bigger than 0
          expect(data.length).to.be.above(0);
          // Check if each element contains properties as Jobs, AvgSal, Skill
          var item = data[0];
          expect(item).to.have.property('Jobs')
            .that.is.a('number');
          expect(item).to.have.property('AvgSal')
            .that.is.a('number');
          expect(item).to.have.property('Skill')
            .that.is.a('string');
          done();
      } else {
        console.log('error: ', err);
      }
    });
  });

  it('should return number of companies grouped by skills', function(done){
    request('http://vennio.herokuapp.com/CompanyBySkill', function(err, response, body){
      if (!err && response.statusCode == 200) {
          var data = JSON.parse(body);
          // data returned from server should be [{'Startups': 100, 'Skills': 'javascript' }]
          expect(data).to.be.an('array');
          // Check if the size of the array bigger than 0
          expect(data.length).to.be.above(0);
          // Check if each element contains properties as Jobs, AvgSal, Skill
          var item = data[0];
          expect(item).to.have.property('Startups')
            .that.is.a('number');
          expect(item).to.have.property('Skills')
            .that.is.a('string');
          done();
      } else {
        console.log('error: ', err);
      }
    });
  });  

});