const express = require('express')
const app = express()

const persons = {
  "persons": [
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
    },
    {
      "name": "Cindy Zhang",
      "number": "123",
      "id": 5
    }
  ]
}.persons

const cors = require('cors')

app.use(cors())

app.get('/info', (request, response) => {
  const result = 
    `<div>
    <p> Phonebook has info for ${persons.length} people </p>
    <p> ${new Date()} </p>
    </div>`

  response.send(result)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  console.log(id, person)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  console.log(id, persons)
  response.status(204).end()
})

app.use(express.json())

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  persons.forEach(person => {
    if (person.name === body.name) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
  })

  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id)) 
    : 0
  
  const newPerson = {
    name: body.name,
    number: body.number,
    id: maxId + 1
  }

  persons = persons.concat(newPerson)

  response.json(persons)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})