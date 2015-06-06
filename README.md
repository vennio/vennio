# VENNIO
> Data analytics platform to visualize a snapshot of the current startup world

## Team

  - __Product Owner__: Irfan Baqui
  - __Scrum Master__: Mike Yao
  - __Development Team Members__: Brant Choate, Irfan Baqui, Mike Yao

## Table of Contents

1. [Project Summary](#project-summary)
1. [Tech Stack](#tech-stack)
1. [Development](#development)
    1. [Requirement](#requirement)
    2. [API Documentations](#api-documentations)
    3. [Installing Dependencies](#installing-dependencies)
    4. [Start local server](#start-local-server)
    5. [Deploy to production](#deploy-to-production)
1. [Contributing](#contributing)

## Project Summary

## Tech Stack
We used D3 and jQuery as front-end data visualization, which is powered by MySQL database and Express server. 


## Development

### Requirement
Node v0.10.x
Bower 

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
```sh
'/FilterCompanyBySkill/:locAndRole'
Example: '/FilterCompanyBySkill/san_francisco|hardware_engineer'
```

#### Location Report
5. Average salaries and # of jobs
```sh
'/SalaryJobByLocation'
```

6. # of companies
```sh
'/CompanyByLocation'
```

7. Average salaries and # of jobs based on skill and role filters
```sh
'/FilterJobSalaryByLocation/:skillAndRole'
Example: 'FilterJobSalaryByLocation/javascript|developer'
```

8. # of companies based on skill and role filters
returns 
```sh
'/FilterCompanyByLocation/:skillAndRole'
Example: '/FilterCompanyByLocation/javascript|developer'
```

### Installing Dependencies

### Start local server

### Deploy to production

## Contributing
See [CONTRIBUTING.md](https://github.com/vennio/vennio/blob/master/_CONTRIBUTING.md) for contribution guidelines.
