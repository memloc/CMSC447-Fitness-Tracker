import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameMonth,
  isEqual,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Calendar Day Component
const CalendarDay = ({ day, isSelected, hasWorkout, onClick, currentMonth }) => {
  const isCurrentDay = isToday(day);
  const isOtherMonth = !isSameMonth(day, currentMonth);

  return (
    <button
      onClick={() => onClick(day)}
      className={`
        relative aspect-square p-1
        ${isOtherMonth ? 'text-gray-500' : 'text-white'}
      `}
    >
      <div className={`
        relative flex items-center justify-center w-full h-full rounded-full
        text-sm font-medium transition-all duration-200
        ${isCurrentDay ? 'bg-blue-500 text-white' : ''}
        ${isSelected && !isCurrentDay ? 'bg-[rgba(255,255,255,0.1)]' : ''}
        ${!isSelected && !isCurrentDay ? 'hover:bg-[rgba(255,255,255,0.1)]' : ''}
      `}>
        {format(day, 'd')}
        {hasWorkout && !isCurrentDay && (
          <div className="absolute bottom-1.5 h-1 w-1 rounded-full bg-blue-500"></div>
        )}
      </div>
    </button>
  );
};

// Exercise Set Component
const ExerciseSet = ({ set, index, onUpdate, onDelete, isEditing }) => {
  if (isEditing) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.1)]">
        <div className="flex-1">
          <input
            type="number"
            value={set.reps}
            onChange={(e) => onUpdate('reps', e.target.value)}
            className="ios-input w-full mb-2"
            placeholder="Reps"
          />
          <input
            type="number"
            value={set.weight}
            onChange={(e) => onUpdate('weight', e.target.value)}
            className="ios-input w-full"
            placeholder="Weight (lbs)"
          />
        </div>
        <button 
          onClick={onDelete}
          className="text-red-500 p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)]"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(255,255,255,0.1)]">
      <span className="text-gray-400">Set {index + 1}</span>
      <div className="text-white">
        {set.reps} reps • {set.weight} lbs
      </div>
    </div>
  );
};

// Exercise Component
const Exercise = ({ exercise, onUpdate, onDelete, onAddSet, onDeleteSet, isEditing }) => {
    return (
      <div className="mb-6 rounded-2xl bg-[rgba(255,255,255,0.05)] p-4">
        <div className="flex items-center justify-between mb-4">
          {isEditing ? (
            <input
              type="text"
              value={exercise.name}
              onChange={(e) => onUpdate(exercise.id, e.target.value)} // Updated this line
              className="ios-input flex-1 mr-2"
              placeholder="Exercise name"
            />
          ) : (
            <h3 className="text-lg font-semibold">{exercise.name}</h3>
          )}
          {isEditing && (
            <button
              onClick={() => onDelete(exercise.id)}
              className="text-red-500 p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)]"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
  
        <div className="space-y-3">
          {exercise.sets.map((set, idx) => (
            <ExerciseSet
              key={set.id}
              set={set}
              index={idx}
              isEditing={isEditing}
              onUpdate={(field, value) => onDeleteSet(exercise.id, set.id, field, value)}
              onDelete={() => onDeleteSet(exercise.id, set.id)}
            />
          ))}
        </div>
  
        {isEditing && (
          <button
            onClick={() => onAddSet(exercise.id)}
            className="mt-4 ios-button text-blue-400 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Set</span>
          </button>
        )}
      </div>
    );
  };

// Main Calendar Component
const FitnessCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [workouts, setWorkouts] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState({
    exercises: []
  });

  const getDaysInMonth = (date) => {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInMonth(currentMonth);

  const hasWorkout = (date) => {
    return workouts[format(date, 'yyyy-MM-dd')] !== undefined;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1));
  };

  const addNewExercise = () => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id: Date.now(),
          name: '',
          sets: [{ id: Date.now(), reps: '', weight: '' }]
        }
      ]
    }));
  };

  const updateExerciseName = (exerciseId, name) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => 
        exercise.id === exerciseId 
          ? { ...exercise, name: name }
          : exercise
      )
    }));
  };
  
  const updateSet = (exerciseId, setId, field, value) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.map(set => 
              set.id === setId ? { ...set, [field]: value } : set
            )
          };
        }
        return exercise;
      })
    }));
  };

  const addSetToExercise = (exerciseId) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: [...exercise.sets, { id: Date.now(), reps: '', weight: '' }]
          };
        }
        return exercise;
      })
    }));
  };

  const deleteSet = (exerciseId, setId) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.filter(set => set.id !== setId)
          };
        }
        return exercise;
      })
    }));
  };

  const deleteExercise = (exerciseId) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(exercise => exercise.id !== exerciseId)
    }));
  };

  const saveWorkout = () => {
    if (currentWorkout.exercises.length > 0) {
      setWorkouts(prev => ({
        ...prev,
        [format(selectedDate, 'yyyy-MM-dd')]: currentWorkout
      }));
    }
    setEditMode(false);
  };

  const loadWorkout = (date) => {
    setSelectedDate(date);
    const dateKey = format(date, 'yyyy-MM-dd');
    if (workouts[dateKey]) {
      setCurrentWorkout(workouts[dateKey]);
    } else {
      setCurrentWorkout({ exercises: [] });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Calendar Section */}
      <div className="rounded-2xl bg-[rgba(30,30,30,0.8)] ios-blur p-6">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigateMonth('prev')}
            className="p-2 text-blue-400"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button 
            onClick={() => navigateMonth('next')}
            className="p-2 text-blue-400"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-gray-400 text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map(day => (
            <CalendarDay
              key={day.toString()}
              day={day}
              isSelected={isEqual(selectedDate, day)}
              hasWorkout={hasWorkout(day)}
              onClick={loadWorkout}
              currentMonth={currentMonth}
            />
          ))}
        </div>
      </div>

      {/* Workout Section */}
      <div className="rounded-2xl bg-[rgba(30,30,30,0.8)] ios-blur p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {format(selectedDate, 'MMM d, yyyy')}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="p-2 text-blue-400 rounded-full hover:bg-[rgba(255,255,255,0.1)]"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
        {currentWorkout.exercises.map((exercise) => (
            <Exercise
                key={exercise.id}
                exercise={exercise}
                isEditing={editMode}
                onUpdate={updateExerciseName} // For exercise name updates
                onDelete={deleteExercise}
                onAddSet={addSetToExercise}
                onDeleteSet={updateSet} // For set updates
            />
            ))}
        </div>

        {editMode && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={addNewExercise}
              className="flex-1 bg-blue-500 ios-button text-white flex items-center justify-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Exercise</span>
            </button>
            <button
              onClick={saveWorkout}
              className="flex-1 bg-green-500 ios-button text-white"
            >
              Save
            </button>
          </div>
        )}

        {!editMode && currentWorkout.exercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-3">No workout logged for this day</p>
            <button
              onClick={() => setEditMode(true)}
              className="ios-button text-blue-400"
            >
              Add Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessCalendar;