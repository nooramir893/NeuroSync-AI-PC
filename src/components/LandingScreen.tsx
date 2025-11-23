import { motion } from 'motion/react';
import { Brain, Sparkles, User, LogOut, Settings, X } from 'lucide-react';
import { RecordButton } from './RecordButton';
import { WaveformAnimation } from './WaveformAnimation';
import { useState } from 'react';
import { Button } from './ui/button';

interface LandingScreenProps {
  onStartRecording: () => void;
  userName?: string;
  onNavigateToSettings?: () => void;
  onLogout?: () => void;
}

export function LandingScreen({ onStartRecording, userName, onNavigateToSettings, onLogout }: LandingScreenProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleLogoutClick = () => {
    setShowProfileMenu(false);
    setLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutConfirmOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Profile Button - Top Right */}
      {userName && onNavigateToSettings && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="fixed top-6 right-6 z-10 group"
        >
          <div className="relative">
            {/* Glow effect */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full blur-md"
            />
            
            {/* Avatar */}
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center text-white shadow-lg border-2 border-white/50 backdrop-blur-sm">
              <span className="font-semibold text-sm md:text-base">
                {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>

            {/* Hover tooltip - only show when menu is closed */}
            {!showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                View Profile
              </div>
            )}
          </div>
        </motion.button>
      )}

      {/* Profile Dropdown Menu */}
      {showProfileMenu && userName && (
        <>
          {/* Backdrop - click to close */}
          <div
            onClick={() => setShowProfileMenu(false)}
            className="fixed inset-0 z-30"
          />
          
          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 md:top-24 right-6 z-40 w-72 bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={() => setShowProfileMenu(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors z-10"
            >
              <X className="size-4 text-slate-600" />
            </button>

            {/* User Info Section */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center text-white text-xl shadow-lg">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 font-semibold">{userName}</p>
                  <p className="text-slate-600 text-sm">Member since Nov 2025</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-4" />

              {/* Menu Items */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onNavigateToSettings) onNavigateToSettings();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/50 hover:bg-white/80 transition-colors text-left group"
                >
                  <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 group-hover:scale-110 transition-transform">
                    <Settings className="size-4 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-900 text-sm font-medium">Settings</p>
                    <p className="text-slate-600 text-xs">Manage your profile</p>
                  </div>
                </button>

                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50/50 hover:bg-red-100/80 transition-colors text-left group"
                >
                  <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 group-hover:scale-110 transition-transform">
                    <LogOut className="size-4 text-white" />
                  </div>
                  <div>
                    <p className="text-red-700 text-sm font-medium">Logout</p>
                    <p className="text-red-600 text-xs">Sign out of your account</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Logout Confirmation Modal */}
      {logoutConfirmOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLogoutConfirmOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setLogoutConfirmOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
                    <LogOut className="size-6 text-white" />
                  </div>
                  <h3 className="text-slate-900">Confirm Logout</h3>
                </div>
                <button
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors"
                >
                  <X className="size-5 text-slate-600" />
                </button>
              </div>

              {/* Confirmation Message */}
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center text-white text-2xl shadow-lg">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-slate-900 mb-2">Are you sure you want to logout?</p>
                  <p className="text-slate-600 text-sm">You'll need to sign in again to access your wellness journey.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setLogoutConfirmOpen(false)}
                  variant="outline"
                  className="flex-1 rounded-2xl border-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmLogout}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                >
                  <LogOut className="size-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl w-full"
      >
        {/* Logo and branding */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="relative">
            <Brain className="size-12 text-teal-600" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="size-5 text-purple-500" />
            </motion.div>
          </div>
          <h1 className="text-teal-900">NeuroSync AI</h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 mb-12 max-w-lg mx-auto"
        >
          Adaptive AI Personal Coach powered by your emotional state
        </motion.p>

        {/* Waveform animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <WaveformAnimation isActive={false} />
        </motion.div>

        {/* Record button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-6 flex justify-center"
        >
          <RecordButton onClick={onStartRecording} />
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-slate-500 text-sm"
        >
          Speak your heart out • I am here to listen
        </motion.p>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-sm">
            <div className="text-teal-600 mb-2">🎯</div>
            <h3 className="text-slate-900 mb-1">Personalized Plans</h3>
            <p className="text-slate-600 text-sm">Adaptive workouts and habits based on your state</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-sm">
            <div className="text-purple-600 mb-2">🧠</div>
            <h3 className="text-slate-900 mb-1">AI Insights</h3>
            <p className="text-slate-600 text-sm">Multi-agent reasoning for deeper understanding</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-sm">
            <div className="text-blue-600 mb-2">📊</div>
            <h3 className="text-slate-900 mb-1">Track Progress</h3>
            <p className="text-slate-600 text-sm">Monitor emotional patterns over time</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}