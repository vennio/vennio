# VENNIO.COM
> Data analytics platform to visualize a snapshot of the current startup world

## Team

  - __Product Owner__: Irfan Baqui
  - __Scrum Master__: Mike Yao
  - __Development Team Members__: Brant Choate, Irfan Baqui, Mike Yao

## Table of Contents

1. [Tech Stack](#tech-stack)
1. [Development](#development)
    1. [Requirement](#requirement)
    2. [API Documentations](#api-documentations)
1. [Contributing](#contributing)

## Tech Stack
We used D3 and jQuery for front-end data visualization and Backbone as a framework for code modularity.
We deigned the Express backend as a RESTful API for individual deployment of components, seperation of concerns between back-end and front-end.
We used MongoDB for data munging and mySQL as a database to optimize for querying speed.

## Development
### Requirement
NPM
Node v0.10.x
Bower 

### Api Documentations

Server apiEndpoint: http://vennio.com/

#### Skill Report

* Average salaries and # of jobs grouped by skills
```sh
'/SalaryJobBySkill'
```

* Number of companies grouped by skills
```sh
'/CompanyBySkill'
```

* Average salaries and # of jobs based on location and role filters
```sh
/FilterJobSalaryBySkill/:locAndRole
Example: '/FilterJobSalaryBySkill/san_francisco|hardware_engineer'
```

* Number of companies based on location and role filters
```sh
'/FilterCompanyBySkill/:locAndRole'
Example: '/FilterCompanyBySkill/san_francisco|hardware_engineer'
```

#### Location Report
* Average salaries and # of jobs
```sh
'/SalaryJobByLocation'
```

* Number of companies
```sh
'/CompanyByLocation'
```

* Average salaries and # of jobs based on skill and role filters
```sh
'/FilterJobSalaryByLocation/:skillAndRole'
Example: 'FilterJobSalaryByLocation/javascript|developer'
```

* Number of companies based on skill and role filters
```sh
'/FilterCompanyByLocation/:skillAndRole'
Example: '/FilterCompanyByLocation/javascript|developer'
```

## Contributing
See [CONTRIBUTING.md](https://github.com/vennio/vennio/blob/master/_CONTRIBUTING.md) for contribution guidelines.
