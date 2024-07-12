const express = require("express");
const cors = require("cors");
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

// Model schema
const Note = sequelize.define(
  "Note",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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

// GET /api/Logins endpoint
app.get("/api/Logins", async (req, res) => {
  try {
    const [logins,metadata] = await sequelize.query(`
   SELECT username,password,code FROM public."Logins";
  `);
    res.json(logins);
    console.log(logins);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).send("Internal Server Error");
  }
});

// POST /api/Logins endpoint
app.post("/api/Logins", async (req, res) => {
  const { username, password, code } = req.body;

  try {
    const newLogin = await Login.create({ username, password, code });
    res.status(201).send("Login added successfully.");
  } catch (err) {
    console.error("Error adding Login:", err);
    res.status(500).send("Internal Server Error");
  }
});

// GET /api/Notes endpoint
app.get("/api/Notes", async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).send("Internal Server Error");
  }
});

// POST /api/notes endpoint
app.post("/api/notes", async (req, res) => {
  console.log("Received request body:", req.body);
  const { title, body, created_at } = req.body;

  // Validate request body
  if (!title || !body || !created_at) {
    res.status(400).send("Title, body, and created_at are required.");
    return;
  }

  try {
    const newNote = await Note.create({
      title,
      body,
      created_at: new Date(created_at),
    });
    res.status(201).send("Note added successfully.");
  } catch (err) {
    console.error("Error adding note:", err);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE /api/notes/:id endpoint
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

// PUT /api/notes/:id endpoint
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
  console.log(`App listening at http://localhost:${port}`);
});
