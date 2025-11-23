import { motion } from 'motion/react';
import { Brain, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface WelcomeLandingScreenProps {
  onGetStarted: () => void;
}

export function WelcomeLandingScreen({ onGetStarted }: WelcomeLandingScreenProps) {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 cursor-pointer"
      onClick={onGetStarted}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl w-full"
      >
        {/* Logo and branding */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain className="size-16 text-teal-600" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="size-7 text-purple-500" />
            </motion.div>
          </div>
          <motion.h1
            className="text-teal-900"
            style={{ fontSize: '3rem' }}
          >
            NeuroSync AI
          </motion.h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 mb-8 max-w-2xl mx-auto"
          style={{ fontSize: '1.25rem' }}
        >
          Your AI-powered personal wellness coach that adapts to your emotional and physical state
        </motion.p>

        {/* Animated gradient orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative w-64 h-64 mx-auto mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400/30 via-blue-400/30 to-purple-400/30 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-4 rounded-full bg-gradient-to-tr from-purple-400/40 via-pink-400/40 to-teal-400/40 blur-2xl"
          />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mb-6"
        >
          <Button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-full h-14 px-8 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Get Started
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-slate-500 text-sm mb-12"
        >
          Just your voice • Personalized insights • AI-powered recommendations
        </motion.p>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-6 rounded-3xl bg-white/50 backdrop-blur-sm cursor-pointer hover:bg-white/70 transition-all"
            onClick={onGetStarted}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl mb-3"
            >
              🎯
            </motion.div>
            <h3 className="text-slate-900 mb-2">Personalized Plans</h3>
            <p className="text-slate-600 text-sm">Adaptive workouts and habits based on your state</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-6 rounded-3xl bg-white/50 backdrop-blur-sm cursor-pointer hover:bg-white/70 transition-all"
            onClick={onGetStarted}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl mb-3"
            >
              🧠
            </motion.div>
            <h3 className="text-slate-900 mb-2">AI Insights</h3>
            <p className="text-slate-600 text-sm">Multi-agent reasoning for deeper understanding</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-6 rounded-3xl bg-white/50 backdrop-blur-sm cursor-pointer hover:bg-white/70 transition-all"
            onClick={onGetStarted}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl mb-3"
            >
              📊
            </motion.div>
            <h3 className="text-slate-900 mb-2">Track Progress</h3>
            <p className="text-slate-600 text-sm">Monitor emotional patterns over time</p>
          </motion.div>
        </motion.div>

        {/* Tap anywhere hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="text-slate-400 text-sm mt-12"
        >
          Click anywhere to begin
        </motion.p>
      </motion.div>
    </div>
  );
}