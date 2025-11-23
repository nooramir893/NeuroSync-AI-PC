import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, Play, Zap, Target, Lightbulb, Mic, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface HistoryEntry {
  id?: string;
  emoji?: string;
  mood_title?: string;
  mood_summary?: string;
  status?: string;
  created_at?: string;
  energy_level?: number | null;
  transcript?: string | null;
  workout?: string[] | string | null;
  habit_title?: string | null;
  habit_description?: string | null;
  insight?: string | null;
  plan_help?: string | null;
  prediction?: string | null;
}

interface HistoryScreenProps {
  onRerunCheckIn: () => void;
  entries: HistoryEntry[];
  loading?: boolean;
  onBackToPlan?: () => void;
}

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, today)) return 'Today';
  if (sameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export function HistoryScreen({ onRerunCheckIn, entries, loading, onBackToPlan }: HistoryScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const list = useMemo(() => entries || [], [entries]);
  const selected = selectedIndex !== null ? list[selectedIndex] : null;

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-slate-900 mb-2">Your Journey</h2>
            <p className="text-slate-600">Track your emotional patterns over time</p>
          </div>
          <div className="flex gap-3">
            {onBackToPlan && (
              <Button
                variant="outline"
                onClick={onBackToPlan}
                className="rounded-2xl border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                Back to Plan
              </Button>
            )}
            <Button
              onClick={onRerunCheckIn}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-2xl px-6"
            >
              <Play className="size-4 mr-2" />
              New Check-In
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Calendar className="size-5 text-slate-600" />
          <h3 className="text-slate-900">Check-In History</h3>
        </div>

        {loading && <p className="text-slate-500">Loading history...</p>}
        {!loading && list.length === 0 && (
          <p className="text-slate-500">No check-ins yet. Do a new check-in to see it here.</p>
        )}

        <div className="space-y-4">
          {list.map((entry, index) => {
            const energy =
              typeof entry.energy_level === 'number'
                ? Math.max(0, Math.min(100, entry.energy_level))
                : null;
            const status = entry.status === 'Completed' ? 'Completed' : 'In Progress';
            const statusClass =
              status === 'Completed' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700';
            const title = entry.mood_title || entry.mood_summary || 'Check-in';

            return (
              <motion.div
                key={entry.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                onClick={() => setSelectedIndex(index)}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-[8px_8px_24px_rgba(163,177,198,0.15),-8px_-8px_24px_rgba(255,255,255,0.8)] hover:shadow-[10px_10px_30px_rgba(163,177,198,0.2),-10px_-10px_30px_rgba(255,255,255,0.9)] transition-shadow cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{entry.emoji || '🧠'}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-slate-900 font-medium">{title}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>{status}</span>
                      </div>
                      <p className="text-slate-500 text-sm">{formatDate(entry.created_at)}</p>
                    </div>
                  </div>

                  {energy !== null && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 min-w-[200px]">
                      <span className="text-slate-500">Energy</span>
                      <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-400 to-blue-400"
                          style={{ width: `${energy}%` }}
                        />
                      </div>
                      <span className="text-slate-900 font-medium">{energy}%</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setSelectedIndex(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 20 }}
              transition={{ type: 'spring', duration: 0.45 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedIndex(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{selected.emoji || '🧠'}</div>
                    <div>
                      <h3 className="text-slate-900 mb-1">
                        {selected.mood_title || selected.mood_summary || 'Check-in'}
                      </h3>
                      <p className="text-slate-500 text-sm">{formatDate(selected.created_at)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedIndex(null)}
                    className="p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors"
                  >
                    <X className="size-5 text-slate-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  {(selected.transcript || selected.mood_summary) && (
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/60 to-pink-50/60 border border-purple-100/60">
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className="size-5 text-purple-600" />
                        <h4 className="text-slate-900">Voice Analysis</h4>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {selected.transcript || selected.mood_summary}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-slate-900 mb-4">Personalized Recommendations</h4>
                    <div className="space-y-3">
                      {selected.workout && (
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm">
                          <div className="p-2 rounded-xl bg-orange-50">
                            <Zap className="size-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-slate-900 mb-1">Energy Surge Workout</p>
                            <p className="text-slate-600 text-sm">
                              {Array.isArray(selected.workout) ? selected.workout.join(', ') : selected.workout}
                            </p>
                          </div>
                        </div>
                      )}

                      {selected.habit_title && (
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm">
                          <div className="p-2 rounded-xl bg-teal-50">
                            <Target className="size-5 text-teal-500" />
                          </div>
                          <div>
                            <p className="text-slate-900 mb-1">Habit Tracker</p>
                            <p className="text-slate-600 text-sm">
                              {selected.habit_description || selected.habit_title}
                            </p>
                          </div>
                        </div>
                      )}

                      {selected.prediction && (
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm">
                          <div className="p-2 rounded-xl bg-blue-50">
                            <Sparkles className="size-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-slate-900 mb-1">Prediction</p>
                            <p className="text-slate-600 text-sm">{selected.prediction}</p>
                          </div>
                        </div>
                      )}

                      {(selected.plan_help || selected.insight) && (
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm">
                          <div className="p-2 rounded-xl bg-amber-50">
                            <Lightbulb className="size-5 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-slate-900 mb-1">Insight</p>
                            <p className="text-slate-600 text-sm">
                              {selected.plan_help || selected.insight}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
