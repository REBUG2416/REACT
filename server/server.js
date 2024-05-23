const express = require('express');
const cors = require('cors'); // Import the cors module
/* const sql = require('msnodesqlv8'); // Import the mssql module*/
const port = process.env.PORT || 5000;

const app = express();
app.use(cors()); 
app.use(express.json()); 

app.listen(port,() => {
  console.log("Server started on port 5000");
});