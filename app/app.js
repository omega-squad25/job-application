// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("app/public"));

// Use the Pug templating engine
app.set("view engine", "pug");
app.set("views", "./app/views");

// Get the functions in the db.js file to use
const db = require("./services/db");

// Create a route for root - /
app.get("/", function (req, res) {
  res.render("pages/index", { title: "GoHire home page" });
});

// Create a route for testing the db
app.get("/db_test", function (req, res) {
  // Assumes a table called test_table exists in your database
  sql = "select * from test_table";
  db.query(sql).then((results) => {
    console.log(results);
    res.send(results);
  });
});

// // Create a route for the dashboard page
// app.get("/dashboard", function (req, res) {
//   res.render("pages/user", { title: "User Dashboard" });
// });


// Redirect the dashboard route to the user page
app.get("/dashboard", function (req, res) {
  res.redirect("/dashboard/user/index");
});

// Create a route for the user dashboard page
app.get("/dashboard/user", function (req, res) {
  res.render("pages/dashboard/user/index", { title: "User Dashboard" });
});

// Create a route for the admin dashboard page
app.get("/dashboard/admin", function (req, res) {
  res.render("pages/dashboard/admin", { title: "Admin Dashboard" });
});



// Create a route for the jobs page
app.get("/jobs", function (req, res) {
  res.render("pages/jobs", { title: "GoHire Jobs page" });
});

// Create a route for the login page
app.get("/login", function (req, res) {
  res.render("pages/login", { title: "GoHire Login page" });
});

// Create a route for the register page
app.get("/signUp", function (req, res) {
  res.render("pages/signUp", { title: "GoHire Registration page" });
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function (req, res) {
  // req.params contains any parameters in the request
  // We can examine it in the console for debugging purposes
  console.log(req.params);
  //  Retrieve the 'name' parameter and use it in a dynamically generated page
  res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
