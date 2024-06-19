const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000; // Use the provided port or default to 3000

// Define routes or middleware here
// For example:
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
