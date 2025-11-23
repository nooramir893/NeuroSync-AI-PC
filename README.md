# NeuroSync-AI-Personal-Coach

# *👥 About Team*

Meet the talented minds behind **NeuroSync AI**, a team committed to building an intelligent personal wellness and productivity coach powered by AI.

| Name                 | LinkedIn Profile      | GitHub Handle                                        |
| -------------------- | --------------------- | ---------------------------------------------------- |
| **Noor-ul-Ain Amir** | [Noor-ul-Ain Amir](https://www.linkedin.com/in/noor-ul-ain-amir-696a49333/)  | [@noorulainamir](https://github.com/nooramir893) |
| **Faiq-ul-Hassan** | [Faiq-ul-Hassan](https://www.linkedin.com/in/faiq-ul-hassan-753275242/) | [@faiqulhassan](https://github.com/ShadowFaiq) |
| **Meshal Mahnoor** | [Meshal Mahnoor](https://www.linkedin.com/in/meshal-mahnoor-2a1229376/) | [@meshalmahnoor](https://github.com/mishalmahnoor) |
| **Tahreem junaid** | [Tahreem junaid](https://www.linkedin.com/in/tahreem-junaid-72524237a/) | [@tahreemjunaid](https://github.com/tahreemjunaid75) |
| **Dheeraj Kumar**  | [Dheeraj Kumar](https://www.linkedin.com/in/dheeraj-kumar-b21a741a2/) | [@dheerajkumar](https://github.com/dheerajkumar47) |
| **Muhammad Zain Bashir** | [Muhammad Zain Bashir](https://www.linkedin.com/in/muhammad-zain-bashir-a04511323/)| [@muhammadzainbashir](https://github.com/zyrox443) |

# 🧠 NeuroSync AI - Complete Project Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Project Architecture](#project-architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**NeuroSync AI** is an advanced mental health and wellness application that uses AI to analyze voice recordings and provide personalized insights, mood tracking, workout recommendations, and habit suggestions. The app combines cutting-edge AI technologies (Google Gemini, Hugging Face) with a beautiful, modern user interface built with React and TypeScript.

### Key Capabilities
- 🎙️ **Voice Recording & Analysis**: Record your thoughts and feelings
- 🤖 **AI-Powered Insights**: Get personalized mental health analysis using Gemini AI
- 😊 **Emotion Detection**: Automatic emotion recognition from voice using Hugging Face models
- 📊 **Mood Tracking**: Track your emotional journey over time
- 💪 **Workout Recommendations**: Get personalized exercise suggestions based on your mood
- 🎵 **Music Integration**: Receive music recommendations tailored to your emotional state
- 📝 **Habit Building**: Daily habit suggestions to improve mental wellness
- 🔐 **Secure Authentication**: User accounts with Supabase authentication
- 📈 **History & Analytics**: View your check-in history and progress

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  UI Components (Radix UI + Custom Components)    │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↕                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │         State Management (React Hooks)           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                   Backend Services                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Supabase   │  │  Gemini AI   │  │ Hugging Face │ │
│  │              │  │              │  │              │ │
│  │ - Auth       │  │ - Analysis   │  │ - Emotion    │ │
│  │ - Storage    │  │ - Insights   │  │   Detection  │ │
│  │ - Database   │  │ - STT        │  │ - Whisper    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Data Flow
1. **User Authentication** → Supabase Auth
2. **Voice Recording** → Browser MediaRecorder API
3. **Audio Upload** → Supabase Storage (recordings bucket)
4. **Transcription** → Gemini AI (primary) / Hugging Face Whisper (fallback)
5. **Emotion Analysis** → Hugging Face emotion models / Browser heuristics
6. **AI Insights** → Gemini AI generates personalized analysis
7. **Data Storage** → Supabase Database (check_ins, recordings, profiles tables)

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Language**: TypeScript
- **Styling**: CSS (Vanilla CSS with custom design system)
- **UI Components**: Radix UI (Accordion, Dialog, Dropdown, etc.)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Motion library
- **Notifications**: Sonner (toast notifications)

### Backend & Services
- **Authentication & Database**: Supabase
- **AI Analysis**: Google Gemini AI (gemini-flash-latest)
- **Speech-to-Text**: Gemini AI / Hugging Face Whisper
- **Emotion Detection**: Hugging Face (superb/hubert-large-superb-er)
- **Storage**: Supabase Storage

### Development Tools
- **Package Manager**: npm
- **Dev Server**: Vite Dev Server (Port 3000)
- **TypeScript**: Type-safe development

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

---

## 📦 Installation

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- Vite and build tools
- Radix UI components
- Supabase client
- All other dependencies listed in package.json

**Expected time**: 2-5 minutes depending on your internet connection

---

## ⚙️ Environment Configuration

### Step 2: Set Up Environment Variables

The application requires API keys and configuration. Create a `.env.local` file in the project root:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Hugging Face (Optional - for emotion detection)
VITE_HF_TOKEN=your_huggingface_token
VITE_HF_TRANSCRIBE_MODEL=openai/whisper-tiny.en
VITE_HF_EMOTION_MODEL=superb/hubert-large-superb-er

# Google Gemini AI (Required for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_MODEL=gemini-flash-latest

# Hugging Face Proxy (Optional)
VITE_HF_PROXY_URL=http://localhost:8000/analyze-audio
```

### How to Get API Keys

#### 1. Supabase Setup (Required)
1. Go to https://supabase.com/ and create a free account
2. Create a new project
3. Go to **Project Settings → API**
4. Copy the **Project URL** and **anon/public** key
5. Add them to `.env.local`

**Database Setup:**
Run these SQL commands in Supabase SQL Editor:

```sql
-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  phone text,
  emergency_contact text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can manage their own profile"
on public.profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

-- Create recordings table
create table if not exists public.recordings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  storage_path text not null,
  duration_ms integer,
  transcript text,
  emotion_label text,
  emotion_score numeric,
  created_at timestamptz default now()
);
alter table public.recordings enable row level security;
create policy "Users manage own recordings"
on public.recordings for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Create check_ins table
create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  mood_summary text,
  mood_title text,
  status text,
  energy_level integer,
  transcript text,
  emotion_label text,
  workout text[],
  habit_title text,
  habit_description text,
  insight text,
  prediction text,
  plan_help text,
  created_at timestamptz default now()
);
alter table public.check_ins enable row level security;
create policy "Users manage own check_ins"
on public.check_ins for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

**Storage Setup:**
1. Go to **Storage** in Supabase
2. Create a bucket named `recordings` (make it private)
3. Run these policies in SQL Editor:

```sql
create policy "Users can upload recordings"
on storage.objects for insert
with check (bucket_id = 'recordings' and auth.uid() = owner);

create policy "Users can read their recordings"
on storage.objects for select
using (bucket_id = 'recordings' and auth.uid() = owner);
```

#### 2. Google Gemini AI (Required)
1. Go to https://ai.google.dev/
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the key and add to `.env.local`

**Note**: Gemini has a generous free tier

#### 3. Hugging Face (Optional)
1. Go to https://huggingface.co/
2. Create a free account
3. Go to **Settings → Access Tokens**
4. Create a new token
5. Copy and add to `.env.local`

**Note**: The app will fall back to browser-based transcription if Hugging Face is not configured

---

## 🚀 Running the Application

### Step 3: Start the Development Server

```bash
npm run dev
```

This will:
- Start the Vite development server
- Open your browser automatically at `http://localhost:3000`
- Enable hot module replacement (HMR) for instant updates

### What to Expect
1. **Welcome Screen**: First-time landing page
2. **Login/Signup**: Create an account or sign in
3. **Home Screen**: Main dashboard with "Start Recording" button
4. **Recording**: Record your voice (30-120 seconds recommended)
5. **Processing**: AI analyzes your recording
6. **Results**: View insights, mood analysis, recommendations

---

## ✨ Features

### 1. Voice Recording & Analysis
- Record audio directly in the browser
- Automatic transcription using Gemini AI
- Emotion detection from voice patterns
- Secure storage in Supabase

### 2. AI-Powered Insights
- **Current State Analysis**: Understand your emotional state
- **Personalized Recommendations**: Get tailored advice
- **Mood Tracking**: Track emotional patterns over time
- **Predictive Analysis**: Anticipate future emotional trends

### 3. Wellness Features
- **Workout Recommendations**: Exercise suggestions based on mood
- **Habit Building**: Daily micro-habits for mental wellness
- **Music Integration**: Mood-based music recommendations
- **Breathing Exercises**: Box breathing for stress relief

### 4. User Management
- Secure authentication with Supabase
- Profile management
- Check-in history
- Settings customization

---

## 📁 Project Structure

```
NeuroSync AI/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (Radix UI)
│   │   ├── LandingScreen.tsx
│   │   ├── RecordingScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   └── ...
│   ├── lib/                # Utility libraries
│   │   ├── supabaseClient.ts   # Supabase integration
│   │   ├── gemini.ts           # Gemini AI integration
│   │   └── huggingface.ts      # Hugging Face integration
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles & design system
├── public/                 # Static assets
├── .env.local             # Environment variables (create this)
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file

Key Files:
- App.tsx: Main app logic, state management, screen routing
- supabaseClient.ts: Database, auth, and storage operations
- gemini.ts: AI analysis, transcription, insights generation
- huggingface.ts: Emotion detection and transcription fallback
```

---

## 🔄 How It Works

### User Flow

1. **Welcome & Authentication**
   - User opens the app
   - Creates account or logs in via Supabase Auth
   - Profile is created/loaded from database

2. **Recording Session**
   - User clicks "Start Recording"
   - Browser requests microphone permission
   - Audio is recorded using MediaRecorder API
   - Visual waveform animation provides feedback

3. **Audio Processing**
   - Audio blob is uploaded to Supabase Storage
   - Gemini AI transcribes the audio
   - Emotion analysis runs (Hugging Face or browser heuristics)
   - Metadata saved to `recordings` table

4. **AI Analysis**
   - Transcript + emotion data sent to Gemini AI
   - Multiple AI calls generate:
     - Current state analysis
     - Workout exercises
     - Daily habit suggestion
     - Insight
     - Prediction
     - Action plan
     - Mood title

5. **Results Display**
   - All insights displayed on Results Screen
   - Data saved to `check_ins` table
   - User can regenerate AI analysis
   - Access workout, music, and habit recommendations

6. **History & Tracking**
   - All check-ins stored in database
   - History screen shows past sessions
   - Mood trends visualized with charts

### Technical Flow

```
User Action → Browser API → Frontend State → Supabase/AI Services → Database → UI Update
```

**Example: Recording Flow**
```
Click Record → MediaRecorder.start() → Audio Blob → Upload to Supabase Storage
→ Gemini Transcription → Emotion Detection → AI Analysis → Save to DB → Show Results
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "npm install" fails
**Solution:**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm cache clean --force`
- Run `npm install` again

#### 2. "Supabase is not configured" error
**Solution:**
- Ensure `.env.local` exists in project root
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

#### 3. Microphone not working
**Solution:**
- Check browser permissions (allow microphone access)
- Use HTTPS or localhost (required for microphone API)
- Try a different browser (Chrome/Edge recommended)

#### 4. AI analysis fails
**Solution:**
- Verify `VITE_GEMINI_API_KEY` is correct
- Check Gemini API quota/limits
- Ensure you have internet connection
- Check browser console for detailed errors

#### 5. Port 3000 already in use
**Solution:**
- Kill the process using port 3000
- Or modify `vite.config.ts` to use a different port:
  ```ts
  server: {
    port: 3001, // Change to any available port
    open: true,
  }
  ```

#### 6. Database errors (42P01)
**Solution:**
- Run the SQL setup commands in Supabase SQL Editor
- Ensure tables `profiles`, `recordings`, and `check_ins` exist
- Check Row Level Security (RLS) policies are enabled

#### 7. Build errors
**Solution:**
- Run `npm run build` to see detailed error messages
- Check TypeScript errors: `npx tsc --noEmit`
- Ensure all dependencies are installed

---

## 🎨 Customization

### Changing AI Models
Edit `.env.local`:
```env
VITE_GEMINI_MODEL=gemini-1.5-pro  # Use a different Gemini model
VITE_HF_TRANSCRIBE_MODEL=openai/whisper-base  # Different Whisper model
```

### Modifying UI Theme
Edit `src/index.css` - the design system is defined at the top with CSS variables

### Adding Features
- Components are in `src/components/`
- Main app logic in `src/App.tsx`
- API integrations in `src/lib/`

---

## 📝 Available Scripts

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔒 Security Notes

- API keys should NEVER be committed to version control
- `.env.local` is in `.gitignore` by default
- Supabase RLS policies protect user data
- Audio recordings are private per user
- All authentication handled by Supabase Auth

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Google Gemini AI](https://ai.google.dev/)
- [Hugging Face](https://huggingface.co/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Radix UI](https://www.radix-ui.com/)

---

## 🤝 Support

If you encounter issues:
1. Check this guide's Troubleshooting section
2. Review browser console for errors
3. Check Supabase logs
4. Verify all environment variables are set correctly

---

## 📄 License

This project is private and for personal/educational use.

---

**Happy Mental Wellness Tracking! 🧠✨**
