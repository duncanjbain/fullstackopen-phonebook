require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler);

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

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id).then((person) => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  }).catch(error => next(error))
});

app.put("/api/persons/:id", (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person,{ new: true }).then((updatedPerson) => {
    res.json(updatedPerson)
  }).catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(result => {
    res.status(204).end()
  }).catch(error => next(error))
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
