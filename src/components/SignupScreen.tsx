import { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface SignupScreenProps {
  onSignup: (name: string, email: string, password: string, phone: string, emergencyContact: string) => void;
  onSwitchToLogin: () => void;
  onBack?: () => void;
  darkMode: boolean;
  loading?: boolean;
  errorMessage?: string;
  infoMessage?: string;
}

export function SignupScreen({
  onSignup,
  onSwitchToLogin,
  onBack,
  darkMode,
  loading = false,
  errorMessage,
  infoMessage,
}: SignupScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [emergency, setEmergency] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalize = (value: string) => value.replace(/\D/g, '');
    const phoneDigits = normalize(phone);
    const emergencyDigits = normalize(emergency);
    const phoneValid = phoneDigits.length === 11;
    const emergencyValid = emergencyDigits.length === 11;
    if (!phoneValid || !emergencyValid) {
      setFormError('Please enter 11 digits for both phone and emergency contact.');
      return;
    }
    setFormError(null);
    onSignup(name, email, password, phoneDigits, emergencyDigits);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Back button */}
        {onBack && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="size-5 mr-2" />
              Back
            </Button>
          </motion.div>
        )}

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="size-10 text-teal-600" />
          </motion.div>
          <motion.h1
            className="text-teal-900"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            NeuroSync AI
          </motion.h1>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className={`p-8 rounded-3xl ${
            darkMode
              ? 'bg-slate-800/90 border border-slate-700'
              : 'bg-white/90 border border-slate-200'
          } backdrop-blur-lg shadow-xl`}
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}
          >
            Create account
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Start your personalized wellness journey
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}
            {infoMessage && !errorMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {infoMessage}
              </div>
            )}

            {/* Name field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className={darkMode ? 'text-slate-300' : ''}>
                Full Name
              </Label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-10 ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                      : ''
                  }`}
                  required
                />
              </div>
            </motion.div>

            {/* Email field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className={darkMode ? 'text-slate-300' : ''}>
                Email
              </Label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                      : ''
                  }`}
                  required
                />
              </div>
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className={darkMode ? 'text-slate-300' : ''}>
                Password
              </Label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                      : ''
                  }`}
                  required
                  minLength={6}
                />
              </div>
              <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                At least 6 characters
              </p>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-2"
            >
              <Label htmlFor="phone" className={darkMode ? 'text-slate-300' : ''}>
                Phone (11 digits)
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="03XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : ''}`}
                  required
                />
              </div>
            </motion.div>

            {/* Emergency contact */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-2"
            >
              <Label htmlFor="emergency" className={darkMode ? 'text-slate-300' : ''}>
                Loved one’s phone (11 digits)
              </Label>
              <div className="relative">
                <Input
                  id="emergency"
                  type="tel"
                  inputMode="numeric"
                  placeholder="03XXXXXXXXX"
                  value={emergency}
                  onChange={(e) => setEmergency(e.target.value)}
                  className={`${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : ''}`}
                  required
                />
              </div>
              <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                We only use this to notify a trusted contact in case of an emergency.
              </p>
            </motion.div>

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-2xl h-12 mt-6 disabled:opacity-70"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </motion.div>
          </form>

          {/* Switch to login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-6 text-center"
          >
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-teal-600 hover:text-teal-700 transition-colors"
              >
                Sign in
              </button>
            </p>
          </motion.div>
        </motion.div>

        {/* Privacy notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className={`text-xs text-center mt-6 ${
            darkMode ? 'text-slate-500' : 'text-slate-500'
          }`}
        >
          Your data is encrypted and secure
        </motion.p>
      </motion.div>
    </div>
  );
}
