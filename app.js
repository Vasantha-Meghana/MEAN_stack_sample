const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.set("view engine", "ejs"); // use EJS templates
app.use(bodyParser.urlencoded({ extended: true })); // parse form data

// Connect to SQLite database
const db = new sqlite3.Database("./users.db");

// Create table if it doesn’t exist
db.run(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)"
);

// Route: Show all users
app.get("/", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) throw err;
    res.render("index", { users: rows });
  });
});

// Route: Show Add User form
app.get("/add", (req, res) => {
  res.render("add");
});

// Route: Handle form submission
app.post("/add", (req, res) => {
  const { name, age } = req.body;
  db.run("INSERT INTO users (name, age) VALUES (?, ?)", [name, age], (err) => {
    if (err) throw err;
    res.redirect("/"); // Go back to homepage
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
