import React, { useState, getEffect, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Workout from './Workout'

const localizer = momentLocalizer(moment)

const MyCalendar = () => {
    const [events, setEvents] = useState([])
    const [selectedWorkout, setSelectedWorkout] = useState(null)
	const navigate = useNavigate()

    // Fetches the WorkoutEvents from the database.
    useEffect(() => {
        async function getWorkoutEvents() {
            const response = await fetch(
                `http://localhost:5050/workout_events/`
            )
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`
                console.error(message)
                return
            }
            const workouts = await response.json()

			/* TODO: Remove console.log for production builds */
			for (const workout of workouts) {
				console.log(`Fetched: Workout ObjectID: ${workout._id}\n`)
			}

            setEvents(workouts)
        }
        getWorkoutEvents()
        return
    }, [events.length])

	/* TODO: Maybe cancel button on workout event create? */
	/* handleEventCreateCancel() ... // Delete the blank workout from db */

    const handleEventCreate = ({ start, end }) => {
        const title = window.prompt('Enter a title for your workout:')
        if (title) {
            const newWorkout = {
                id: events.length,
				isNew: 1,
                start,
                end,
                title,
                sets: [],
            }

			// Must also post the blank workout being created to the DB
			// to fix issue of disappearing events during creation
			handleSaveWorkout(newWorkout)

            setEvents([...events, newWorkout])
            setSelectedWorkout(newWorkout)
        }
    }

    const handleEventClick = (event) => {
		/* TODO: Remove console.log for production builds */
		console.log(`Clicked existing workout`,
					`\nid=${event.id}`,
					`\nObjectID=${event._id}\n`,
					`${JSON.stringify(event)}`)

        setSelectedWorkout(event)
    }

    async function handleSaveWorkout(updatedWorkout)  {
		// Get the updatedWorkout object id
		try {
		 	let response
		 	if (updatedWorkout.isNew) {
				/* TODO: Disable console.log in production builds */
				console.log(`Attempting to save new workout`,
							`\nid=${updatedWorkout.id}`,
							`\nObjectID=${updatedWorkout._id}\n`,
							`${JSON.stringify(updatedWorkout)}`)

		 		// Set the workout.IsNew to false since its now being saved
		 		updatedWorkout.isNew = false

		 		// Workout is new so POST the workout to /workout_events
		 		response = await fetch(`http://localhost:5050/workout_events`,{
		 			method: 'POST',
		 			headers: {
		 				'Content-Type': 'application/json',
		 			},
		 			body: JSON.stringify(updatedWorkout),
		 		})
		 	} else {
				/* TODO: Disable console.log in production builds */
				console.log(`Attempting to patch existing workout`,
							`\nid=${updatedWorkout.id}`,
							`\nObjectID=${updatedWorkout._id}\n`,
							`${JSON.stringify(updatedWorkout)}`)

		 		// Update is not new so PATCH the workout_event of id
		 		response = await fetch(
		 			`http://localhost:5050/workout_events/${updatedWorkout._id}`,
		 			{
		 				method: 'PATCH',
		 				headers: {
		 					'Content-Type': 'application/json',
		 				},
		 				body: JSON.stringify(updatedWorkout),
		 			}
		 		)
		 	} 
		 	if (!response.ok) {
		 		throw new Error(`HTTP error! status: ${response.status}`)
		 	}
		} catch (error) {
		 	console.error(
		 		`A problem occurred with fetching workout event: `,
		 		error
		 	)
		} finally {
		 	const newEvents = events.map((event) =>
		 		event.id === updatedWorkout.id ? updatedWorkout : event
		 	)
		 	setEvents(newEvents)
		 	setSelectedWorkout(null)
			navigate('/')
		}
    }

    async function handleDeleteWorkout(workout) {
		// Try to delete the workout event from the db
		try {
			/* TODO: Disable console.log in production builds */
			console.log(`Attempting to delete workout`,
						`\nid=${workout.id}`,
						`\nObjectID=${workout._id}\n`,
						`${JSON.stringify(workout)}`)

			const response = await fetch(
				`http://localhost:5050/workout_events/${workout._id}`, {
					method: 'DELETE',
				})
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
		} catch (error) {
			console.error(
				`A problem occurred with deleting workout event:`,
				error
			)
		} finally {
			const newEvents = events.filter((event) => event.id !== workout.id)
			setEvents(newEvents)
			setSelectedWorkout(null)
			navigate('/')
		}
    }

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleEventCreate}
                onSelectEvent={handleEventClick}
            />
            {selectedWorkout && (
                <Workout
                    workout={selectedWorkout}
                    onSave={handleSaveWorkout}
                    onDelete={handleDeleteWorkout}
                />
            )}
        </div>
    )
}

export default MyCalendar
