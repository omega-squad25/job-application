# MySQL, PHPMyAdmin and Node.js (ready for Express development)

This will install Mysql and phpmyadmin (including all dependencies to run Phpmyadmin) AND node.js

This receipe is for development - Node.js is run in using supervisor: changes to any file in the app will trigger a rebuild automatically.

For security, this receipe uses a .env file for credentials.  A sample is provided in the env-sample file. If using these files for a fresh project, copy the env-sample file to a file called .env.  Do NOT commit the changed .env file into your new project for security reasons (in the node package its included in .gitignore so you can't anyway)

In node.js, we use the MySQl2 packages (to avoid problems with MySQL8) and the dotenv package to read the environment variables.

Local files are mounted into the container using the 'volumes' directive in the docker-compose.yml for ease of development.

### Super-quickstart your new project:

* Make sure that you don't have any other containers running usind docker ps
* run ```docker-compose up --build```

#### Visit phphmyadmin at:

http://localhost:8081/

#### Visit your express app at:

http://localhost:3000

For reference, see the video at: https://roehampton.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=6f290a6b-ba94-4729-9632-adcf00ac336e

NB if you are running this on your own computer rather than the azure labs that has been set up for you, you will need to install the following:

* node.js  (windows: https://nodejs.org/en/download/)
* docker desktop (for windows, this will also prompt you to install linux subsystem for windows https://docs.docker.com/desktop/windows/install/ )

### Whats provided in these scaffolding files?


  * A docker setup which will provide you with node.js, mysql and phpmyadmin, including the configuration needed so that both node.js AND phpmyadmin can 'see' and connect to your mysql database.  If you don't use docker you'll have to set up and connect each of these components separately.
  * A basic starting file structure for a node.js app.
  * A package.json file that will pull in the node.js libraries required and start your app as needed.
  * A db.js file which provides all the code needed to connect to the mysql database, using the credentials in the .env file, and which provides a query() function that can send queries to the database and receive a result.  In order to use this (ie. interact with the database, you simply need to include this file in any file you create that needs this database interaction) with the following code:

```const db = require('./services/db');
```

____

Useful commands:

Get a shell in any of the containers

```bash
docker exec -it <container name> bash -l
```

Once in the database container, you can get a MySQL CLI in the usual way

```bash
mysql -uroot -p<password> 
```


<!-- ABOUT THE PROJECT -->

# A Backend API for GoHire

### AUTHENTICATION

### Register/Sign up as a user

- Route: /api/auth/register
- method: POST

- 👇: Body

```json
{
 "fullName": "Peter Pan",
 "email": "peter@example.com",
 "password": "fakeUser@1",
 "confirmPassword": "fakeUser@1"
}
```

👇: Response

```json
{
 "message": "User registered successfully",
 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwZDdhZWU2LTY4OTEtNDk5YS04MmM0LTgyODQ3YTcxMzgxYyIsImVtYWlsIjoicGV0ZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MjIzNzQ5NiwiZXhwIjoxNzQyMzIzODk2fQ.izcnSTbHw_7-0I9RjKuBwUIFcC3e0oob5MLRYwGOgGY",
 "user": {
  "id": "d0d7aee6-6891-499a-82c4-82847a71381c",
  "email": "peter@example.com",
  "role": "user",
  "isAdmin": false,
  "profile": {
   "id": "b9594b17-6507-4a4a-8533-76b86425bc59",
   "userId": "d0d7aee6-6891-499a-82c4-82847a71381c"
  }
 }
}
```

#### Login a user

Route:/api/auth/login
method: POST

👇: Body

```json
{
 "email": "peter@example.com",
 "password": "fakeUser@1"
}
```

👇: Response

```json
{
 "message": "Login successful",
 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwZDdhZWU2LTY4OTEtNDk5YS04MmM0LTgyODQ3YTcxMzgxYyIsImVtYWlsIjoicGV0ZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MjIzNzY2MiwiZXhwIjoxNzQyMzI0MDYyfQ.agRKZSnduqy_lWjLvaY4IiM76GGd9jT6cjV0kg5xILo",
 "user": {
  "id": "d0d7aee6-6891-499a-82c4-82847a71381c",
  "email": "peter@example.com",
  "isAdmin": false
 }
}
```

#### Login as Admin

Route:/api/auth/login
method: POST

👇: Body

```json
{
 "email": "user@admin.com",
 "password": "Admin1@admin"
}
```

👇: Response

```json
{
 "message": "Login successful",
 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1NmZjN2I2LTZkMTctNDJkNC1hOWI4LWRiYzU4YjVhNDc2NCIsImVtYWlsIjoidXNlckBhZG1pbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDIyMzc5MDgsImV4cCI6MTc0MjMyNDMwOH0.wbzIXpe0YnThl6BJ7oGM-MGog0QzRd1lOm-aVObdvDY",
 "user": {
  "id": "856fc7b6-6d17-42d4-a9b8-dbc58b5a4764",
  "email": "user@admin.com",
  "isAdmin": true
 }
}
```

---

### JOB

#### Create job as an admin

- Route: api/jobs
- Method: POST
- Header
- Authorization: Bearer {token}

👇: Body

```json
{
 "title": "Technical Support",
 "description": "System admin",
 "company": "Fednet Ltd",
 "location": "New York"
}
```

👇: Response

```json
{
 "message": "Job created successfully",
 "job": {
  "id": "7c4adb4d-367d-4617-a510-4ec1e76984f8",
  "title": "Technical Support"
 }
}
```

#### Get all jobs (public)

- Route: /api/jobs
- Method: GET

```json
{
 "message": "Jobs retrieved successfully",
 "data": {
  "jobs": [
   {
    "id": "7c4adb4d-367d-4617-a510-4ec1e76984f8",
    "title": "Technical Support",
    "description": "System admin",
    "location": "New York",
    "company": "Fednet Ltd",
    "createdAt": "2025-03-17T19:02:34.000Z"
   }
  ],
  "pagination": {
   "total": 1,
   "page": 1,
   "limit": 10,
   "totalPages": 1
  }
 }
}
```

#### Get Jobs by Id

- Route: /api/jobs/:id
- Method: GET

👇: Response

```json
{
 "message": "Job retrieved successfully",
 "data": {
  "id": "7c4adb4d-367d-4617-a510-4ec1e76984f8",
  "title": "Technical Support",
  "description": "System admin",
  "location": "New York",
  "company": "Fednet Ltd",
  "createdAt": "2025-03-17T19:02:34.000Z"
 }
}
```
