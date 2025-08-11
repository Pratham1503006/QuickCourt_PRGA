import express from "express";
import cors from "cors";
import client from "./database.js";

const app = express();
app.use(cors());
const PORT = 3001;

app.get("/api/db-status", (req, res) => {
    client.query("SELECT * FROM users", (err, res2) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Data at server: ", res2.rows);
            res.json({ connected: true, data:res2.rows});
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
