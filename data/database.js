import sqlite3Package from 'sqlite3';
const sqlite3 = sqlite3Package.verbose();
import path from 'path';
import { fileURLToPath } from 'url';

// Calculate the directory name of the current module file.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'urls.db');

// Open a connection to the SQLite database.
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

/**
 * Create the URLs table in the SQLite database if it doesn't already exist.
 */
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

// Ensure the URLs table is created at startup.
createUrlsTable();

/**
 * Insert a new URL into the database.
 *
 * @param {string} longUrl - The original URL to shorten.
 * @param {string} shortCode - The shortcode that maps to the original URL.
 * @returns {Promise} - A promise that resolves to the operation success.
 */
const insertUrl = async (longUrl, shortCode) => {
  return new Promise((resolve, reject) => {
    const statement = db.prepare(`INSERT INTO urls (url, shortCode) VALUES (?, ?)`);
    statement.run(longUrl, shortCode, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, longUrl, shortCode });
      }
    });
    statement.finalize();
  });
};

/**
 * Retrieve one or all URL entries from the database.
 *
 * @param {string} shortCode - The shortcode to look up, or 'all' to fetch all records.
 * @returns {Promise} - A promise that resolves to the fetched URL data.
 */
const getUrl = (shortCode) => {
  return new Promise((resolve, reject) => {
    if (shortCode === 'all') {
      db.all(`SELECT * FROM urls`, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    } else {
      db.get(`SELECT * FROM urls WHERE shortCode = ?`, [shortCode], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    }
  });
};

/**
 * Increment the visit count of a URL in the database.
 *
 * @param {string} shortCode - The shortcode of the URL to increment the visit count for.
 * @returns {Promise} - A promise that resolves to the operation success.
 */
const incrementVisit = (shortCode) => {
  return new Promise((resolve, reject) =>{
    db.run(`UPDATE urls SET visits = visits + 1 WHERE shortCode = ?`, [shortCode], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

export { insertUrl, getUrl, incrementVisit };