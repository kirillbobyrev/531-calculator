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
    <div className="pb-24 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Week Selector - Simplified */}
      <section className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((week) => (
              <button
                  key={week}
                  onClick={() => handleWeekChange(week)}
                  className={`
                      h-12 rounded-lg font-bold text-lg transition-all flex items-center justify-center
                      ${settings.currentWeek === week 
                          ? 'bg-gym-accent text-white shadow-lg shadow-blue-900/20' 
                          : 'bg-gym-card text-gym-muted border border-gym-border hover:border-gym-muted'}
                  `}
              >
                  {week === 4 ? 'D' : week}
              </button>
          ))}
      </section>

      {settings.exercises.length === 0 && (
        <div className="text-center py-20 text-gym-muted bg-gym-card rounded-xl border border-dashed border-gym-border">
            <p>No exercises configured.</p>
            <p className="text-sm mt-2">Go to Settings to add your TMs.</p>
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
              className="w-full bg-zinc-800/30 p-4 flex justify-between items-center hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isExpanded ? 'bg-gym-accent/10 text-gym-accent' : 'bg-zinc-800 text-gym-muted'}`}>
                   <Dumbbell className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h2 className="text-base font-bold text-white">
                    {exercise.name}
                  </h2>
                  {!isExpanded && (
                    <p className="text-xs text-gym-muted font-mono mt-0.5">
                      TM: {exercise.trainingMax} {settings.unit}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 {isExpanded && (
                   <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-gym-muted">
                    TM: {exercise.trainingMax}
                   </span>
                 )}
                 {isExpanded ? <ChevronUp className="w-5 h-5 text-gym-muted" /> : <ChevronDown className="w-5 h-5 text-gym-muted" />}
              </div>
            </button>

            {isExpanded && (
              <div className="p-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                      {sets.map((set, idx) => (
                          <div 
                              key={idx} 
                              className={`
                                  flex items-center justify-between p-3 rounded-lg border 
                                  ${set.reps.toString().includes('+') 
                                      ? 'bg-blue-900/10 border-blue-800/50 text-blue-100' 
                                      : 'bg-gym-bg border-gym-border text-gym-text'}
                              `}
                          >
                               <div className="flex flex-col">
                                  <span className="text-xs text-gym-muted opacity-70">Set {idx + 1}</span>
                                  <span className="font-mono text-xs opacity-50">{(set.percent * 100).toFixed(0)}%</span>
                               </div>
                               <div className="flex items-baseline gap-1">
                                   <span className="text-xl font-bold font-mono tracking-tighter">{set.weight}</span>
                                   <span className="text-xs text-gym-muted">{settings.unit}</span>
                               </div>
                               <div className="w-16 text-right">
                                  <span className={`text-lg font-bold ${set.reps.toString().includes('+') ? 'text-gym-accent' : ''}`}>
                                      x{set.reps}
                                  </span>
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