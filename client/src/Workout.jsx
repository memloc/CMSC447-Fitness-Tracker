import React, { useState } from 'react'

const Workout = ({ workout, onSave, onDelete }) => {
    const [sets, setSets] = useState(workout.sets || [])
    const [name, setName] = useState(workout.title)

    const addSet = () => {
        setSets([...sets, { weight: '', reps: '' }])
    }

    const updateSet = (index, field, value) => {
        const newSets = [...sets]
        newSets[index][field] = value
        setSets(newSets)
    }

    const removeSet = (index) => {
        const newSets = sets.filter((_, i) => i !== index)
        setSets(newSets)
    }

    const handleSave = () => {
        onSave({ ...workout, title: name, sets })
    }

    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workout Name"
            />
            {sets.map((set, index) => (
                <div key={index}>
                    <input
                        type="number"
                        value={set.weight}
                        onChange={(e) =>
                            updateSet(index, 'weight', e.target.value)
                        }
                        placeholder="Weight"
                    />
                    <input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                            updateSet(index, 'reps', e.target.value)
                        }
                        placeholder="Reps"
                    />
                    <button onClick={() => removeSet(index)}>Remove Set</button>
                </div>
            ))}
            <button onClick={addSet}>Add Set</button>
            <button onClick={handleSave}>Save Workout</button>
            <button onClick={() => onDelete(workout.id)}>Delete Workout</button>
        </div>
    )
}

export default Workout
