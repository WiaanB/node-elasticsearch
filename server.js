// Importing my modules that I'll be using
const express = require('express')
const cors = require('cors')

// Starting the app, including cors and JSON parser
const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:8080'
}))

// Importing from the elastic.js file for the ES functions
const { healthCheck, createIndex, createDoc, updateDoc, removeDoc, getAll, getOne } = require('./elastic.js') // Displays health by default, as it logs in elastic.js

// Creating an index with the specified name
app.post('/create/index', (req, res) => {
    createIndex(req.body.index).then(response => {
        res.json({ message: "Success" })
    }).catch(err => { res.sendStatus(504) })
})

// Creating a document for a provided index
app.post('/create/:id/doc', (req, res) => {
    createDoc(req.body, req.params.id).then(response => {
        res.json({ message: "Success" })
    }).catch(err => { res.send(err) })
})

// Updating a doc by their given ID and index
app.put('/update/:index/:id', (req, res) => {
    updateDoc(req.params.id, req.body, req.params.index).then(response => {
        res.json({ message: "Success" })
    }).catch(err => { res.send(err) }) 
})

// Deleting a doc by their given ID and index
app.delete('/delete/:index/:id', (req, res) => {
    removeDoc(req.params.id, req.params.index).then(response => {
        res.json({ message: "Success" })
    }).catch(err => { res.send(err) })
})

// Retrieve all docs from a given index
app.get('/:index/all', (req, res) => {
    getAll(req.params.index).then(response => {
        res.json(response)
    }).catch(err => { res.send(err) })
})

// Retrieve a single doc from a given index
app.get('/:index/:id', (req, res) => {
    getOne(req.params.index, req.params.id).then(response => {
        res.json({ message: "success", response})
    }).catch(err => { res.send(err) })
})

// Adding the server's port to listen and a callback to confirm it's live
app.listen(3000, () => { console.log('The server is running on port 3000') })