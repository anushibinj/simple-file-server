/**
 * Main Entry Point for the Simple File Server
 */
import app from "./app.js";

// Server Configuration from Environment Variables
const SERVER_PORT = process.env.SERVER_PORT || 3000;

/**
 * Start the Express Server
 */
app.listen(SERVER_PORT, () => {
	console.log(`Upload server running on port ${SERVER_PORT}`);
});
