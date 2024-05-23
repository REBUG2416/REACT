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



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create-post", async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPost = await post.create({ title, content });
    res.json(newPost);
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/notes", async (req, res) => {
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

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});


