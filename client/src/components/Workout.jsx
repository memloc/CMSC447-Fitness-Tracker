import React, { useState } from 'react'

const Workout = ({ workout, onSave, onDelete }) => {
	const [exercises, setExercises] = useState(workout.exercises || [])
    const [name, setName] = useState(workout.title)
    const [isNew, setIsNew] = useState(true)


	const addExercise = () => {
		setExercises([...exercises, { name: '', sets: [] }])
	}

	const updateExercise = (index, field, value) => {
		// Copy old exercises
		const newExercises = [...exercises]
		newExercises[index][field] = value;
		setExercises(newExercises)
	}


	const addExerciseSet = (index) => {
		// Copy old exercises
		const newExercises = [...exercises]

		// Create a new exercise 'set'
		const newSet = { weight: '', reps: '' }

		// Add it to the exercise index 
		newExercises[index].sets = [...newExercises[index].sets, newSet]

		setExercises(newExercises)
	}

	const updateExerciseSet = (exerciseIndex, setIndex, field, value) => {
		// Copy old exercises
		const newExercises = [...exercises]

		newExercises[exerciseIndex].sets[setIndex] = {
			...newExercises[exerciseIndex].sets[setIndex], [field]: value,
		}

		setExercises(newExercises)
	}

	const removeExerciseSet = (exerciseIndex, setIndex) => {
		// Copy old exercises
		const newExercises = [...exercises]

		newExercises[exerciseIndex].sets =
			newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex)

		setExercises(newExercises)
	}

    const handleSave = () => {
        onSave({ ...workout, title: name, exercises })
    }

    const handleDelete = () => {
        onDelete({ ...workout, title: name, exercises })
    }

    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workout Name"
            />


			{exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex}>
                    <input
						className="border mt-2 mb-2"
                        type="text"
                        value={exercise.name}
                        onChange={(e) =>
                            updateExercise(exerciseIndex, 'name', e.target.value)
                        }
                        placeholder="Exercise Name"
                    />
					<button
						className="bg-blue-800 text-white font-bold pl-2 pr-2 \
                        rounded ml-2"
						onClick={ () => addExerciseSet(exerciseIndex) }
					>
					+
					</button>

					{exercise.sets.map((set, setIndex) => (
						<div key={setIndex}>
							<input
								className="border mt-2 mb-2"
								type="number"
								value={set.reps}
								onChange={(e) =>
									updateExerciseSet(exerciseIndex, setIndex, 'reps', e.target.value)
								}
								placeholder=""
							/>
							<input
								className="border mt-2 mb-2"
								type="number"
								value={set.weight}
								onChange={(e) =>
									updateExerciseSet(exerciseIndex, setIndex, 'weight', e.target.value)
								}
								placeholder=""
							/>
							<button
								className="bg-red-600 text-white font-bold rounded pl-2 pr-2 ml-2"
								onClick={() => removeExerciseSet(exerciseIndex, setIndex) }
							>
							-
							</button>

						</div>

					))}

				</div>
			))}

            <button
                className="bg-blue-800 text-white font-bold py-1 px-2 rounded \
				ml-1 mr-1"
                onClick={addExercise}
            >
                Add Exercise
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
