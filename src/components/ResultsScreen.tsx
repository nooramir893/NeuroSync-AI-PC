import { motion } from 'motion/react';
import { RefreshCw, Save, Zap, Target, Music, Lightbulb, TrendingUp, Wind, ArrowLeft, Brain, Check } from 'lucide-react';
import { Button } from './ui/button';
import { BoxBreathing } from './BoxBreathing';
import { useState } from 'react';
import { EnergySurgeWorkout } from './EnergySurgeWorkout';

interface ResultsScreenProps {
  onRegenerate: () => void;
  onBack?: () => void;
  transcript?: string;
  emotionLabel?: string;
  analysis?: { sensing: string; plan: string } | null;
  loading?: boolean;
  error?: string | null;
  workoutExercises?: string[];
  habit?: { title: string; label: string; description: string } | null;
  insight?: { insight: string } | null;
  prediction?: { prediction: string } | null;
  planHelp?: { plan: string } | null;
  showWorkout?: boolean; // whether to show the workout section at all
  showMusic?: boolean;
}

export function ResultsScreen({ onRegenerate, onBack, transcript, emotionLabel, analysis, loading, error, workoutExercises, habit, insight, prediction, planHelp, showWorkout = true, showMusic = true }: ResultsScreenProps) {
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [habitMarked, setHabitMarked] = useState(false);
  const [showWorkoutView, setShowWorkoutView] = useState(false);

  if (showWorkoutView) {
    return <EnergySurgeWorkout exercises={workoutExercises} onBack={() => setShowWorkoutView(false)} onComplete={() => setWorkoutCompleted(true)} />;
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with Back Button */}
        <div className="mb-8 relative">
          {/* Logo - Top Right */}
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <Brain className="size-6 text-teal-500" />
            <span className="text-slate-600">NeuroSync</span>
          </div>
          
          {onBack && (
            <motion.button
              onClick={onBack}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-slate-500 hover:text-teal-500 transition-colors mb-4"
            >
              <ArrowLeft className="size-5" />
              <span>Back</span>
            </motion.button>
          )}
          <h2 className="text-slate-600 mb-2">Your Personalized Plan</h2>
          <p className="text-slate-500">Adapted to your current state</p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* AI Emotional Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-teal-50/50 to-blue-50/50 rounded-3xl p-6 shadow-[8px_8px_24px_rgba(163,177,198,0.15),-8px_-8px_24px_rgba(255,255,255,0.8)] border border-teal-100/50"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-400/40 to-blue-400/40 backdrop-blur-sm shadow-[inset_2px_2px_8px_rgba(255,255,255,0.5),inset_-2px_-2px_8px_rgba(163,177,198,0.2)]">
                <Brain className="size-6 text-teal-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-slate-700 mb-1">Your Current State</h3>
                <p className="text-slate-500 text-sm">AI Analysis from voice input</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* What we detected */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_2px_2px_8px_rgba(163,177,198,0.05)]">
                <p className="text-slate-500 text-sm mb-2">What I'm sensing:</p>
                {loading ? (
                  <p className="text-slate-400 animate-pulse">Analyzing your check-in...</p>
                ) : error ? (
                  <p className="text-slate-500">Analysis unavailable: {error}</p>
                ) : analysis?.sensing ? (
                  <p className="text-slate-700">{analysis.sensing}</p>
                ) : (
                  <p className="text-slate-500">We couldn't detect your current state this time.</p>
                )}
              </div>

              {/* How the plan helps */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_2px_2px_8px_rgba(163,177,198,0.05)]">
                <p className="text-slate-500 text-sm mb-2">How this plan helps:</p>
                {loading ? (
                  <p className="text-slate-400 animate-pulse">Crafting your plan...</p>
                ) : error ? (
                  <p className="text-slate-500">We'll still guide you with the next steps.</p>
                ) : planHelp?.plan ? (
                  <p className="text-slate-700 whitespace-pre-line">{planHelp.plan}</p>
                ) : (
                  <p className="text-slate-500">We’ll tailor the plan once we have more context.</p>
                )}
              </div>

              {/* Transcript & tone summary */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-[inset_2px_2px_8px_rgba(163,177,198,0.05)]">
                <p className="text-slate-500 text-sm mb-2">What you shared (transcript):</p>
                <p className="text-slate-700">{transcript || 'No transcript captured this time.'}</p>
                {emotionLabel && (
                  <p className="text-slate-500 text-sm mt-2">Tone detected: <span className="text-teal-600">{emotionLabel}</span></p>
                )}
              </div>
            </div>
          </motion.div>

          {showWorkout && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#FAFBFF] rounded-3xl p-6 shadow-[8px_8px_24px_rgba(163,177,198,0.15),-8px_-8px_24px_rgba(255,255,255,0.8)] hover:shadow-[10px_10px_30px_rgba(163,177,198,0.2),-10px_-10px_30px_rgba(255,255,255,0.9)] transition-shadow duration-300"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400/30 to-red-400/30 backdrop-blur-sm shadow-[inset_2px_2px_8px_rgba(255,255,255,0.5),inset_-2px_-2px_8px_rgba(163,177,198,0.2)]">
                  <Zap className="size-6 text-orange-500/80" />
                </div>
                <div>
                  <h3 className="text-slate-600">Energy Surge Workout</h3>
                  <p className="text-slate-400 text-sm">4 minutes</p>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {(workoutExercises && workoutExercises.length > 0
                  ? workoutExercises
                  : [
                      '20 jumping jacks to release tension',
                      '10 power squats with arm raises',
                      '30-second plank for core stability',
                      '15 shoulder rolls to release upper body',
                    ]
                ).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-500">
                    <span className="text-teal-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => setShowWorkoutView(true)}
                disabled={workoutCompleted}
                className={`w-full rounded-2xl shadow-[4px_4px_12px_rgba(251,146,60,0.2),-2px_-2px_8px_rgba(255,255,255,0.5)] border-0 ${
                  workoutCompleted
                    ? 'bg-gradient-to-r from-teal-400/60 to-blue-400/60 text-white cursor-not-allowed opacity-70'
                    : 'bg-gradient-to-r from-orange-400/60 to-red-400/60 hover:from-orange-400/70 hover:to-red-400/70 text-white'
                }`}
              >
                {workoutCompleted ? (
                  <>
                    <Check className="size-4 mr-2" />
                    Workout Completed
                  </>
                ) : (
                  'Start Workout'
                )}
              </Button>
            </motion.div>
          )}

          {/* Habit for Today */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FAFBFF] rounded-3xl p-6 shadow-[8px_8px_24px_rgba(163,177,198,0.15),-8px_-8px_24px_rgba(255,255,255,0.8)] hover:shadow-[10px_10px_30px_rgba(163,177,198,0.2),-10px_-10px_30px_rgba(255,255,255,0.9)] transition-shadow duration-300"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-400/30 to-blue-400/30 backdrop-blur-sm shadow-[inset_2px_2px_8px_rgba(255,255,255,0.5),inset_-2px_-2px_8px_rgba(163,177,198,0.2)]">
                <Target className="size-6 text-teal-500/80" />
              </div>
              <div>
                <h3 className="text-slate-600">Habit for Today</h3>
                <p className="text-slate-400 text-sm">{habit?.label || 'Confidence builder'}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-teal-50/50 to-blue-50/50 rounded-2xl p-4 mb-4 shadow-[inset_2px_2px_8px_rgba(163,177,198,0.1)]">
              <p className="text-slate-600">
                {habit?.title || 'Practice presentation opening 3× with power poses'}
              </p>
            </div>
            <p className="text-slate-500 text-sm mb-4">
              {habit?.description || 'Stand in a confident stance, take deep breaths, and run through your opening. This will help channel nervous energy into confidence.'}
            </p>
            <Button
              onClick={() => setHabitMarked(true)}
              disabled={habitMarked}
              variant="outline"
              className={`w-full rounded-2xl shadow-[2px_2px_8px_rgba(163,177,198,0.1),-2px_-2px_8px_rgba(255,255,255,0.5)] ${
                habitMarked
                  ? 'bg-gradient-to-r from-teal-400/60 to-blue-400/60 text-white border-0 cursor-not-allowed'
                  : 'border-teal-200/50 hover:bg-teal-50/30 text-slate-600'
              }`}
            >
              {habitMarked ? (
                <>
                  <Check className="size-4 mr-2" />
                  Marked
                </>
              ) : (
                'Mark Complete'
              )}
            </Button>
          </motion.div>

          {showMusic && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-b from-purple-50/40 via-pink-50/30 to-purple-50/40 rounded-3xl p-8 shadow-[8px_8px_32px_rgba(192,132,252,0.12),-8px_-8px_32px_rgba(255,255,255,0.9)] hover:shadow-[10px_10px_40px_rgba(192,132,252,0.18),-10px_-10px_40px_rgba(255,255,255,0.95)] transition-all duration-500 border border-purple-100/30"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-300/40 via-pink-300/30 to-purple-400/40 backdrop-blur-md shadow-[inset_2px_2px_12px_rgba(255,255,255,0.6),inset_-2px_-2px_12px_rgba(192,132,252,0.2),4px_4px_16px_rgba(192,132,252,0.15)]">
                  <Music className="size-7 text-transparent bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 bg-clip-text" style={{ filter: 'drop-shadow(0 2px 4px rgba(192,132,252,0.3))' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-700 mb-1">Your Music Mood Boost</h3>
                  <p className="text-purple-400/70 text-sm">Tailored for your current state</p>
                </div>
              </div>

              {/* Dynamic Playlist Display */}
              <div className="bg-gradient-to-br from-purple-100/50 via-pink-50/40 to-purple-50/50 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-[inset_3px_3px_12px_rgba(192,132,252,0.08),inset_-2px_-2px_8px_rgba(255,255,255,0.6)] border border-white/40 relative overflow-hidden">
                {/* Subtle background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 via-transparent to-pink-200/20 blur-2xl" />
                
                <div className="relative flex items-center gap-6">
                  {/* Album Art / Visualizer Placeholder */}
                  <motion.div 
                    animate={{ 
                      boxShadow: [
                        '4px 4px 16px rgba(192,132,252,0.2), -2px -2px 12px rgba(255,255,255,0.6)',
                        '6px 6px 20px rgba(236,72,153,0.25), -3px -3px 14px rgba(255,255,255,0.7)',
                        '4px 4px 16px rgba(192,132,252,0.2), -2px -2px 12px rgba(255,255,255,0.6)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-300/60 via-pink-300/50 to-purple-400/60 backdrop-blur-md flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                  >
                    {/* Animated soundwave/visualizer effect */}
                    <motion.div
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-t from-pink-400/30 to-transparent"
                    />
                    <Music className="size-10 text-white/90 relative z-10" style={{ filter: 'drop-shadow(0 2px 6px rgba(192,132,252,0.4))' }} />
                  </motion.div>

                  {/* Playlist Info */}
                  <div className="flex-1">
                    <h4 className="text-slate-700 mb-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent" style={{ fontWeight: 600 }}>
                      Uplifting Flow & Focus
                    </h4>
                    <p className="text-purple-500/70 text-sm">Electronic, Ambient, Soothing</p>
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <Button className="w-full bg-gradient-to-r from-purple-400/70 via-pink-400/60 to-purple-400/70 hover:from-purple-400/85 hover:via-pink-400/75 hover:to-purple-400/85 text-white rounded-3xl shadow-[6px_6px_20px_rgba(192,132,252,0.25),-3px_-3px_12px_rgba(255,255,255,0.6)] hover:shadow-[8px_8px_28px_rgba(192,132,252,0.35),-4px_-4px_16px_rgba(255,255,255,0.7)] border-0 transition-all duration-300 py-6">
                <Music className="size-5 mr-2" />
                Play Playlist
              </Button>
            </motion.div>
          )}

          {/* Insight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#FAFBFF] rounded-3xl p-6 shadow-[8px_8px_24px_rgba(163,177,198,0.15),-8px_-8px_24px_rgba(255,255,255,0.8)] hover:shadow-[10px_10px_30px_rgba(163,177,198,0.2),-10px_-10px_30px_rgba(255,255,255,0.9)] transition-shadow duration-300"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400/30 to-orange-400/30 backdrop-blur-sm shadow-[inset_2px_2px_8px_rgba(255,255,255,0.5),inset_-2px_-2px_8px_rgba(163,177,198,0.2)]">
                <Lightbulb className="size-6 text-yellow-500/80" />
              </div>
              <div>
                <h3 className="text-slate-600">Insight</h3>
                <p className="text-slate-400 text-sm">What we noticed</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-2xl p-4 shadow-[inset_2px_2px_8px_rgba(163,177,198,0.1)]">
              <p className="text-slate-600">
                {insight?.insight || "You're running on nervous energy—channel it productively."}
              </p>
            </div>
          </motion.div>

          {/* Prediction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#FAFBFF] rounded-3xl p-6 shadow-[8px_8px_24px_rgba(163,177,198,0.15),-8px_-8px_24px_rgba(255,255,255,0.8)] hover:shadow-[10px_10px_30px_rgba(163,177,198,0.2),-10px_-10px_30px_rgba(255,255,255,0.9)] transition-shadow duration-300"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400/30 to-indigo-400/30 backdrop-blur-sm shadow-[inset_2px_2px_8px_rgba(255,255,255,0.5),inset_-2px_-2px_8px_rgba(163,177,198,0.2)]">
                <TrendingUp className="size-6 text-blue-500/80" />
              </div>
              <div>
                <h3 className="text-slate-600">Prediction</h3>
                <p className="text-slate-400 text-sm">After you finish</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl p-4 mb-4 shadow-[inset_2px_2px_8px_rgba(163,177,198,0.1)]">
              <p className="text-slate-600">
                {prediction?.prediction || "You'll likely feel lighter, calmer, and more focused after these steps."}
              </p>
            </div>
          </motion.div>

          {/* Reset Tool - Box Breathing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#FAFBFF] rounded-3xl p-6 shadow-[8px_8px_24px_rgba(163,177,198,0.15),-8px_-8px_24px_rgba(255,255,255,0.8)] hover:shadow-[10px_10px_30px_rgba(163,177,198,0.2),-10px_-10px_30px_rgba(255,255,255,0.9)] transition-shadow duration-300"
          >
            <div className="flex items-start gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400/30 to-teal-400/30 backdrop-blur-sm shadow-[inset_2px_2px_8px_rgba(255,255,255,0.5),inset_-2px_-2px_8px_rgba(163,177,198,0.2)]">
                <Wind className="size-6 text-cyan-500/80" />
              </div>
              <div>
                <h3 className="text-slate-600">Reset Tool</h3>
                <p className="text-slate-400 text-sm">Box breathing exercise (4-4-4-4)</p>
              </div>
            </div>
            <BoxBreathing />
          </motion.div>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={onRegenerate}
            className="bg-gradient-to-r from-teal-400/60 to-blue-400/60 hover:from-teal-400/70 hover:to-blue-400/70 text-white rounded-2xl px-8 shadow-[4px_4px_12px_rgba(45,212,191,0.2),-2px_-2px_8px_rgba(255,255,255,0.5)] border-0"
          >
            <RefreshCw className="size-4 mr-2" />
            Regenerate Plan
          </Button>
        </motion.div>
      </motion.div>

    </div>
  );
}
