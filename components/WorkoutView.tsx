import React, { useState } from 'react';
import { UserSettings } from '../types';
import { calculateSets } from '../utils';
import { Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';

interface WorkoutViewProps {
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({ settings, setSettings }) => {
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());

  const handleWeekChange = (week: number) => {
    if (week >= 1 && week <= 4) {
      setSettings({ ...settings, currentWeek: week as 1 | 2 | 3 | 4 });
    }
  };

  const toggleExercise = (id: string) => {
    const newExpanded = new Set(expandedExercises);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedExercises(newExpanded);
  };

  return (
    <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Week Selector - Mobile Optimized */}
      <section className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((week) => (
              <button
                  key={week}
                  onClick={() => handleWeekChange(week)}
                  className={`
                      h-14 rounded-xl font-bold text-xl transition-all flex items-center justify-center
                      ${settings.currentWeek === week 
                          ? 'bg-gym-accent text-white shadow-lg shadow-blue-900/30 scale-105' 
                          : 'bg-gym-card text-gym-muted border border-gym-border hover:border-gym-muted active:scale-95'}
                  `}
              >
                  {week === 4 ? 'D' : week}
              </button>
          ))}
      </section>

      {settings.exercises.length === 0 && (
        <div className="text-center py-24 px-6 text-gym-muted bg-gym-card rounded-2xl border border-dashed border-gym-border">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gym-border/50 mb-4">
              <Dumbbell className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium mb-2">No exercises configured</p>
            <p className="text-sm text-gym-muted/70">Go to Settings to add your Training Max values</p>
        </div>
      )}

      {settings.exercises.map((exercise) => {
        const sets = calculateSets(exercise, settings);
        const isExpanded = expandedExercises.has(exercise.id);

        return (
          <div 
            key={exercise.id} 
            className={`
              bg-gym-card rounded-2xl border transition-colors overflow-hidden
              ${isExpanded ? 'border-gym-border' : 'border-transparent hover:border-gym-border'}
            `}
          >
            <button 
              onClick={() => toggleExercise(exercise.id)}
              className="w-full bg-zinc-800/30 p-5 flex justify-between items-center hover:bg-zinc-800/50 transition-colors active:bg-zinc-800/60"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-all ${isExpanded ? 'bg-gym-accent/10 text-gym-accent' : 'bg-zinc-800 text-gym-muted'}`}>
                   <Dumbbell className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-bold text-white">
                    {exercise.name}
                  </h2>
                  {!isExpanded && (
                    <p className="text-sm text-gym-muted font-mono mt-1">
                      TM: {exercise.trainingMax} {settings.unit}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 {isExpanded && (
                   <span className="text-sm font-mono bg-black/30 px-3 py-1.5 rounded-lg text-gym-muted">
                    {exercise.trainingMax}
                   </span>
                 )}
                 {isExpanded ? <ChevronUp className="w-6 h-6 text-gym-muted" /> : <ChevronDown className="w-6 h-6 text-gym-muted" />}
              </div>
            </button>

            {isExpanded && (
              <div className="p-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-3">
                        {sets.map((set, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between p-4 rounded-xl border bg-gym-bg border-gym-border text-gym-text hover:border-gym-muted/50 transition-colors"
                          >
                               <div className="flex flex-col gap-1">
                                  <span className="text-sm font-medium text-gym-muted">Set {idx + 1}</span>
                                  <span className="font-mono text-sm text-gym-muted/70">{(set.percent * 100).toFixed(0)}%</span>
                               </div>
                               <div className="flex flex-col items-center gap-0.5">
                                   <span className="text-3xl font-bold font-mono tracking-tight tabular-nums">{set.weight}</span>
                                   <span className="text-xs font-medium text-gym-muted uppercase tracking-wide">{settings.unit}</span>
                               </div>
                                 <div className="flex flex-col items-end gap-1">
                                  <span className="text-2xl font-bold tabular-nums">
                                    {set.reps}
                                  </span>
                                  <span className="text-xs text-gym-muted uppercase tracking-wide">reps</span>
                               </div>
                          </div>
                      ))}
                  </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};