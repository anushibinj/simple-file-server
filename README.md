# Simple File Server

A lightweight Node.js application built with Express and Multer to upload and serve files publicly.

## Features

- **File Upload**: Upload files via multipart/form-data.
- **Static Serving**: Automatically serves uploaded files.
- **Containerized**: Docker and Docker Compose support.
- **Tested**: Unit tests with Vitest and high coverage.
- **CI/CD**: GitHub Actions integration for testing and build verification.

## Prerequisites

- Node.js (v20 or higher recommended)
- Docker & Docker Compose (optional)

## Getting Started

### Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the server**:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000` by default.

### Environment Variables

You can customize the server using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Port the server listens on | `3000` |
| `UPLOAD_DIR` | Directory where files are stored | `/srv/public-files` |
| `SERVER_BASE_URL` | Base URL for returned file links | `http://localhost:<port>` |

### Running with Docker

1. **Build and start the containers**:
   ```bash
   docker-compose up -d
   ```
   This will start the server and set up a persistent volume for your uploads.

## API Reference

### Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Response**: `{"status": "ok"}`

### Upload File
- **URL**: `/upload`
- **Method**: `POST`
- **Body**: `multipart/form-data`
- **Field**: `file` (the file to upload)
- **Response**: `{"url": "http://localhost:3000/<random-uuid>.<ext>"}`

## Testing

Run unit tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## License

MIT
