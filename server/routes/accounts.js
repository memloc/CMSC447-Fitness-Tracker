import express from 'express'
import db from '../db/connection.js'
import bcrypt from 'bcrypt'
import sha256 from 'crypto-js/sha256.js'

const router = express.Router()

// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).send('Email and password are required')

        const existingUser = await db.collection('accounts').findOne({ email })
        if (existingUser) return res.status(400).send('Account with this email already exists')

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

		// TODO: Research better approach for this.. collision would not be good
		// Give users a unique id for to use as key for user account data
		const userId = sha256(req.body.email).toString()

        let newDocument = {
			userId: userId,
            email: req.body.email,
            password: hashedPassword
        }

        let collextion = await db.collection('accounts')
        let result = await collextion.insertOne(newDocument)
        res.status(201).send({ message: 'Account created successfully', result })

    } catch (err) {
        // console.error('Registration Error:', err)
        res.status(500).send(`Error registering account: ${err}`)
    }
})

// Login route
router.post('/login', async (req, res) => {
    try {
        const user = await db.collection('accounts').findOne({ email: req.body.email })
        if (!user) return res.status(404).send('Account not found')

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordMatch) return res.status(401).send('Invalid email or password')

        res.status(200).send({ message: 'Login successful', user })

    } catch (err) {
        // console.error('Login Error:', err)
        res.status(500).send(`Error logging in: ${err}`)
    }
})

export default router
