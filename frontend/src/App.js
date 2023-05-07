import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import Number from './components/Number.js'
import Footer from './components/Footer.js'
import Notification from './components/Notification.js'

const baseUrl = 'http://localhost:3001'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('test')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()


    if (persons.map(person => person.name).includes(newName)) {
      window.alert(`${newName} is already added to phonebook`)
      return;
    }

    const newPerson = { name: newName, number: newNumber}
    console.log(event.target.value)

    axios.post(`${baseUrl}/api/persons`, newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
    window.alert(`${newName} is added to phonebook`)
  }

  const handleOnChange = (event) => {

    console.log(event.target.value)
    setNewName(event.target.value)
  }
  
  const renderPersons = () => {
    
    if (!filter.length) {
      return <ul>{persons.map(person => <Number key={person.name} name={person.name} number={person.number} handler={() => deleteHandler(person.id, person.name)}/>)}</ul>
    } else {
      return <ul>{persons.filter(person => person.name.includes(filter)).map(person => <Number key={person.name} name={person.name} number={person.number} handler={() => deleteHandler(person.id, person.name)}/>)}</ul>
    }
    
  }

  const handleNumberChange = (event) => {

    setNewNumber(event.target.value)
  }

  useEffect(() => {
    console.log('effect')

    const eventHandler = response => {
      console.log('promise fullfilled')
      setPersons(response.data)
    }

    axios.get(`${baseUrl}/api/persons`).then(eventHandler)
  }, [])

  const handleFilter = (event) => {
    event.preventDefault()

    setFilter(event.target.value)
  }

  const deleteHandler = (key, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      axios.delete(`${baseUrl}/api/persons/${key}`).then(response => 
        setPersons(persons.filter(
          person => person.name != name
          )
        )
      )
      .catch(error => {
        setErrorMessage(
          `Phone number of '${name}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <form onSubmit={handleSubmit}>
        <div>
          filter shown with <input value={filter} onChange={handleFilter} />
        </div>

        
        <h2>Add a number</h2>
        <div>
          name: <input value={newName} onChange={handleOnChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {!persons.length ? '...' : renderPersons()}
      <Footer />
    </div>
  )
}


export default App;
