const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'urls.db');

// Open the database
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create the URLs table if it doesn't exist

const createUrlsTable = () => {
  db.run(`CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    shortCode TEXT NOT NULL UNIQUE,
    visits INTEGER DEFAULT 0,
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP
  );`, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('URLs table created or already exists.');
    }
  });
};

// Call the function to ensure the table is created
createUrlsTable();

// Function to insert a new URL
const insertUrl = (longUrl, shortCode, callback) => {
  const statement = db.prepare(`INSERT INTO urls (url, shortCode) VALUES (?, ?)`);
  statement.run(longUrl, shortCode, function(err) {
    callback(err, { id: this.lastID, long_url: longUrl, short_code: shortCode });
  });
  statement.finalize();
};

// Function to retrieve a URL by shortcode or all if 'all' is passed
const getUrl = (shortCode, callback) => {
  if (shortCode === 'all') {
    db.all(`SELECT * FROM urls`, [], (err, rows) => {
      callback(err, rows);
    });
  } else {
    db.get(`SELECT * FROM urls WHERE shortCode = ?`, [shortCode], (err, row) => {
      callback(err, row);
    });
  }
};

// Function to increment visit counter for a given shortCode
const incrementVisit = (shortCode) => {
  db.run(`UPDATE urls SET visits = visits + 1 WHERE shortCode = ?`, [shortCode], function(err) {
  });
};

// Export the database functions
module.exports = {
  insertUrl,
  getUrl,
  incrementVisit
};
