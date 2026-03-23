const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'local.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to local.db SQLite database.');
        initDb();
    }
});

// Create Table if not exists
function initDb() {
    db.run(`CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT,
        alert_id TEXT,
        timestamp TEXT,
        latitude TEXT,
        longitude TEXT,
        received_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}


app.post('/api/sos', (req, res) => {
    const { sender, alert_id, timestamp, latitude, longitude } = req.body;
    
    const sql = `INSERT INTO alerts (sender, alert_id, timestamp, latitude, longitude) VALUES (?, ?, ?, ?, ?)`;
    const params = [sender, alert_id, timestamp, latitude, longitude];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        console.log(`[SOS RECEIVED] From: ${sender} | Loc: ${latitude}, ${longitude}`);
        res.json({
            "message": "success",
            "data": req.body,
            "id": this.lastID
        });
    });
});

// API: Get All Alerts (GET)
app.get('/api/sos', (req, res) => {
    const sql = "SELECT * FROM alerts ORDER BY id DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});