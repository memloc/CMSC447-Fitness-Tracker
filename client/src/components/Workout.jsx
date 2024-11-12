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

	const removeExercise = (exerciseIndex) => {
		// Copy old exercises
		const newExercises = exercises.filter((_, i) => i !== exerciseIndex)
		setExercises(newExercises)
	}

    const handleSave = () => {
        onSave({ ...workout, title: name, exercises })
    }

    const handleDelete = () => {
        onDelete({ ...workout, title: name, exercises })
    }

    return (
        <div className="grid lg:col-span-2 lg:ml-4 border rounded shadow">
            <input
				className="font-bold italic text-xl text-center mt-4 mb-1"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workout Name"
            />

			{exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex}
					 className="flex flex-wrap justify-center items-center border shadow bg-gray-100 m-2"
				>
					

                    <input
						className="items-center border mt-2 mb-2 w-[55%]"
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

					<div className="relative">
						<button
							className="flex top-1 right-1 flex justify-center
                            items-center bg-gray-200 text-white p-3 ml-2
                            rounded-full w-6 h-6 transition-all duration-500
                            text-opacity-0 hover:text-opacity-100
                            hover:bg-red-600 hover:w-28 hover:h-6 
                            hover:text-white hover:opacity-100"
						onClick={() => removeExercise(exerciseIndex)}
						>
							<span className="text-opacity-0
                                  group-hover:text-opacity-100 transition-all
                                  duration-500
                                ">
								Delete 
							</span>
					</button>
					</div>

					<div class="border-b w-5/6 mx-auto border-gray-300 mb-2"></div> 
					{exercise.sets.map((set, setIndex) => (
						<div key={setIndex}
							 className="flex justify-center items-center"
						>
							<input
								className="border rounded w-1/5 text-center shadow mt-2 mb-2 ml-2 mr-2
                                w-[30%]"
								type="number"
								value={set.reps}
								onChange={(e) =>
									updateExerciseSet(exerciseIndex, setIndex, 'reps', e.target.value)
								}
								placeholder="reps"
							/>
							x
							<input
								className="border rounded w-1/5 text-center shadow mt-2 mb-2 ml-2 mr-2
                                w-[30%]"
								type="number"
								value={set.weight}
								onChange={(e) =>
									updateExerciseSet(exerciseIndex, setIndex, 'weight', e.target.value)
								}
								placeholder="weight"
							/>
							<button
								className="bg-gray-300 text-white font-bold rounded pl-2 pr-2 ml-2
                                transition-colors duration-300 hover:bg-red-400 transition-colors"
								onClick={() => removeExerciseSet(exerciseIndex, setIndex) }
							>
							-
							</button>
						</div>
					))}

				</div>
			))}

			<div className="mt-8">
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
        </div>
    )
}

export default Workout
