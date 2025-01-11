const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

// Initialize Express
const app = express();
const PORT = 3000;

// Connect to SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create tables if they don't exist
db.serialize(() => {
  // Create 'actions' table
  db.run(
    `CREATE TABLE IF NOT EXISTS actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      description TEXT
    )`,
    (err) => {
      if (err) console.error("Error creating 'actions' table:", err.message);
    }
  );

  // Create 'messages' table
  db.run(
    `CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL
    )`,
    (err) => {
      if (err) console.error("Error creating 'messages' table:", err.message);
    }
  );
});

// Middleware
app.use(express.static("public")); // Serve static files (CSS, JS, images)
app.set("view engine", "ejs"); // Set EJS as the template engine
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

// Routes
// Home
app.get("/", (req, res) => {
  res.render("home");
});

// About
app.get("/about", (req, res) => {
  res.render("about");
});

// Learn
app.get("/learn", (req, res) => {
  res.render("learn");
});

// Get Involved
app.get("/get-involved", (req, res) => {
  res.render("get-involved");
});

// Take Action
app.get("/take-action", (req, res) => {
  // Fetch actions from the database
  db.all("SELECT * FROM actions", [], (err, rows) => {
    if (err) {
      console.error("Error fetching actions:", err.message);
      return res.status(500).send("Internal Server Error");
    }
    res.render("take-action", { actions: rows });
  });
});

// Contact (GET)
app.get("/contact", (req, res) => {
  res.render("contact");
});

// Contact (POST)
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  // Insert the contact message into the database
  db.run(
    `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`,
    [name, email, message],
    (err) => {
      if (err) {
        console.error("Error saving message:", err.message);
        return res.status(500).send("Failed to send your message.");
      }
      console.log(`Message received from ${name} (${email}): ${message}`);
      res.send("Thank you for reaching out! We will get back to you soon.");
    }
  );
});

// API Endpoint for Actions (optional)
app.get("/api/actions", (req, res) => {
  db.all("SELECT * FROM actions", [], (err, rows) => {
    if (err) {
      console.error("Error fetching actions:", err.message);
      return res.status(500).json({ error: "Failed to fetch actions." });
    }
    res.json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
