import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";
import app from "../app.js";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/tmp/test-uploads";

describe("Simple File Server API", () => {

	// Setup: ensure the upload directory exists
	beforeAll(() => {
		if (!fs.existsSync(UPLOAD_DIR)) {
			fs.mkdirSync(UPLOAD_DIR, { recursive: true });
		}
	});

	// Cleanup: remove uploaded files after tests
	afterAll(() => {
		if (fs.existsSync(UPLOAD_DIR)) {
			const files = fs.readdirSync(UPLOAD_DIR);
			for (const file of files) {
				fs.unlinkSync(path.join(UPLOAD_DIR, file));
			}
		}
	});

	it("should have a health check endpoint", async () => {
		const response = await request(app).get("/health");
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ status: "ok" });
	});

	it("should upload a file successfully", async () => {
		const filePath = "test-file.txt";
		fs.writeFileSync(filePath, "test content");

		const response = await request(app)
			.post("/upload")
			.attach("file", filePath);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("url");

		const urlParts = response.body.url.split("/");
		const filename = urlParts[urlParts.length - 1];

		// Verify file exists on disk
		expect(fs.existsSync(path.join(UPLOAD_DIR, filename))).toBe(true);

		// Cleanup local test file
		fs.unlinkSync(filePath);
	});

	it("should return 400 if no file is uploaded", async () => {
		const response = await request(app)
			.post("/upload");

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: "No file uploaded" });
	});

	it("should serve uploaded files statically", async () => {
		const filePath = "test-serve.txt";
		fs.writeFileSync(filePath, "hello world");

		// 1. Upload the file
		const uploadResponse = await request(app)
			.post("/upload")
			.attach("file", filePath);

		const urlParts = uploadResponse.body.url.split("/");
		const filename = urlParts[urlParts.length - 1];

		// 2. Try to fetch the file
		const fetchResponse = await request(app).get(`/${filename}`);
		expect(fetchResponse.status).toBe(200);
		expect(fetchResponse.text).toBe("hello world");

		// Cleanup local test file
		fs.unlinkSync(filePath);
	});

    it("should return 404 for non-existent files", async () => {
        const response = await request(app).get("/non-existent-file.txt");
        expect(response.status).toBe(404);
    });
});
