# VENNIO
Data analytics platform to visualize a snapshot of the current startup world

## Team

  - __Product Owner__: Irfan Baqui
  - __Scrum Master__: Mike Yao
  - __Development Team Members__: Brant Choate, Irfan Baqui, Mike Yao

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [API Documentations](#api-documentations)

## Api Documentations

Server apiEndpoint: http://

1. GET '/SalaryJobBySkill'
returns average salaries and # of jobs grouped by skills

2. GET '/CompanyBySkill'
return # of companies grouped by skills

3. GET '/FilterJobSalaryBySkill/:locAndRole'
Example: '/FilterJobSalaryBySkill/san_francisco|hardware_engineer'
returns average salaries and # of jobs grouped by skills based on location and role filters

4. GET '/FilterCompanyBySkill/:locAndRole'
Example: '/FilterCompanyBySkill/san_francisco|hardware_engineer'
returns # of companies grouped by skills based on location and role filters

5. GET '/SalaryJobByLocation'
returns average salaries and # of jobs grouped by locations

6. GET '/CompanyByLocation'
returns # of companies grouped by locations

7. GET '/FilterJobSalaryByLocation/:skillAndRole'
Example: 'FilterJobSalaryByLocation/javascript|developer'
returns average salaries and # of jobs grouped by locations based on skill and role filters

8. GET '/FilterCompanyByLocation/:skillAndRole'
Example: '/FilterCompanyByLocation/javascript|developer'
returns # of companies grouped by locations based on skill and role filters

See [CONTRIBUTING.md](https://github.com/vennio/vennio/blob/master/_CONTRIBUTING.md) for git workflow guidelines.
