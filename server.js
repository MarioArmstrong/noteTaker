const { randomUUID } = require("crypto");
const express = require("express");
const { fstat } = require("fs");
const path = require("path");
const db = require("./db/db.json");
const fs = require('fs');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//GET static page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

//GET api/notes page
app.get("/notes", (req, res) => {
  // console.log(__filename, __dirname)
  res.sendFile(path.join(__dirname, "/public/notes.html"));

  console.info(`${req.method} was received to view notes.html`);
});

  //
app.get("/api/notes", (req, res) => {
  // console.log(res);
  console.info(`${req.method} request received for api/notes`);

  return res.json(db);
});

//GET error page
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/404.html"))
);
//POST to notes
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add to notes`);

  const {title, text} = req.body;

  if(title && text) {
    const newNote = {
      title,
      text,
      note_id: randomUUID(),
    }
    // console.log(db);
    db.push(newNote);
    // console.log(db);

    fs.writeFile('./db/db.json', JSON.stringify(db), (err) =>{
      console.log("HIT ME BABY ONE MORE TIME")
    err ? console.error(err) : console.log('writeFileSync was successful')});
  

    const response = {
    status: 'sucess',
    body: newNote,
  };
  console.log(response);
  res.status(201).json(response);
  
  }else{
    res.status(500).json('Error in adding new note');
  }  
}

);

app.listen(PORT, () => {
  console.log(`Express server listening, http://localhost:${PORT}`);
});
