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

  //   fs.readFile("./db/db.json")//trying to read data to append to it later - the idea is that this will format the db better
  //   .then((response) => {
  //   console.log(response);
  // return response;})
  //   .then((data)=>{
  //     let stringData = JSON.stringify(data);//creating variable so the db data is in string format for easier joining
  //   })
  //   .catch((error) =>
  //   console.err(err));

    // const noteString = JSON.stringify(newNote);//stringified user input

    fs.appendFileSync('./db/db.json', JSON.stringify(newNote, null, 2), "utf-8", (err) =>
    err ? console.error(err) : console.log(`New note for ${newNote.title} has been added to JSON file`));

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
