import express from 'express'
import cors from 'cors'
// import records from './routes/record.js'
import workout_events from './routes/workout_event.js'
import accounts from './routes/accounts.js'

const PORT = process.env.PORT || 5050
const app = express()

app.use(cors())
app.use(express.json())
app.use('/workout_events', workout_events)
app.use('/', accounts)

// start the Express server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

