import React, { useState } from 'react'

const Workout = ({ workout, onSave, onDelete }) => {
    const [sets, setSets] = useState(workout.sets || [])
    const [name, setName] = useState(workout.title)
    const [isNew, setIsNew] = useState(true)

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

    const handleDelete = () => {
        onDelete({ ...workout, title: name, sets })
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
                    <button
                        className="bg-blue-800 text-white font-bold py-1 px-2 \
                        rounded m-1"
                        onClick={() => removeSet(index)}
                    >
                        Remove Set
                    </button>
                </div>
            ))}
            <button
                className="bg-blue-800 text-white font-bold py-1 px-2 rounded \
				ml-1 mr-1"
                onClick={addSet}
            >
                Add Set
            </button>
            <button
                className="bg-blue-800 text-white font-bold py-1 px-2 rounded \
				ml-1 mr-1"
                onClick={handleSave}
            >
                Save Workout
            </button>
            <button
                className="bg-blue-800 text-white font-bold py-1 px-2 rounded \
				ml-1 mr-1"
                onClick={handleDelete}
            >
                Delete Workout
            </button>
        </div>
    )
}

export default Workout
