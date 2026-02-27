import express from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

/**
 * Server Configuration from Environment Variables
 */
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/srv/public-files";

// Ensure upload directory exists to prevent runtime errors
if (!fs.existsSync(UPLOAD_DIR)) {
	fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const app = express();

/**
 * Middleware: Static File Serving
 *
 * Serves files publicly from the UPLOAD_DIR.
 * For example: GET /<filename.ext>
 */
app.use(express.static(UPLOAD_DIR));

/**
 * Multer Storage Configuration
 *
 * Configures how files are saved on the disk.
 * Filenames are generated as random UUIDs with original extensions for uniqueness.
 */
const storage = multer.diskStorage({
	destination: UPLOAD_DIR,
	filename: (_, file, cb) => {
		// Log the original filename of the received file
		console.log(`file received: ${file.originalname}`);
		// Generate a random UUID and keep the original file extension
		const name = crypto.randomUUID() + path.extname(file.originalname);
		cb(null, name);
	},
});

const upload = multer({ storage });

/**
 * Endpoint: File Upload
 *
 * HTTP Method: POST
 * Route: /upload
 * Body: multipart/form-data with a 'file' field
 */
app.post("/upload", upload.single("file"), (req, res) => {
	// If no file was provided in the request
	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}

	console.log(`file uploaded: ${req.file.filename}`);

	// Determine the base URL dynamically or from environment
	const serverBaseUrl = process.env.SERVER_BASE_URL || `${req.protocol}://${req.get("host")}`;

	// Respond with the public URL of the uploaded file
	res.json({
		url: `${serverBaseUrl}/${req.file.filename}`,
	});
});

/**
 * Health Check Endpoint
 */
app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

// Export the app for testing purposes
export default app;
