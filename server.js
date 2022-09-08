const { randomUUID } = require("crypto");
const express = require("express");
const { fstat } = require("fs");
const path = require("path");
const db = require("./db/db.json");
const fs = require('fs');

const PORT = process.env.PORT || 3001;
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
  res.sendFile(path.join(__dirname, "/public/notes.html"));

  console.info(`${req.method} was received to view notes.html`);
});

  //
app.get("/api/notes", (req, res) => {
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
    db.push(newNote);//take the database.json file array and push the newNote

    fs.writeFile('./db/db.json', JSON.stringify(db), (err) =>{//do not use writeFileSync because it ignores callback
    err ? console.error(err) : console.log('writeFileSync was successful')});

    const response = {
    status: 'sucess',
    body: newNote,
  };
  console.log(response);
  res.status(201).json(JSON.stringify(response));
  
  }else{
    res.status(500).json('Error in adding new note');
  }  
});

//DELETE notes
app.delete("/api/notes/:notes_id", (req, res) => {
  console.info(`${req.method} was recieved`);

  // const {id} = req.params;
  const paramsId= req.params.notes_id; //this is the same as above but not deconstructed
  
  const index = db.findIndex(db => {
    console.log(paramsId);
    return paramsId;
  })

  console.log(`this is the index: ${index}`);

  if(index === paramsId) {
    db.splice(paramsId);
    console.log(db);
    fs.writeFile('./db/db.json', JSON.stringify(db), (err) =>{//do not use writeFileSync because it ignores callback
      err ? console.error(err) : console.log('writeFileSync was successful')});
    } else {
    res.status(400).json('the id you entered does not exist');
  }
});

app.listen(PORT, () => {
  console.log(`Express server listening, http://localhost:${PORT}`);
});
