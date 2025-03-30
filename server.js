   //  Load environment variables
require("dotenv").config();

//  Import dependencies
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

//  Initialize Express app
const app = express();
app.use(cors());

//  Database Configuration (Clever Cloud MySQL)
const db = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check Database Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error(" Database connection error:", err);
    } else {
        console.log(" Connected to Clever Cloud MySQL Database");
        connection.release();
    }
});

//  Prevent MySQL from closing idle connections
setInterval(() => {
    db.query("SELECT 1", (err) => {
        if (err) console.error("MySQL Keep-Alive Error:", err.message);
    });
}, 60000); // Runs every 60 seconds (1 minute)

//  Root Route
app.get("/", (req, res) => {
    res.send("API is running! Use endpoints like /colleges/:id or /search_college");
});

// Fetch College by ID
app.get("/colleges/:id", (req, res) => {
    const collegeId = req.params.id;
    db.query("SELECT * FROM colleges WHERE id = ?", [collegeId], (err, results) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results.length > 0 ? results[0] : { error: "College not found" });
    });
});

//  Search College by Name
app.get("/search_college", (req, res) => {
    const collegeName = req.query.name;
    if (!collegeName) return res.status(400).json({ error: "College name is required" });

    db.query("SELECT id, name FROM colleges WHERE name LIKE ?", [`%${collegeName}%`], (err, results) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results.length > 0 ? results : { error: "College not found" });
    });
});

// Fetch Courses by College ID
app.get("/courses", (req, res) => {
    const collegeId = req.query.college_id;
    if (!collegeId) return res.status(400).json({ error: "College ID is required" });

    db.query("SELECT * FROM courses WHERE college_id = ?", [collegeId], (err, results) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results);
    });
});

// Start the Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


