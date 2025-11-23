import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Brain, Sparkles, Activity, Heart, Zap } from 'lucide-react';

interface ProcessingScreenProps {
  onComplete: () => void;
  loading: boolean;
}

export function ProcessingScreen({ onComplete, loading }: ProcessingScreenProps) {
  useEffect(() => {
    if (!loading) {
      onComplete();
    }
  }, [loading, onComplete]);

  const agents = [
    { icon: Brain, label: 'Orchestrator Agent', delay: 0 },
    { icon: Heart, label: 'Emotion Analyzer', delay: 0.3 },
    { icon: Activity, label: 'Energy Detector', delay: 0.6 },
    { icon: Zap, label: 'Action Planner', delay: 0.9 },
    { icon: Sparkles, label: 'Insight Generator', delay: 1.2 },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center max-w-2xl w-full"
      >
        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-slate-900 mb-2"
        >
          Analyzing your emotional tone...
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 mb-12"
        >
          Orchestrator Agent coordinating specialists...
        </motion.p>

        {/* Agent chain visualization */}
        <div className="relative mb-12">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            {agents.slice(0, -1).map((_, index) => (
              <motion.line
                key={index}
                x1="50%"
                y1={`${(index * 100) / (agents.length - 1)}%`}
                x2="50%"
                y2={`${((index + 1) * 100) / (agents.length - 1)}%`}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ delay: agents[index].delay + 0.2, duration: 0.5 }}
              />
            ))}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Agent nodes */}
          <div className="relative space-y-8" style={{ zIndex: 1 }}>
            {agents.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: agent.delay, duration: 0.5 }}
                  className="flex items-center justify-center"
                >
                  <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        delay: agent.delay + 0.3,
                        duration: 1,
                        repeat: Infinity,
                      }}
                      className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600"
                    >
                      <Icon className="size-6 text-white" />
                    </motion.div>
                    <span className="text-slate-700">{agent.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center justify-center gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-500"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
