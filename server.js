const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./database');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/create-class') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name } = JSON.parse(body);
            db.run('INSERT INTO classes (name) VALUES (?)', [name], function(err) {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, id: this.lastID }));
                }
            });
        });
    } else if (req.method === 'GET' && req.url === '/get-classes') {
        db.all('SELECT name FROM classes', [], (err, rows) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ classes: rows.map(row => row.name) }));
            }
        });
    } else {
        let filePath = '.' + req.url;
        if (filePath === './') {
            filePath = './index.html';
        }

        const extname = path.extname(filePath);
        let contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code == 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 Not Found</h1>');
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
