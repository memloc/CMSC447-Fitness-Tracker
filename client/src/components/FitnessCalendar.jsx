import React, { useState } from 'react';
import { Pencil, X, Plus, Trash2 } from 'lucide-react';
import SearchBar from './SearchBar';

const FitnessCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [workouts, setWorkouts] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEditMode(false);
  };

  const addWorkout = (date, workout) => {
    setWorkouts(prev => ({
      ...prev,
      [date]: [...(prev[date] || []), {
        ...workout,
        id: Math.random().toString(36).substr(2, 9)
      }]
    }));
  };

  const deleteWorkout = (date, workoutId) => {
    setWorkouts(prev => ({
      ...prev,
      [date]: prev[date].filter(w => w.id !== workoutId)
    }));
  };

  const deleteSet = (date, workoutId, setIndex) => {
    setWorkouts(prev => ({
      ...prev,
      [date]: prev[date].map(workout => {
        if (workout.id === workoutId) {
          const newSets = [...workout.sets];
          newSets.splice(setIndex, 1);
          return { ...workout, sets: newSets };
        }
        return workout;
      })
    }));
  };

  const dateContainsSearchedWorkout = (date) => {
    if (!searchTerm) return false;
    const dateWorkouts = workouts[date] || [];
    return dateWorkouts.some(workout => 
      workout.exercise.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="flex h-screen bg-black">
      <div className="w-1/2 p-6 flex flex-col">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <Calendar
          selectedDate={selectedDate}
          workouts={workouts}
          onDateClick={handleDateClick}
          dateContainsSearchedWorkout={dateContainsSearchedWorkout}
        />
      </div>

      <div className="w-1/2 border-l border-gray-800">
        <WorkoutDetails
          date={selectedDate}
          workouts={selectedDate ? (workouts[selectedDate] || []) : []}
          onAddWorkout={(workout) => addWorkout(selectedDate, workout)}
          onDeleteWorkout={(workoutId) => deleteWorkout(selectedDate, workoutId)}
          onDeleteSet={(workoutId, setIndex) => deleteSet(selectedDate, workoutId, setIndex)}
          editMode={editMode}
          setEditMode={setEditMode}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

const Calendar = ({ selectedDate, workouts, onDateClick, dateContainsSearchedWorkout }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const formatDate = (day) => {
    return `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-gray-400 hover:text-white transition-colors"
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
        >
          Previous
        </button>
        <h2 className="text-xl font-medium text-white">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          className="text-gray-400 hover:text-white transition-colors"
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-gray-500 text-sm font-medium p-2">{day}</div>
        ))}
        {days.map(day => {
          const date = formatDate(day);
          const hasWorkouts = workouts[date]?.length > 0;
          const isSelected = date === selectedDate;
          const matchesSearch = dateContainsSearchedWorkout(date);

          let buttonClasses = `
            aspect-square rounded-lg text-center transition-all p-2
            ${isSelected ? 'bg-orange-600 text-white' : 
              matchesSearch ? 'bg-orange-500 text-white ring-2 ring-orange-300 shadow-lg scale-105' :
              hasWorkouts ? 'bg-neutral-800 text-white' : 
              'bg-neutral-900 text-gray-400 hover:bg-neutral-800'}
            ${matchesSearch ? 'transform hover:scale-110' : 'hover:scale-105'}
            transition-all duration-200
          `;

          return (
            <button
              key={day}
              onClick={() => onDateClick(date)}
              className={buttonClasses}
            >
              <span className={`text-sm font-medium ${matchesSearch ? 'font-bold' : ''}`}>
                {day}
              </span>
              {hasWorkouts && (
                <div className={`text-xs mt-1 ${matchesSearch ? 'text-white' : 'opacity-75'}`}>
                  {workouts[date].length}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const WorkoutDetails = ({ date, workouts, onAddWorkout, onDeleteWorkout, onDeleteSet, editMode, setEditMode }) => {
  const [newWorkout, setNewWorkout] = useState({
    exercise: '',
    sets: []
  });

  const addSet = () => {
    setNewWorkout(prev => ({
      ...prev,
      sets: [...prev.sets, { reps: '', weight: '' }]
    }));
  };

  const updateSet = (index, field, value) => {
    setNewWorkout(prev => ({
      ...prev,
      sets: prev.sets.map((set, i) => 
        i === index ? { ...set, [field]: value } : set
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newWorkout.exercise && newWorkout.sets.length > 0) {
      onAddWorkout(newWorkout);
      setNewWorkout({ exercise: '', sets: [] });
    }
  };

  if (!date) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p className="text-lg">Select a date to view or add workouts</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <h2 className="text-xl font-medium text-white">Workouts for {date}</h2>
        <button 
          onClick={() => setEditMode(!editMode)}
          className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Pencil className={`w-5 h-5 ${editMode ? 'text-orange-500' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Existing workouts */}
        {workouts.map((workout) => (
          <div key={workout.id} className="bg-neutral-900 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-white">{workout.exercise}</h3>
              {editMode && (
                <button
                  onClick={() => onDeleteWorkout(workout.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              {workout.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex items-center justify-between text-gray-300 py-2 px-3 rounded bg-neutral-800">
                  <div>
                    <span className="text-sm text-gray-500 mr-2">Set {setIndex + 1}</span>
                    <span>{set.weight} lbs × {set.reps} reps</span>
                  </div>
                  {editMode && (
                    <button
                      onClick={() => onDeleteSet(workout.id, setIndex)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Add new workout form */}
        <form onSubmit={handleSubmit} className="bg-neutral-900 rounded-xl p-4 space-y-4">
          <input
            type="text"
            value={newWorkout.exercise}
            onChange={(e) => setNewWorkout(prev => ({ ...prev, exercise: e.target.value }))}
            placeholder="Exercise name"
            className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          />
          
          {newWorkout.sets.map((set, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="number"
                value={set.weight}
                onChange={(e) => updateSet(index, 'weight', e.target.value)}
                placeholder="Weight (lbs)"
                className="flex-1 bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <input
                type="number"
                value={set.reps}
                onChange={(e) => updateSet(index, 'reps', e.target.value)}
                placeholder="Reps"
                className="flex-1 bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          ))}
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={addSet}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-gray-300 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Set
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
            >
              Add Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FitnessCalendar;