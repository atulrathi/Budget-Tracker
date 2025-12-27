const http = require("http");
const app = require("./app");
const dbconnect = require("./config/Databaseconnection")
require("dotenv").config();

dbconnect();
const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 SpendWise Server running on http://localhost:${PORT}`);
});
