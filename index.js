const express = require('express')
const uuid = require('uuid-random');
const morgan = require('morgan');
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

morgan.token('reqBody', function(req, res) {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody')); // This is a modified version of morgan's tiny predefined format string.)

let persons =[
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/api/persons/', (req, res) => {
  res.json(persons)
  res.status(200).end()
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if(person) {
  return res.json(person).status(200)
  }
  res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.get('/api/info', (req,res) => {
  const phonebookSize = persons.length;
  const currentDate = new Date();
  res.send(`The Phonebook has ${phonebookSize} entries and the time is ${currentDate}`)
})

app.post('/api/persons', (req,res) => {
  const newPerson = req.body;
  if(!newPerson.name) {
    return res.status(400).send({Error: "name missing"})
  }
  if(!newPerson.number) {
    return res.status(400).send({Error: "number missing"})
  }
  if(persons.find(person => person.name == newPerson.name)) {
    return res.status(400).send({Error: "name already exists"})
  }
  newPerson.id = uuid();
  persons = persons.concat(newPerson)
  res.json(newPerson)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)