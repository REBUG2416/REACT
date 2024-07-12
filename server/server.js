const express = require('express');
const cors = require('cors'); // Import the cors module
/* const sql = require('msnodesqlv8'); // Import the mssql module*/
const port = process.env.PORT || 5000;

const app = express();
app.use(cors()); 
app.use(express.json()); 


require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://notepad_33ls_user:xShB2eK1AanukQFaZmJEFVOdKa5hTLHq@dpg-cp0u33021fec738b8aog-a.oregon-postgres.render.com/notepad_33ls",
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

 //   model schema
const Note = sequelize.define(
  "Note",
  {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "Notes",
  }
);

const Login = sequelize.define(
  "Login",
  {
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Logins",
  }
);

app.get("/api/Logins", async (req, res) => {
  console.log("in");
  try {
    const Logins = await Login.findAll();
    res.json(Logins);
  } catch (err) {
    console.error("Error fetching Logins:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/Logins", async(req, res) => {

    const {Username,Password} = req.body;

  try{
    const Logins = await Login.create({
      Username,
      Password,
    });

   res.status(201).send("Login added successfully.");}
   
  catch (err) {
    console.error("Error adding Login:", err);
    res.status(500).send("Internal Server Error");
}
})

app.get("/api/Notes", async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/api/notes", async (req, res) => {
  console.log("Received request body:", req.body);
  const { id, title, body, created_at } = req.body;

  // Validate request body
  if (!id || !created_at) {
    res.status(400).send("Title, body, and created_at are required.");
    return;
  }

  try {
    const notes = await Note.create({
      title,
      body,
      created_at: new Date(created_at)
    });
    res.status(201).send("Note added successfully.");
  } catch (err) {
    console.error("Error adding note:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findByPk(id);
    if (!note) {
      res.status(404).send("Note not found.");
      return;
    }

    await note.destroy();
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).send("Internal Server Error");
  }
});

// PUT endpoint to edit a note by ID
app.put("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, body, created_at } = req.body;

  // Validate request body
  if (!title || !body || !created_at) {
    res.status(400).send("Title, body, and created_at are required.");
    return;
  }

  try {
    const note = await Note.findByPk(id);
    if (!note) {
      res.status(404).send("Note not found.");
      return;
    }

    note.title = title;
    note.body = body;
    note.created_at = new Date(created_at);

    await note.save();
    res.json(note);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});


