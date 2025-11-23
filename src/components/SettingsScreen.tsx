import { motion } from 'motion/react';
import { User, Palette, HelpCircle, Shield, ChevronDown, LogOut, X, Mail, Calendar } from 'lucide-react';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface SettingsScreenProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  userJoinedAt?: string;
  onUpdateProfile?: (name: string, email: string) => Promise<boolean>;
  showWorkout?: boolean;
  showMusic?: boolean;
  onToggleWorkout?: (value: boolean) => void;
  onToggleMusic?: (value: boolean) => void;
  onBackToPlan?: () => void;
  hasPlan?: boolean;
}

export function SettingsScreen({
  darkMode,
  onToggleDarkMode,
  onLogout,
  userName,
  userEmail,
  userJoinedAt,
  onUpdateProfile,
  showWorkout = true,
  showMusic = true,
  onToggleWorkout,
  onToggleMusic,
  onBackToPlan,
  hasPlan = false,
}: SettingsScreenProps) {
  const [aiPersonalization, setAiPersonalization] = useState(true);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userName || 'User Name',
    email: userEmail || 'user@neurosync.ai',
    joinDate: userJoinedAt ? formatJoinDate(userJoinedAt) : 'Nov 2025'
  });

  // Keep local profile data in sync with auth info.
  useEffect(() => {
    setProfileData({
      name: userName || 'User Name',
      email: userEmail || 'user@neurosync.ai',
      joinDate: userJoinedAt ? formatJoinDate(userJoinedAt) : profileData.joinDate || 'Nov 2025',
    });
    // We intentionally leave profileData.joinDate in dependency to avoid resetting user edits mid-typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, userEmail, userJoinedAt]);

  const handleSaveProfile = async () => {
    if (!onUpdateProfile) {
      setEditProfileOpen(false);
      return;
    }
    if (savingProfile) return;
    setSavingProfile(true);
    const ok = await onUpdateProfile(profileData.name.trim(), profileData.email.trim());
    setSavingProfile(false);
    if (ok) {
      setEditProfileOpen(false);
    }
  };

  const faqs = [
    {
      question: 'How does NeuroSync analyze my emotional state?',
      answer: 'NeuroSync uses advanced AI to analyze your voice tone, speech patterns, and word choice to understand your emotional and physical state. Our multi-agent system coordinates specialists in emotion detection, energy analysis, and action planning.',
    },
    {
      question: 'Is my voice data stored?',
      answer: 'No, your voice recordings are processed in real-time and immediately deleted. We only store the insights and recommendations generated from your check-ins.',
    },
    {
      question: 'How often should I do check-ins?',
      answer: 'We recommend starting your day with a check-in and doing another if you feel a significant mood or energy shift. Most users find 1-2 check-ins per day optimal.',
    },
    {
      question: 'Can I customize the recommendations?',
      answer: 'Yes! The AI learns from your feedback and completion patterns. You can also adjust personalization settings to fine-tune the types of recommendations you receive.',
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-slate-900 mb-2">Settings</h2>
            <p className="text-slate-600">Customize your NeuroSync experience</p>
          </div>
          {onBackToPlan && hasPlan && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToPlan}
              className="rounded-2xl border-teal-200 text-teal-700 hover:bg-teal-50"
            >
              Back to Plan
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500">
              <User className="size-6 text-white" />
            </div>
            <h3 className="text-slate-900">Profile</h3>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center text-white text-2xl">
              {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <p className="text-slate-900">{userName}</p>
              <p className="text-slate-600 text-sm">Member since {profileData.joinDate}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-2xl border-slate-300" onClick={() => setEditProfileOpen(true)}>
              Edit Profile
            </Button>
            {onLogout && (
              <Button
                onClick={() => setLogoutConfirmOpen(true)}
                variant="outline"
                className="rounded-2xl border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </motion.div>

        {/* AI Personalization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Shield className="size-6 text-white" />
            </div>
            <h3 className="text-slate-900">AI Personalization</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-900 text-sm">Enhanced Personalization</p>
                <p className="text-slate-600 text-xs">Allow AI to learn from your patterns</p>
              </div>
              <Switch
                checked={aiPersonalization}
                onCheckedChange={setAiPersonalization}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-900 text-sm">Workout Recommendations</p>
                <p className="text-slate-600 text-xs">Include fitness suggestions</p>
              </div>
              <Switch
                checked={showWorkout}
                onCheckedChange={(val) => onToggleWorkout?.(val)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-900 text-sm">Music Recommendations</p>
                <p className="text-slate-600 text-xs">Include playlist suggestions</p>
              </div>
              <Switch
                checked={showMusic}
                onCheckedChange={(val) => onToggleMusic?.(val)}
              />
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-6"
        >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
            <Palette className="size-6 text-white" />
          </div>
          <h3 className="text-slate-900">Appearance</h3>
        </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-900 text-sm">Dark Mode</p>
              <p className="text-slate-600 text-xs">Switch to dark theme</p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={onToggleDarkMode}
            />
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
              <HelpCircle className="size-6 text-white" />
            </div>
            <h3 className="text-slate-900">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <Collapsible
                key={index}
                open={faqOpen === index}
                onOpenChange={() => setFaqOpen(faqOpen === index ? null : index)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between w-full p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <p className="text-slate-900 text-sm text-left">{faq.question}</p>
                    <ChevronDown
                      className={`size-5 text-slate-600 transition-transform ${
                        faqOpen === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4">
                    <p className="text-slate-600 text-sm">{faq.answer}</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditProfileOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setEditProfileOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500">
                    <User className="size-6 text-white" />
                  </div>
                  <h3 className="text-slate-900">Edit Profile</h3>
                </div>
                <button
                  onClick={() => setEditProfileOpen(false)}
                  className="p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors"
                >
                  <X className="size-5 text-slate-600" />
                </button>
              </div>

              {/* Profile Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center text-white text-3xl shadow-lg">
                  {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-slate-900 mb-2 flex items-center gap-2">
                    <User className="size-4 text-slate-600" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="rounded-2xl border-slate-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-900 mb-2 flex items-center gap-2">
                    <Mail className="size-4 text-slate-600" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="rounded-2xl border-slate-300 bg-white/50 backdrop-blur-sm"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="joinDate" className="text-slate-900 mb-2 flex items-center gap-2">
                    <Calendar className="size-4 text-slate-600" />
                    Member Since
                  </Label>
                  <Input
                    id="joinDate"
                    value={profileData.joinDate}
                    onChange={(e) => setProfileData({ ...profileData, joinDate: e.target.value })}
                    className="rounded-2xl border-slate-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Nov 2025"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <Button
                  onClick={() => setEditProfileOpen(false)}
                  variant="outline"
                  className="flex-1 rounded-2xl border-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
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
                  onClick={() => {
                    setLogoutConfirmOpen(false);
                    if (onLogout) onLogout();
                  }}
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
    </div>
  );
}

function formatJoinDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Member';
  }
  return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
}
