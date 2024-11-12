import express from 'express'

// This will help us connect to the database
import db from '../db/connection.js'

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from 'mongodb'

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /workout_events.
const router = express.Router()

// To help get all workout calendar events
router.get('/', async (req, res) => {
    let collection = await db.collection('workout_events')
    let results = await collection.find({}).toArray()
    res.send(results).status(200)
})

// Get a single workout calendar event
router.get('/:id', async (req, res) => {
    let collection = await db.collection('workout_events')
    let query = { _id: new ObjectId(req.params.id) }
    let result = await collection.findOne(query)

    if (!result) res.send('Not found').status(404)
    else res.send(result).status(200)
})

// The following is for creating a single new workout calendar event
router.post('/', async (req, res) => {
    try {
        let newDocument = {
            id: req.body.id,
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            exercises: req.body.exercises,
        }
        let collection = await db.collection('workout_events')
        let result = await collection.insertOne(newDocument)
        res.send(result).status(204)
    } catch (err) {
        console.error(err)
        res.status(500).send('Error adding workout calendar event.')
    }
})

// This section will help you update a record by id.
router.patch('/:id', async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) }
        const updates = {
            $set: {
                id: req.body.id,
                title: req.body.title,
                start: req.body.start,
                end: req.body.end,
                exercises: req.body.exercises,
            },
        }

        let collection = await db.collection('workout_events')
        let result = await collection.updateOne(query, updates)
        res.send(result).status(200)
    } catch (err) {
        console.error(err)
        res.status(500).send('Error updating workout calendar event.')
    }
})

// This section will help you delete a record
router.delete('/:id', async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) }
        const collection = db.collection('workout_events')
        let result = await collection.deleteOne(query)

        res.send(result).status(200)
    } catch (err) {
        console.error(err)
        res.status(500).send('Error deleting workout calendar event.')
    }
})

export default router
