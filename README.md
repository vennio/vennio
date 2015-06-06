# VENNIO
> Data analytics platform to visualize a snapshot of the current startup world

## Team

  - __Product Owner__: Irfan Baqui
  - __Scrum Master__: Mike Yao
  - __Development Team Members__: Brant Choate, Irfan Baqui, Mike Yao

## Table of Contents

1. [Tech Stack](#tech-stack)
1. [Development](#development)
    1. [API Documentations](#api-documentations)
    2. [Installing Dependencies](#installing-dependencies)
    3. [Deploy to production](#deploy-to-production)
1. [Contributing](#contributing)



## Tech Stack
We used D3 and jQuery as front-end data visualization, which is powered by MySQL database and Express server. 


## Development

### Api Documentations

Server apiEndpoint: http://10.8.31.3:9000/

#### Skill Report

1. Average salaries and # of jobs grouped by skills
```sh
'/SalaryJobBySkill'
```

2. # of companies grouped by skills
```sh
'/CompanyBySkill'
```

3. Average salaries and # of jobs based on location and role filters
```sh
/FilterJobSalaryBySkill/:locAndRole
Example: '/FilterJobSalaryBySkill/san_francisco|hardware_engineer'
```

4. # of companies based on location and role filters
Example: '/FilterCompanyBySkill/san_francisco|hardware_engineer'
returns # of companies grouped by skills based on location and role filters
```sh
'/FilterCompanyBySkill/:locAndRole'
Example: '/FilterCompanyBySkill/san_francisco|hardware_engineer'
```

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

### Installing Dependencies

### Deploy to production

## Contributing
See [CONTRIBUTING.md](https://github.com/vennio/vennio/blob/master/_CONTRIBUTING.md) for contribution guidelines.
