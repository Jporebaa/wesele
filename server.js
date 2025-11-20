const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "public", "uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage });

app.post("/upload", upload.single("photo"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("Nie przesłano pliku.");
    }
    res.status(200).send("OK");
});

app.get("/photos", (req, res) => {
    const uploadsPath = path.join(__dirname, "public", "uploads");
    fs.readdir(uploadsPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: err.toString() });
        }
        res.json(files);
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serwer działa lokalnie i w sieci: http://0.0.0.0:${PORT}`);
});
