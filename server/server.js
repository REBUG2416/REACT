const express = require('express');
const cors = require('cors'); // Import the cors module
/* const sql = require('msnodesqlv8'); // Import the mssql module
const port = process.env.PORT || 5000;
 */
const app = express();
app.use(cors()); 
app.use(express.json()); 

/* const config = {
  server: "LAPTOP-P2QLB5J2", // Replace with your SQL Server instance
  database: "NotePad",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true, // Use Windows authentication
    enableArithAbort: true, // Required for mssql library
  },
};

 *//* const connectionString =
  "Driver={ODBC Driver 17 for SQL Server};Server=LAPTOP-P2QLB5J2;Database=NotePad;Trusted_Connection=yes;";





app.get("/api/notes", (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error("Error occurred while opening connection:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const query = "SELECT * FROM Notes";

    conn.query(query, (err, results) => {
      conn.close();

      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.json(results);
    });
  });
});

// POST endpoint to add data
app.post("/api/notes", (req, res) => {
    console.log("Received request body:", req.body);
  const data = req.body; // Assuming the request body contains title and content for the new note

  // Validate request body
  if (!data.id || !data.created_at) {
    res.status(400).send("Title and content are required.");
    return;
  }

  const date = new Date(data.created_at);

  
  const query = `INSERT INTO Notes (title,body,created_at) VALUES ('${data.title}', '${data.body}', '${date.toISOString().slice(0, 19).replace('T', ' ')}')`;

  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error("Error occurred while opening connection:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    conn.query(query, (err, result) => {
      conn.close();

      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(201).send("Note added successfully.");
    });
  });
});
 */
app.listen(port,() => {
  console.log("Server started on port 5000");
});