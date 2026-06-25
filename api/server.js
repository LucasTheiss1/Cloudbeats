const express = require("express");
const cors = require("cors");
require("dotenv").config();

const radioRoutes = require("./routes/radio.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/radio", radioRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CloudBeats API running on port ${PORT}`);
});