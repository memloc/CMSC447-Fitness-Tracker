import express from 'express'

// This will help us connect to the database
import db from '../db/connection.js'

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from 'mongodb'

import sha256 from 'crypto-js/sha256.js'
// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /workout_events.
const router = express.Router()

// To help get all workout calendar events for user
router.get('/', async (req, res) => {
    let collection = await db.collection('workout_events')
	const userId = req.query.userId
    let results = await collection.find({ userId }).toArray()
    res.send(results).status(200)
})

// Get a single workout calendar event for user
router.get('/:id', async (req, res) => {
    let collection = await db.collection('workout_events')
	const userId = req.query.userId
	console.log(userId)
    let query = { _id: new ObjectId(req.params.id), userId }
    let result = await collection.findOne(query)

    if (!result) res.send('Not found').status(404)
    else res.send(result).status(200)
})

// The following is for creating a single new workout calendar event
router.post('/', async (req, res) => {
    try {
		// HACK: Store user id in every workout event... so users will only
		// get/post/patch to workouts associated with their userId (sha256 of
		// users email) added to session storage during login.
        let newDocument = {
			userId: req.body.userId, 
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
        // console.error(err)
        res.status(500).send(`Error adding workout calendar event: ${err}`)
    }
})

// This section will help you update a record by id.
router.patch('/:id', async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id), userId: req.body.userId }
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
        // console.error(err)
        res.status(500).send(`Error updating workout calendar event: ${err}`)
    }
})

// This section will help you delete a record
router.delete('/:id', async (req, res) => {
	const userId = req.query.userId
    try {
        const query = { _id: new ObjectId(req.params.id) }
        const collection = db.collection('workout_events')
        let result = await collection.deleteOne(query)

        res.send(result).status(200)
    } catch (err) {
        // console.error(err)
        res.status(500).send(`Error deleting workout calendar event ${err}`)
    }
})

export default router
