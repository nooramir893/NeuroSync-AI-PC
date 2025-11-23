import { motion } from 'motion/react';
import { Mic } from 'lucide-react';

interface RecordButtonProps {
  onClick: () => void;
  isRecording?: boolean;
}

export function RecordButton({ onClick, isRecording = false }: RecordButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-center justify-center group"
    >
      {/* Outer pulse ring */}
      {isRecording && (
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-teal-400"
        />
      )}

      {/* Inner button */}
      <div className="relative z-10 flex flex-col items-center">
        <Mic className="size-10 text-white mb-1" />
        <span className="text-white text-sm">Record</span>
      </div>

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
}
