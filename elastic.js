// Requiring the ES package as well as initiating a client with the node on the localserver
const es = require('elasticsearch')
const client = new es.Client({
    hosts: [ 'http://localhost:9200' ]
})

// Logs the client's health out to the console for confirmation
const healthCheck = client.ping({
    requestTimeout: 30000,
}, err => {
    if (err) {
        console.log('Error: ES is down')
    } else {
        console.log('ES is up and running!')
    }
})

// Creating an index for blogs (anonymous function to prevent it from executing as the server.js reads the file)
const createIndex = async (indexName) => { 
    var body = await client.indices.create({
    index: indexName.toLowerCase()
}, (err, resp) => {
    if (err) {
        console.log(err)
    } else {
        console.log('Create', resp) // Confirmation message
    }

    return body
})}

// Adding documents to the index of choice
const createDoc = async (doc, index) => {
    var body = await client.index({
        index,
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // Creating a new UUID for the document (optional)
        type: '_doc',
        body: doc
    }, (err, resp) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Create', resp) // Confirmation message
        }
    })
    // Send the body of the response back
    return body
}

// Updating a doc within an index of choice
const updateDoc = async (id, newDoc, index) => {
    var { body } = await client.update({
        index,
        type: '_doc',
        id,
        body: { doc: newDoc } //NB: How to insert the data
    }, (err, resp) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Updated', resp) // Confirmation message
        }
    })
    // Send the body of the response back
    return body
}

// Removing a doc from within an index of choice
const removeDoc = async (id, index) => {
    var { body } = await client.delete({
        index,
        type: '_doc',
        id,
    }, (err, resp) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Deleted', resp) // Confirmation message
        }
    })
    // Send the body of the response back
    return body
}

// Retrieve all by index
const getAll = async (index) => {
    var res = await client.search({
        index,
        body: {
            query: {
                match_all: {}
            }
        }
    })
    // Send the docs of the response back
    return res.hits.hits
}

// Retrieve one by index and ID {
const getOne = async (index, id) => {
    var res = await client.search({
        index,
        body: {
            query: {
                match: {
                    _id: id
                }
            }
        }
    })
    // Sending the doc back
    return res.hits.hits
}

// Exporting the functions and constants
module.exports = { healthCheck, createIndex, createDoc, updateDoc, removeDoc, getAll, getOne }