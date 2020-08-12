const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const database = 'phonebook-app';

const nameToAdd = process.argv[3]
const numberToAdd = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.7gofu.mongodb.net/${database}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(nameToAdd && numberToAdd) {
const person = new Person({
  name: nameToAdd,
  number: numberToAdd
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})
} else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}