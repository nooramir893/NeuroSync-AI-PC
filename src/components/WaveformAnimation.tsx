import { motion } from 'motion/react';

interface WaveformAnimationProps {
  isActive: boolean;
}

export function WaveformAnimation({ isActive }: WaveformAnimationProps) {
  const bars = Array.from({ length: 40 }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-1 h-24">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-1 bg-gradient-to-t from-teal-500 to-blue-500 rounded-full"
          animate={{
            height: isActive
              ? [
                  Math.random() * 60 + 20,
                  Math.random() * 60 + 20,
                  Math.random() * 60 + 20,
                ]
              : [8, 8, 8],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: bar * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
