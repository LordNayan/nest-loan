
# Loan App

Its a simple loan app built on top of NestJS.




## Tech Stack

**Server:** Node, NestJS 

**Database:** PostgreSQL, TypeORM

**Security:** JWT, bcrypt

**Package Manager:** pnpm

**Versions:** node v18.12.1 (npm v8.19.2) , pnpm 8.6.0




## Run Locally

Clone the project

```bash
  git clone https://github.com/LordNayan/nest-loan
```

Go to the project directory

```bash
  cd nest-loan
```

Change the .env file by putting your local DB Details

```bash
#APPLICATION CONFIG
PORT=3000

#DATABASE CONFIG
DATABASE_HOST=localhost
DATABASE_NAME=postgres
DATABASE_USER=nayanlakhwani
DATABASE_PASSWORD=
DATABASE_PORT=5432
```


Install node and pnpm **(Optional)**

```bash
After you have installed node,

RUN: npm install -g pnpm
```

### 1. Bash Script Way
```bash
RUN: ./setup.sh 
```
### 2. Normal Way



Install dependencies

```bash
pnpm install
```

Run Migrations

```bash
pnpm migration:run
```

Start the server

```bash
pnpm run start
```

Open Swagger

```bash
localhost:3000/docs
```



## Features

- Role Based API Authorization & JWT Authentication
- Create loan
- Approve loan
- Repay loan
- Get all loans
- Get particular loan by id
- Create new users
- Login

## Additional Instructions

- Roles:
  --
    1. Admin
    2. User

- Login - **/user/login**
  --
      Default users:-

      Admin: 
      username - admin, password - 123456

      User: 
      username - nayan, password - 123456
    After login, you will get a token, copy it and authorize in swagger. It is required by all other apis.


- Admin APIs: (admin token required)
  --
  1. Create User - /user/create
  2. Approve Loan - /loan/approveLoan




## Running Tests

To run tests, run the following command

```bash
  unit test:

  pnpm test:cov
```

![Unit Test](https://github.com/LordNayan/nest-loan/assets/51285263/9e0c578f-0cf4-48be-85e4-c5b55522949c)

```bash
  e2e test:
  
  pnpm test:e2e
```

![E2E Tests](https://github.com/LordNayan/nest-loan/assets/51285263/5599a37f-6d9c-4f30-b92c-1ff0e3821eb5)


## Support

For support, email nayan.lakhwani123@gmail.com.

