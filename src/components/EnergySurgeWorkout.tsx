import { motion } from 'motion/react';
import { ArrowLeft, Zap, Play, Pause, RotateCcw, Check, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface EnergySurgeWorkoutProps {
  onBack: () => void;
  onComplete: () => void;
  exercises?: string[];
}

export function EnergySurgeWorkout({ onBack, onComplete, exercises: exerciseList }: EnergySurgeWorkoutProps) {
  const parsedExercises =
    exerciseList && exerciseList.length > 0
      ? exerciseList.map((name) => ({ name, duration: 30 }))
      : [
          { name: '20 jumping jacks to release tension', duration: 30 },
          { name: '10 power squats with arm raises', duration: 30 },
          { name: '30-second plank for core stability', duration: 30 },
          { name: '15 shoulder rolls to release upper body', duration: 30 },
        ];

  const [currentExercise, setCurrentExercise] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const exercises = parsedExercises;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (!completedExercises.includes(currentExercise)) {
        setCompletedExercises([...completedExercises, currentExercise]);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, currentExercise, completedExercises]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(exercises[currentExercise].duration);
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setTimeLeft(exercises[currentExercise + 1].duration);
      setIsActive(false);
    }
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setTimeLeft(exercises[currentExercise - 1].duration);
      setIsActive(false);
    }
  };

  const allCompleted = completedExercises.length === exercises.length;

  // Call onComplete when all exercises are done
  useEffect(() => {
    if (allCompleted) {
      onComplete();
    }
  }, [allCompleted, onComplete]);

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 relative">
          {/* Logo - Top Right */}
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <Brain className="size-6 text-teal-500" />
            <span className="text-slate-600">NeuroSync</span>
          </div>

          <motion.button
            onClick={onBack}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-slate-500 hover:text-teal-500 transition-colors mb-4"
          >
            <ArrowLeft className="size-5" />
            <span>Back to Plan</span>
          </motion.button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400/30 to-red-400/30 backdrop-blur-sm shadow-[inset_2px_2px_8px_rgba(255,255,255,0.5),inset_-2px_-2px_8px_rgba(163,177,198,0.2)]">
              <Zap className="size-6 text-orange-500/80" />
            </div>
            <div>
              <h2 className="text-slate-600">Energy Surge Workout</h2>
              <p className="text-slate-500">4 minutes total</p>
            </div>
          </div>
        </div>

        {/* Current Exercise Card */}
        <motion.div
          key={currentExercise}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-[#FAFBFF] rounded-3xl p-8 mb-6 shadow-[8px_8px_24px_rgba(163,177,198,0.15),-8px_-8px_24px_rgba(255,255,255,0.8)]"
        >
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-6">
            {exercises.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  completedExercises.includes(index)
                    ? 'bg-gradient-to-r from-teal-400 to-blue-400'
                    : index === currentExercise
                    ? 'bg-gradient-to-r from-orange-400 to-red-400'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-8">
            <p className="text-slate-400 text-sm mb-2">Exercise {currentExercise + 1} of {exercises.length}</p>
            <h3 className="text-slate-700 mb-6">{exercises[currentExercise].name}</h3>

            {/* Timer */}
            <div className="mb-8">
              <div className="relative inline-flex items-center justify-center w-48 h-48 mb-4">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-200"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 88 * (1 - timeLeft / exercises[currentExercise].duration)
                    }`}
                    className="transition-all duration-1000"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fb923c" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-slate-700 text-5xl">{timeLeft}</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm">seconds remaining</p>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 justify-center mb-6">
              {!isActive ? (
                <Button
                  onClick={handleStart}
                  disabled={timeLeft === 0}
                  className="bg-gradient-to-r from-orange-400/60 to-red-400/60 hover:from-orange-400/70 hover:to-red-400/70 text-white rounded-2xl px-8 shadow-[4px_4px_12px_rgba(251,146,60,0.2),-2px_-2px_8px_rgba(255,255,255,0.5)] border-0"
                >
                  <Play className="size-4 mr-2" />
                  {timeLeft === 0 ? 'Completed' : 'Start'}
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  className="bg-gradient-to-r from-orange-400/60 to-red-400/60 hover:from-orange-400/70 hover:to-red-400/70 text-white rounded-2xl px-8 shadow-[4px_4px_12px_rgba(251,146,60,0.2),-2px_-2px_8px_rgba(255,255,255,0.5)] border-0"
                >
                  <Pause className="size-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button
                onClick={handleReset}
                variant="outline"
                className="rounded-2xl border-slate-200/50 text-slate-600 shadow-[2px_2px_8px_rgba(163,177,198,0.1),-2px_-2px_8px_rgba(255,255,255,0.5)]"
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentExercise === 0}
              variant="outline"
              className="flex-1 rounded-2xl border-slate-200/50 text-slate-600 shadow-[2px_2px_8px_rgba(163,177,198,0.1),-2px_-2px_8px_rgba(255,255,255,0.5)] disabled:opacity-30"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentExercise === exercises.length - 1}
              className="flex-1 bg-gradient-to-r from-teal-400/60 to-blue-400/60 hover:from-teal-400/70 hover:to-blue-400/70 text-white rounded-2xl shadow-[4px_4px_12px_rgba(45,212,191,0.2),-2px_-2px_8px_rgba(255,255,255,0.5)] border-0 disabled:opacity-30"
            >
              Next Exercise
            </Button>
          </div>
        </motion.div>

        {/* Exercise List */}
        <div className="bg-[#FAFBFF] rounded-3xl p-6 shadow-[8px_8px_24px_rgba(163,177,198,0.15),-8px_-8px_24px_rgba(255,255,255,0.8)]">
          <h3 className="text-slate-600 mb-4">All Exercises</h3>
          <ul className="space-y-3">
            {exercises.map((exercise, index) => (
              <li
                key={index}
                className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${
                  index === currentExercise
                    ? 'bg-gradient-to-r from-orange-50/50 to-red-50/50'
                    : completedExercises.includes(index)
                    ? 'bg-gradient-to-r from-teal-50/50 to-blue-50/50'
                    : 'bg-slate-50/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    completedExercises.includes(index)
                      ? 'bg-gradient-to-br from-teal-400/30 to-blue-400/30'
                      : 'bg-slate-200/50'
                  }`}>
                    {completedExercises.includes(index) ? (
                      <Check className="size-4 text-teal-500" />
                    ) : (
                      <span className="text-slate-500 text-sm">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    completedExercises.includes(index) ? 'text-slate-400 line-through' : 'text-slate-600'
                  }`}>
                    {exercise.name}
                  </span>
                </div>
                <span className="text-slate-400 text-sm">{exercise.duration}s</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Completion Message */}
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-r from-teal-50/50 to-blue-50/50 rounded-3xl p-6 text-center shadow-[8px_8px_24px_rgba(163,177,198,0.15),-8px_-8px_24px_rgba(255,255,255,0.8)]"
          >
            <div className="mb-3">🎉</div>
            <h3 className="text-slate-700 mb-2">Workout Complete!</h3>
            <p className="text-slate-500 text-sm mb-4">Great job! You've completed all exercises.</p>
            <Button
              onClick={onBack}
              className="bg-gradient-to-r from-teal-400/60 to-blue-400/60 hover:from-teal-400/70 hover:to-blue-400/70 text-white rounded-2xl px-8 shadow-[4px_4px_12px_rgba(45,212,191,0.2),-2px_-2px_8px_rgba(255,255,255,0.5)] border-0"
            >
              Back to Plan
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
