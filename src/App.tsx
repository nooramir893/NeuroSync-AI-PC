import { useEffect, useState } from 'react';
import { LandingScreen } from './components/LandingScreen';
import { WelcomeLandingScreen } from './components/WelcomeLandingScreen';
import { RecordingScreen } from './components/RecordingScreen';
import { ProcessingScreen } from './components/ProcessingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { BottomNav } from './components/BottomNav';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchProfile, getSupabaseClient, insertRecordingMetadata, upsertProfile, uploadRecording } from './lib/supabaseClient';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { analyzeAudio } from './lib/huggingface';
import { analyzeStateWithGemini, generateHabitForToday, generateInsight, generateMoodTitle, generatePlanHelp, generatePrediction, generateWorkoutExercises, transcribeAudioWithGemini, type GeminiAnalysis, type GeminiHabit, type GeminiInsight, type GeminiMoodTitle, type GeminiPrediction, type GeminiPlanHelp } from './lib/gemini';

type Screen = 'welcome' | 'login' | 'signup' | 'home' | 'recording' | 'processing' | 'results' | 'history' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userJoinedAt, setUserJoinedAt] = useState('');
  const [userId, setUserId] = useState('');
  const [authPending, setAuthPending] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authInfo, setAuthInfo] = useState('');
  const [supabaseConfigError, setSupabaseConfigError] = useState('');
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string | undefined>(undefined);
  const [lastEmotionLabel, setLastEmotionLabel] = useState<string | undefined>(undefined);
  const [lastEmotionScore, setLastEmotionScore] = useState<number | undefined>(undefined);
  const [aiAnalysis, setAiAnalysis] = useState<GeminiAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<string[]>([]);
  const [habit, setHabit] = useState<GeminiHabit | null>(null);
  const [insight, setInsight] = useState<GeminiInsight | null>(null);
  const [prediction, setPrediction] = useState<GeminiPrediction | null>(null);
  const [planHelp, setPlanHelp] = useState<GeminiPlanHelp | null>(null);
  const [moodTitle, setMoodTitle] = useState<string | null>(null);
  const [showWorkout, setShowWorkout] = useState<boolean>(() => {
    const stored = localStorage.getItem('showWorkout');
    return stored === null ? true : stored === 'true';
  });
  const [showMusic, setShowMusic] = useState<boolean>(() => {
    const stored = localStorage.getItem('showMusic');
    return stored === null ? true : stored === 'true';
  });
  const [historyEntries, setHistoryEntries] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const startRecording = () => {
    setAiAnalysis(null);
    setAiError(null);
    setAiLoading(false);
    setWorkoutExercises([]);
    setHabit(null);
    setInsight(null);
    setPrediction(null);
    setPlanHelp(null);
    setMoodTitle(null);
    setCurrentScreen('recording');
  };

  const cancelRecording = () => {
    setAiLoading(false);
    setAiError(null);
    setCurrentScreen('home');
  };

  const regenerateAi = () => {
    if (!lastTranscript) {
      toast.error('No transcript available yet. Please record again.');
      return;
    }
    setAiLoading(true);
    setCurrentScreen('processing');
    runGeminiAnalysis(lastTranscript, lastEmotionLabel, lastEmotionScore);
  };

  const goToProcessing = () => {
    setAiLoading(true);
    setCurrentScreen('processing');
  };

  useEffect(() => {
    try {
      const client = getSupabaseClient();
      setSupabaseClient(client);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Supabase is not configured yet.';
      setSupabaseConfigError(message);
    }
  }, []);

  useEffect(() => {
    if (!supabaseClient) return;

    const syncSession = async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        setAuthError(error.message);
        return;
      }
      const session = data.session;
      if (session?.user) {
        const fullName = await getDisplayName(supabaseClient, session.user);
        setIsAuthenticated(true);
        setUserName(fullName);
        setUserEmail(session.user.email || '');
        setUserJoinedAt(session.user.created_at || '');
        setUserId(session.user.id);
        setCurrentScreen('home');
      }
    };

    syncSession();

    const { data: listener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const fullName = await getDisplayName(supabaseClient, session.user);
        setIsAuthenticated(true);
        setUserName(fullName);
        setUserEmail(session.user.email || '');
        setUserJoinedAt(session.user.created_at || '');
        setUserId(session.user.id);
        setCurrentScreen('home');
      }
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserName('');
        setUserEmail('');
        setUserJoinedAt('');
        setUserId('');
        setCurrentScreen('login');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabaseClient]);

  useEffect(() => {
    if (currentScreen === 'results') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen === 'history') {
      fetchHistory();
    }
  }, [currentScreen, supabaseClient, userId]);

  // Load history as soon as a user is available so it persists after re-login.
  useEffect(() => {
    if (userId) {
      fetchHistory();
    }
  }, [userId]);

  const fetchHistory = async () => {
    if (!supabaseClient || !userId) return;
    setHistoryLoading(true);
    const { data, error } = await supabaseClient
      .from('check_ins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && data) {
      setHistoryEntries(data);
    }
    setHistoryLoading(false);
  };

  const handleLogin = async (email: string, password: string) => {
    setAuthError('');
    setAuthInfo('');

    if (!supabaseClient) {
      setAuthError(supabaseConfigError || 'Supabase is not configured yet.');
      return;
    }

    setAuthPending(true);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    setAuthPending(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (data.session?.user) {
      const fullName = await getDisplayName(supabaseClient, data.session.user);
      setIsAuthenticated(true);
      setUserName(fullName);
      setUserEmail(data.session.user.email || email);
      setUserJoinedAt(data.session.user.created_at || '');
      setUserId(data.session.user.id);
      setCurrentScreen('home');
    }
  };

  const handleSignup = async (name: string, email: string, password: string, phone: string, emergencyContact: string) => {
    setAuthError('');
    setAuthInfo('');

    if (!supabaseClient) {
      setAuthError(supabaseConfigError || 'Supabase is not configured yet.');
      return;
    }

    setAuthPending(true);
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone, emergency_contact: emergencyContact },
        emailRedirectTo: `${window.location.origin}`,
      },
    });
    setAuthPending(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    // If email confirmation is required, Supabase won't return a session.
    const user = data.user ?? data.session?.user;

    if (user) {
      await upsertProfile(supabaseClient, { id: user.id, full_name: name, phone, emergency_contact: emergencyContact });
    }

    if (!data.session) {
      setAuthInfo('Check your email to confirm your account, then sign in.');
      setCurrentScreen('login');
      return;
    }

    if (data.session.user) {
      const fullName = await getDisplayName(supabaseClient, data.session.user);
      setIsAuthenticated(true);
      setUserName(fullName);
      setUserEmail(data.session.user.email || email);
      setUserJoinedAt(data.session.user.created_at || '');
      setUserId(data.session.user.id);
      setCurrentScreen('home');
    }
  };

  const handleLogout = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    setIsAuthenticated(false);
    setUserName('');
    setUserEmail('');
    setUserJoinedAt('');
    setUserId('');
    setCurrentScreen('login');
  };

  const handleProfileUpdate = async (name: string, email: string) => {
    if (!supabaseClient) {
      toast.error('Supabase is not configured yet.');
      return false;
    }

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !userData.user) {
      toast.error(userError?.message || 'User not found.');
      return false;
    }

    const currentEmail = userData.user.email;
    const shouldUpdateEmail = email && email !== currentEmail;

    const { error: updateError } = await supabaseClient.auth.updateUser({
      data: { full_name: name },
      ...(shouldUpdateEmail ? { email } : {}),
    });
    if (updateError) {
      toast.error(updateError.message);
      return false;
    }

    await upsertProfile(supabaseClient, { id: userData.user.id, full_name: name });

    setUserName(name);
    setUserEmail(email || currentEmail || '');
    toast.success('Profile updated');
    return true;
  };

  const handleSaveRecording = async (blob: Blob, durationMs: number, fallbackAnalysis?: { transcript?: string; emotionLabel?: string; emotionScore?: number }) => {
    if (!supabaseClient) {
      throw new Error('Supabase is not configured yet.');
    }
    if (!userId) {
      throw new Error('User not found.');
    }

    const path = await uploadRecording(supabaseClient, userId, blob);

    let transcript: string | undefined;
    let emotionLabel: string | undefined;
    let emotionScore: number | undefined;

    // First try Gemini STT (inline data)
    try {
      transcript = await transcribeAudioWithGemini(blob);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transcription failed.';
      toast.error(message);
    }

    // Fall back to proxy/heuristics if Gemini STT didn’t return anything.
    if (!transcript) {
      try {
        const analysis = await analyzeAudio(blob);
        transcript = analysis.transcript;
        emotionLabel = analysis.emotionLabel;
        emotionScore = analysis.emotionScore;
      } catch (error) {
        if (fallbackAnalysis) {
          transcript = fallbackAnalysis.transcript;
          emotionLabel = fallbackAnalysis.emotionLabel;
          emotionScore = fallbackAnalysis.emotionScore;
        } else {
          const message = error instanceof Error ? error.message : 'Analysis failed.';
          toast.error(message);
        }
      }
    }

    // If we still have no emotion label, try heuristic fallback.
    if (!emotionLabel && fallbackAnalysis?.emotionLabel) {
      emotionLabel = fallbackAnalysis.emotionLabel;
      emotionScore = fallbackAnalysis.emotionScore;
    }

    // If transcription failed entirely, alert and return to recording.
    if (!transcript) {
      toast.error('An error occurred. Please try again.');
      setAiLoading(false);
      setCurrentScreen('recording');
      return;
    }

    const { error } = await insertRecordingMetadata(supabaseClient, {
      user_id: userId,
      storage_path: path,
      duration_ms: Math.round(durationMs),
      transcript,
      emotion_label: emotionLabel,
      emotion_score: emotionScore,
    });

    // If the table doesn't exist, we still succeed on storage upload.
    if (error && error.code !== '42P01') {
      throw error;
    }

    setLastTranscript(transcript);
    setLastEmotionLabel(emotionLabel);
    setLastEmotionScore(emotionScore);
    await runGeminiAnalysis(transcript, emotionLabel, emotionScore);
  };

  const runGeminiAnalysis = async (transcript?: string, emotionLabel?: string, emotionScore?: number) => {
    setAiError(null);
    setAiLoading(true);
    try {
      const res = await analyzeStateWithGemini({ transcript, emotionLabel, emotionScore });
      setAiAnalysis(res);

      // Collect fresh outputs locally so we don't rely on stale state when saving.
      let workoutResult: string[] | null = workoutExercises;
      let habitResult = habit;
      let insightResult = insight;
      let predictionResult = prediction;
      let planResult = planHelp;
      let titleResult = moodTitle;

      try {
        const moves = await generateWorkoutExercises({ transcript, emotionLabel });
        if (moves) {
          workoutResult = moves;
          setWorkoutExercises(moves);
        }
      } catch (err) {
        console.error('Workout generation failed', err);
      }
      try {
        const h = await generateHabitForToday({ transcript, emotionLabel });
        if (h) {
          habitResult = h;
          setHabit(h);
        }
      } catch (err) {
        console.error('Habit generation failed', err);
      }
      try {
        const ins = await generateInsight({ transcript, emotionLabel, emotionScore });
        if (ins) {
          insightResult = ins;
          setInsight(ins);
        }
      } catch (err) {
        console.error('Insight generation failed', err);
      }
      try {
        const pred = await generatePrediction({ transcript, emotionLabel, emotionScore });
        if (pred) {
          predictionResult = pred;
          setPrediction(pred);
        }
      } catch (err) {
        console.error('Prediction generation failed', err);
      }
      try {
        const plan = await generatePlanHelp({
          transcript,
          emotionLabel,
          emotionScore,
          exercises: workoutResult || undefined,
          habitTitle: habitResult?.title,
          habitDescription: habitResult?.description,
        });
        if (plan) {
          planResult = plan;
          setPlanHelp(plan);
        }
      } catch (err) {
        console.error('Plan help generation failed', err);
      }
      try {
        const titleRes = await generateMoodTitle({ transcript, emotionLabel, sensing: res?.sensing });
        if (titleRes?.title) {
          titleResult = titleRes.title;
          setMoodTitle(titleRes.title);
        }
      } catch (err) {
        console.error('Mood title generation failed', err);
      }

      await saveCheckIn({
        mood_summary: res?.sensing || emotionLabel || 'Unknown',
        mood_title: titleResult,
        status: 'Completed',
        energy_level: Math.round((emotionScore ?? 0) * 100) || null,
        transcript,
        emotion_label: emotionLabel,
        workout: workoutResult,
        habit_title: habitResult?.title,
        habit_description: habitResult?.description,
        insight: insightResult?.insight,
        prediction: predictionResult?.prediction,
        plan_help: planResult?.plan,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gemini analysis failed.';
      setAiError(message);
      toast.error(message);
      // If Gemini fails entirely, return to landing.
      setCurrentScreen('home');
    } finally {
      setAiLoading(false);
    }
  };

  const saveCheckIn = async (payload: {
    mood_summary?: string | null;
    mood_title?: string | null;
    status?: string | null;
    energy_level?: number | null;
    transcript?: string | null;
    emotion_label?: string | null;
    workout?: string[] | null;
    habit_title?: string | null;
    habit_description?: string | null;
    insight?: string | null;
    prediction?: string | null;
    plan_help?: string | null;
  }) => {
    if (!supabaseClient || !userId) return;
    const { error } = await supabaseClient.from('check_ins').insert({
      user_id: userId,
      ...payload,
    });
    if (error) {
      console.error('Check-in save failed', error);
      return;
    }
    fetchHistory();
  };

  const renderScreen = () => {
    // Show welcome screen first
    if (currentScreen === 'welcome') {
      return <WelcomeLandingScreen onGetStarted={() => setCurrentScreen('login')} />;
    }

    // Show auth screens if not authenticated
    if (!isAuthenticated) {
      const errorToShow = authError || supabaseConfigError;
      switch (currentScreen) {
        case 'login':
          return (
            <LoginScreen
              onLogin={handleLogin}
              onSwitchToSignup={() => setCurrentScreen('signup')}
              onBack={() => setCurrentScreen('welcome')}
              darkMode={darkMode}
              loading={authPending}
              errorMessage={errorToShow}
              infoMessage={authInfo}
            />
          );
        case 'signup':
          return (
            <SignupScreen
              onSignup={handleSignup}
              onSwitchToLogin={() => setCurrentScreen('login')}
              onBack={() => setCurrentScreen('welcome')}
              darkMode={darkMode}
              loading={authPending}
              errorMessage={errorToShow}
              infoMessage={authInfo}
            />
          );
        default:
          return (
            <LoginScreen
              onLogin={handleLogin}
              onSwitchToSignup={() => setCurrentScreen('signup')}
              onBack={() => setCurrentScreen('welcome')}
              darkMode={darkMode}
              loading={authPending}
              errorMessage={errorToShow}
              infoMessage={authInfo}
            />
          );
      }
    }

    // Show app screens if authenticated
    switch (currentScreen) {
      case 'home':
        return <LandingScreen onStartRecording={startRecording} userName={userName} onNavigateToSettings={() => setCurrentScreen('settings')} onLogout={handleLogout} />;
      case 'recording':
        return (
          <RecordingScreen
            onComplete={goToProcessing}
            onCancel={cancelRecording}
            onSaveRecording={handleSaveRecording}
          />
        );
      case 'processing':
        return <ProcessingScreen onComplete={() => setCurrentScreen('results')} loading={aiLoading} />;
      case 'results':
        return (
          <ResultsScreen
            onRegenerate={regenerateAi}
            onBack={() => setCurrentScreen('home')}
            transcript={lastTranscript}
            emotionLabel={lastEmotionLabel}
            analysis={aiAnalysis}
            loading={aiLoading}
            error={aiError}
            workoutExercises={workoutExercises}
            habit={habit}
            insight={insight}
            prediction={prediction}
            planHelp={planHelp}
          />
        );
      case 'history':
        return (
          <HistoryScreen
            onRerunCheckIn={() => setCurrentScreen('recording')}
            entries={historyEntries}
            loading={historyLoading}
            onBackToPlan={() => setCurrentScreen('results')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onLogout={handleLogout}
            userName={userName}
            userEmail={userEmail}
            userJoinedAt={userJoinedAt}
            onUpdateProfile={handleProfileUpdate}
            showWorkout={showWorkout}
            showMusic={showMusic}
            onToggleWorkout={(value) => {
              setShowWorkout(value);
              localStorage.setItem('showWorkout', String(value));
              toast.success(`Settings updated: Workout recommendations ${value ? 'on' : 'off'}`);
            }}
            onToggleMusic={(value) => {
              setShowMusic(value);
              localStorage.setItem('showMusic', String(value));
              toast.success(`Settings updated: Music recommendations ${value ? 'on' : 'off'}`);
            }}
            onBackToPlan={() => setCurrentScreen('results')}
            hasPlan={!!lastTranscript || !!aiAnalysis}
          />
        );
      default:
        return <LandingScreen onStartRecording={startRecording} />;
    }
  };

  const getDisplayName = async (client: SupabaseClient, user: { id: string; email?: string; user_metadata?: Record<string, any> }) => {
    const metaName = user.user_metadata?.full_name;
    if (metaName) return metaName;

    const { data, error } = await fetchProfile(client, user.id);
    if (error || !data) {
      const fallbackName = user.email?.split('@')[0] || 'User';
      // Ensure profile exists after login if it was never created (e.g., email-confirm flows without session at signup).
      await upsertProfile(client, { id: user.id, full_name: fallbackName });
      return fallbackName;
    }
    return data.full_name || user.email?.split('@')[0] || 'User';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50'} transition-colors duration-300`}>
      <Toaster position="top-center" />
      <div className="pb-20">
        {renderScreen()}
      </div>
      {isAuthenticated && <BottomNav currentScreen={currentScreen} onNavigate={navigateToScreen} darkMode={darkMode} />}
    </div>
  );
}
