require("dotenv").config();
const express = require("express");
const uuid = require("uuid-random");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const { response } = require("express");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("reqBody", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody"
  )
); // This is a modified version of morgan's tiny predefined format string.)

app.get("/api/persons/", (req, res) => {
  Person.find({}).then((person) => {
    res.json(person);
  }).catch(error => console.log(error.message));
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    if (person) {
      return res.json(person).status(200);
    }
    res.status(404).end();
  }).catch(error => console.log(error.message));
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.get("/api/info", (req, res) => {
  const phonebookSize = persons.length;
  const currentDate = new Date();
  res.send(
    `The Phonebook has ${phonebookSize} entries and the time is ${currentDate}`
  );
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).send({ Error: "name missing" });
  }
  if (!body.number) {
    return res.status(400).send({ Error: "number missing" });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(savedPerson => {
    res.json(savedPerson)
  })

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
