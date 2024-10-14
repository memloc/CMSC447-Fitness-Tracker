import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Workout from './Workout'

const localizer = momentLocalizer(moment)

const MyCalendar = () => {
    const [events, setEvents] = useState([])
    const [selectedWorkout, setSelectedWorkout] = useState(null)

    const handleSelect = ({ start, end }) => {
        const title = window.prompt('Enter a title for your workout:')
        if (title) {
            const newWorkout = {
                id: events.length,
                start,
                end,
                title,
                sets: [],
            }
            setEvents([...events, newWorkout])
            setSelectedWorkout(newWorkout)
        }
    }

    const handleEventClick = (event) => {
        setSelectedWorkout(event)
    }

    const handleSaveWorkout = (updatedWorkout) => {
        const newEvents = events.map((event) =>
            event.id === updatedWorkout.id ? updatedWorkout : event
        )
        setEvents(newEvents)
        setSelectedWorkout(null)
    }

    const handleDeleteWorkout = (id) => {
        const newEvents = events.filter((event) => event.id !== id)
        setEvents(newEvents)
        setSelectedWorkout(null)
    }

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleSelect}
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
