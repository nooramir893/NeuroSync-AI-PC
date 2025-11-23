import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Mic, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { WaveformAnimation } from './WaveformAnimation';
import { toast } from 'sonner';

type SpeechRecognition = any;
type SpeechRecognitionEvent = any;

interface RecordingScreenProps {
  onComplete: () => void;
  onCancel: () => void;
  onSaveRecording: (file: Blob, durationMs: number, fallbackAnalysis?: { transcript?: string; emotionLabel?: string; emotionScore?: number }) => Promise<void>;
}

export function RecordingScreen({ onComplete, onCancel, onSaveRecording }: RecordingScreenProps) {
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startTimeRef = useRef<number>(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    // Simulate transcription appearing
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : undefined;
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (event) => {
          if (event.data?.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.onstop = async () => {
          if (cancelRef.current) {
            cancelRef.current = false;
            return;
          }
          const durationMs = performance.now() - startTimeRef.current;
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          chunksRef.current = [];
          setIsSaving(true);
          onComplete(); // navigate to processing/loading immediately
          try {
            // Pass any browser-side transcript/emotion heuristic
            await onSaveRecording(blob, durationMs, captureHeuristics());
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to save recording.';
            toast.error(message);
            onCancel();
          } finally {
            setIsSaving(false);
            stopAll();
          }
        };

        startTimeRef.current = performance.now();
        recorder.start();
        setIsRecording(true);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Microphone permission denied.';
        toast.error(message);
        onCancel();
      }
    };

    startBrowserTranscription();
    start();

    return () => {
      stopAll();
    };
  }, [onCancel, onComplete, onSaveRecording]);

  const handleStopRecording = () => {
    if (isSaving) return;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      cancelRef.current = false;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    if (isSaving) return;
    cancelRef.current = true;
    const rec = mediaRecorderRef.current;
    if (rec && rec.state === 'recording') {
      rec.onstop = null;
      rec.stop();
    }
    stopAll();
    setIsRecording(false);
    onCancel();
  };

  const stopAll = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    stopBrowserTranscription();
  };

  const startBrowserTranscription = () => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;
    try {
      const recognition: SpeechRecognition = new SpeechRecognitionCtor();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(' ');
        setTranscription(transcript.trim());
      };

      recognition.onerror = () => {
        // Swallow errors and continue without transcription.
        stopBrowserTranscription();
      };

      recognition.start();
      setIsTranscribing(true);
    } catch {
      // Ignore and continue without transcription.
    }
  };

  const stopBrowserTranscription = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    recognitionRef.current = null;
    setIsTranscribing(false);
  };

  const captureHeuristics = () => {
    const text = transcription.trim();
    if (!text) return undefined;
    const words = text.split(/\s+/).length;
    const durationSeconds = Math.max(1, (performance.now() - startTimeRef.current) / 1000);
    const wpm = (words / durationSeconds) * 60;
    let emotionLabel = 'neutral';
    if (wpm > 160) emotionLabel = 'excited';
    if (wpm > 190) emotionLabel = 'anxious';
    if (wpm < 90) emotionLabel = 'calm';
    return {
      transcript: text,
      emotionLabel,
      emotionScore: undefined,
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-2xl w-full"
      >
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="p-3 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 shadow-lg"
          >
            <Brain className="size-8 text-white" />
          </motion.div>
          <h1 className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            NeuroSync AI
          </h1>
        </motion.div>

        {/* Cancel button */}
        <div className="flex justify-end mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="rounded-full"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Recording button - clickable to stop */}
        <button
          onClick={handleStopRecording}
          className="relative w-64 h-64 mx-auto mb-8 cursor-pointer group"
          disabled={isSaving}
        >
          {/* Animated pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          {/* Main button */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 shadow-2xl flex flex-col items-center justify-center ${isSaving ? '' : 'group-hover:scale-105 transition-transform'}`}>
            <motion.div
              animate={{
                scale: isRecording && !isSaving ? [1, 1.2, 1] : [1, 1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Mic className="size-16 text-white mb-4" />
            </motion.div>
            <div className="text-white text-xl">Recording...</div>
            <div className="text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Tap to stop
            </div>
          </div>
        </button>

        {/* Waveform */}
        <div className="mb-6">
          <WaveformAnimation isActive={isRecording} />
        </div>

        {/* Microcopy */}
        <p className="text-slate-500 text-sm">Speak naturally • Tap circle to stop recording</p>
      </motion.div>
    </div>
  );
}
