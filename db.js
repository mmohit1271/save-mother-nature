const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create the necessary tables if they don't already exist
db.serialize(() => {
  // Create the 'actions' table
  db.run(
    `CREATE TABLE IF NOT EXISTS actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      description TEXT
    )`,
    (err) => {
      if (err) {
        console.error("Error creating 'actions' table:", err.message);
      } else {
        console.log("'actions' table is ready.");
      }
    }
  );

  // Create the 'messages' table
  db.run(
    `CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error("Error creating 'messages' table:", err.message);
      } else {
        console.log("'messages' table is ready.");
      }
    }
  );
});

module.exports = db;
