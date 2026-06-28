const express = require("express");

const radioRoutes = require("./routes/radio.routes");

/**
 * Application entry point.
 * Configures the Express server, registers API routes
 * and starts the HTTP server.
 */
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/radio", radioRoutes);

app.listen(PORT, () => {
  console.log(`CloudBeats API running on port ${PORT}`);
});