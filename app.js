import express from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";

const SERVER_BASE_URL = process.env.SERVER_BASE_URL || "http://localhost:3000";
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/srv/public-files";

const app = express();

// serve files publicly (GET /filename.png)
app.use(express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
	destination: UPLOAD_DIR,
	filename: (_, file, cb) => {
		console.log(`file received: ${file.originalname}`);
		const name = crypto.randomUUID() + path.extname(file.originalname);
		cb(null, name);
	},
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
	console.log(`file uploaded: ${req.file.filename}`);
	res.json({
		url: `${SERVER_BASE_URL}/${req.file.filename}`,
	});
});

app.listen(SERVER_PORT, () => {
	console.log(`Upload server running on port ${SERVER_PORT}`);
});
