// database.js

const sqlite3 = require('sqlite3').verbose();

// Create/connect to a SQLite database
const db = new sqlite3.Database('./data/attendance.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create a table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Table "classes" created successfully.');
            }
        });
    }
});

module.exports = db;
