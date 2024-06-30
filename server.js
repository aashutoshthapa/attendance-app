const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./attendance.db');

// Create necessary tables
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY, name TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, name TEXT, class_id INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY, student_id INTEGER, date TEXT, status INTEGER)");
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/verify', (req, res) => {
    const key = req.body.key;
    if (key === 'zatilsirhandsome') {
        res.redirect('/zatilsir');
    } else {
        res.send('Invalid key');
    }
});

app.get('/zatilsir', (req, res) => {
    res.sendFile(__dirname + '/public/zatilsir.html');
});

app.get('/students', (req, res) => {
    db.all("SELECT * FROM classes", [], (err, rows) => {
        res.json(rows);
    });
});

app.get('/class/:id', (req, res) => {
    const classId = req.params.id;
    db.all("SELECT * FROM students WHERE class_id = ?", [classId], (err, rows) => {
        res.json(rows);
    });
});

app.post('/create-class', (req, res) => {
    const className = req.body.className;
    db.run("INSERT INTO classes (name) VALUES (?)", [className], function(err) {
        if (err) {
            res.send('Error creating class');
        } else {
            res.redirect('/zatilsir');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
