const dotenv = require("dotenv");

const app = require("./app"); // Import the app

dotenv.config();

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
