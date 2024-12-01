import React, { useState } from 'react'

const Workout = ({ workout, onSave, onDelete }) => {
	const [exercises, setExercises] = useState(workout.exercises || [])
    const [name, setName] = useState(workout.title)
    const [isNew, setIsNew] = useState(true)
	const [isPopupOpen, setIsPopupOpen] = useState(false)
	// This is starting to get ridiculous... I know.
	const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false)
	const [functionToExecute, setFunctionToExecute] = useState(null);


	const addExercise = (type) => {
		setExercises([...exercises, { name: '', type: type, sets: [] }])
		setIsPopupOpen(false)
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

		console.log(newExercises[index].type)
		if (newExercises[index].type == 'weighted')
		{
			// Create a new exercise 'set'
			const newSet = { weight: '', reps: '' }
			// Add it to the exercise index 
			newExercises[index].sets = [...newExercises[index].sets, newSet]
		}
		else if (newExercises[index]['type'] == 'timed')
		{
			const newSet = { intensity: '', time: '' }
			// Add it to the exercise index 
			newExercises[index].sets = [...newExercises[index].sets, newSet]
		}


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
		setFunctionToExecute(() => () => {
			// Copy old exercises
			const newExercises = [...exercises]
			
			newExercises[exerciseIndex].sets =
				newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex)
			
			setExercises(newExercises)
		})
		
		setIsConfirmPopupOpen(true)
	}

	const removeExercise = (exerciseIndex) => {
		setFunctionToExecute(() => () => {
			// Copy old exercises
			const newExercises = exercises.filter((_, i) => i !== exerciseIndex)
			setExercises(newExercises)
		})
		
		setIsConfirmPopupOpen(true)
	}

    const handleSave = () => {
        onSave({ ...workout, title: name, exercises })
    }

    const handleDelete = () => {
        onDelete({ ...workout, title: name, exercises })
    }

	const handleConfirm = () => {
		// Execute the function if it was specified.. 
		if (functionToExecute) {
			functionToExecute()
		}

		setFunctionToExecute(null)
		setIsConfirmPopupOpen(false)
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
					<input className="items-center border mt-2 mb-2 w-[55%]"
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
                            hover:bg-red-600 hover:w-28 hover:h-6 
                            hover:text-white hover:opacity-100"
							onClick={ () => removeExercise(exerciseIndex) }
						>
							<div className="opacity-[01%] transition-opacity hover:opacity-100">
								Delete 
							</div>
						</button>
					</div>

					<div class="border-b w-5/6 mx-auto border-gray-300 mb-2"></div> 

					{ exercise.type === 'weighted' && exercise.sets.map((set, setIndex) => (
						<div key={setIndex} className="flex justify-center items-center">
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
								onClick={ () => removeExerciseSet(exerciseIndex, setIndex) }
							>
							-
							</button>
						</div>
					))}
					{ exercise.type === 'timed' && exercise.sets.map((set, setIndex) => (
						<div key={setIndex} className="flex justify-center items-center">
							<select
								className="border rounded w-2/3 text-center shadow mt-2 mb-2 ml-2 mr-2
                                w-[30%]"
								value={set.intensity}
								onChange={(e) =>
									updateExerciseSet(exerciseIndex, setIndex, 'intensity', e.target.value)
								}
								placeholder="Intensity"
							>
								<option value="Low">Low Intensity</option>
								<option value="Medium">Medium Intensity</option>
								<option value="High">High Intensity</option>
							</select>
							<input
								className="border rounded w-1/5 text-center shadow mt-2 mb-2 ml-2 mr-2
                                w-40"
								type="text"
								value={set.time}
								onChange={(e) =>
									updateExerciseSet(exerciseIndex, setIndex, 'time', e.target.value)
								}
								placeholder="HH:MM:SS"
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


			{ isPopupOpen && (
				<div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-lg font-semibold mb-4">Select Exercise Type</h3>
						<div className="space-y-4">
							<button
								onClick={() => addExercise('weighted')}
								className="px-4 py-2 bg-green-500 text-white rounded-md w-full"
							>
								Weighted
							</button>
							<button
								onClick={() => addExercise('timed')}
								className="px-4 py-2 bg-blue-500 text-white shadow rounded-md w-full"
							>
								Timed
							</button>
						</div>
						<button
							onClick={() => setIsPopupOpen(false)}
							className="mt-4 text-sm text-gray-500 hover:underline"
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			{ isConfirmPopupOpen && (
				<div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h3 className="text-lg font-semibold mb-4">You sure?</h3>
						<div className="space-y-4">
							<button
								onClick={ handleConfirm }
								className="px-4 py-2 bg-gray-300 text-white rounded-md w-full
transition-colors duration-300 hover:bg-green-400"
							>
								Yes
							</button>
							<button
								onClick={() => setIsConfirmPopupOpen(false)}
								className="px-4 py-2 bg-red-500 text-white shadow rounded-md w-full"
							>
								No
							</button>
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-3 justify-center items-center mt-8 mb-2">
				<button
					className="bg-blue-800 text-white font-bold py-1 px-2 rounded \
				ml-3 mr-1"
					onClick={() => setIsPopupOpen(true)}
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
				ml-1 mr-3"
					onClick={handleDelete}
				>
					Delete Workout
				</button>
			</div>
        </div>
    )
}

export default Workout
