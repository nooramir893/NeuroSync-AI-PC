import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';

export function BoxBreathing() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [counter, setCounter] = useState(4);

  const phases = [
    { name: 'inhale', label: 'Breathe In', duration: 4, color: 'from-cyan-300/40 to-teal-300/40' },
    { name: 'hold1', label: 'Hold', duration: 4, color: 'from-teal-300/40 to-blue-300/40' },
    { name: 'exhale', label: 'Breathe Out', duration: 4, color: 'from-blue-300/40 to-indigo-300/40' },
    { name: 'hold2', label: 'Hold', duration: 4, color: 'from-indigo-300/40 to-cyan-300/40' },
  ];

  const currentPhaseIndex = phases.findIndex(p => p.name === phase);
  const currentPhase = phases[currentPhaseIndex];

  // Timer countdown logic
  useEffect(() => {
    if (!isActive) {
      setCounter(4);
      return;
    }

    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          // Move to next phase
          const nextIndex = (currentPhaseIndex + 1) % phases.length;
          setPhase(phases[nextIndex].name as any);
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPhaseIndex]);

  const handleToggle = () => {
    if (!isActive) {
      setCounter(4);
      setPhase('inhale');
    }
    setIsActive(!isActive);
  };

  // Calculate scale based on phase and time
  const getCircleScale = () => {
    if (!isActive) return 0.7;
    
    const progress = (4 - counter) / 4; // 0 to 1 as counter goes 4->3->2->1
    
    if (phase === 'inhale') {
      return 0.6 + (0.4 * progress); // Grows from 0.6 to 1.0
    } else if (phase === 'exhale') {
      return 1.0 - (0.4 * progress); // Shrinks from 1.0 to 0.6
    } else {
      // Hold phases - stay at current size
      return phase === 'hold1' ? 1.0 : 0.6;
    }
  };

  const getGlowScale = () => {
    if (!isActive) return 0.7;
    
    const progress = (4 - counter) / 4;
    
    if (phase === 'inhale') {
      return 0.6 + (0.5 * progress); // 0.6 to 1.1
    } else if (phase === 'exhale') {
      return 1.1 - (0.5 * progress); // 1.1 to 0.6
    } else {
      return phase === 'hold1' ? 1.1 : 0.6;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Breathing visualization */}
      <div className="relative w-64 h-64 mb-8">
        {/* Outer glow effect */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentPhase.color} blur-2xl`}
          animate={{
            scale: getGlowScale(),
            opacity: isActive ? 0.5 : 0.3,
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
          }}
        />

        {/* Main animated circle with soft glow */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentPhase.color} backdrop-blur-sm shadow-[inset_4px_4px_16px_rgba(255,255,255,0.5),inset_-4px_-4px_16px_rgba(163,177,198,0.2),0_0_40px_rgba(6,182,212,0.3)]`}
          animate={{
            scale: getCircleScale(),
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
          }}
        />

        {/* Inner pulsing glow */}
        <motion.div
          className={`absolute inset-8 rounded-full bg-gradient-to-br ${currentPhase.color} blur-xl`}
          animate={{
            scale: isActive ? [1, 1.2, 1] : 1,
            opacity: isActive ? [0.5, 0.8, 0.5] : 0.4,
          }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: isActive ? Infinity : 0,
          }}
        />

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <p className="text-slate-600 text-2xl mb-2">{currentPhase.label}</p>
              <p className="text-slate-500">{counter} seconds</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Corner indicators with soft glow */}
        <div className="absolute inset-0">
          {[0, 1, 2, 3].map((corner) => (
            <motion.div
              key={corner}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-teal-400/60 to-blue-400/60 shadow-[0_0_12px_rgba(45,212,191,0.4)]"
              style={{
                top: corner < 2 ? '0' : 'auto',
                bottom: corner >= 2 ? '0' : 'auto',
                left: corner % 2 === 0 ? '0' : 'auto',
                right: corner % 2 === 1 ? '0' : 'auto',
              }}
              animate={{
                scale: isActive && currentPhaseIndex === corner ? [1, 1.5, 1] : 1,
                boxShadow: isActive && currentPhaseIndex === corner 
                  ? ['0 0 12px rgba(45,212,191,0.4)', '0 0 20px rgba(45,212,191,0.7)', '0 0 12px rgba(45,212,191,0.4)']
                  : '0 0 12px rgba(45,212,191,0.4)',
              }}
              transition={{
                duration: 4,
                repeat: isActive ? Infinity : 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Control button */}
      <Button
        onClick={handleToggle}
        className="bg-gradient-to-r from-cyan-400/60 to-teal-400/60 hover:from-cyan-400/70 hover:to-teal-400/70 text-white rounded-2xl px-8 shadow-[4px_4px_12px_rgba(6,182,212,0.2),-2px_-2px_8px_rgba(255,255,255,0.5)] border-0"
      >
        {isActive ? (
          <>
            <Pause className="size-4 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="size-4 mr-2" />
            Start Breathing
          </>
        )}
      </Button>

      {/* Instructions */}
      <p className="text-slate-500 text-sm mt-4 text-center max-w-md">
        Follow the circle: breathe in for 4 seconds, hold for 4, breathe out for 4, and hold for 4.
      </p>
    </div>
  );
}