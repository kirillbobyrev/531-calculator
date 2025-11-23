import React from 'react';
import { UserSettings, Exercise } from '../types';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {

  const [tmDrafts, setTmDrafts] = React.useState<Record<string, string>>({});

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    const newExercises = settings.exercises.map((ex) => {
      if (ex.id === id) {
        return { ...ex, [field]: value };
      }
      return ex;
    });
    setSettings({ ...settings, exercises: newExercises });
  };

  const addExercise = () => {
    const newEx: Exercise = {
      id: Date.now().toString(),
      name: 'New Lift',
      trainingMax: 0,
    };
    setSettings({ ...settings, exercises: [...settings.exercises, newEx] });
  };

  const removeExercise = (id: string) => {
    setSettings({
      ...settings,
      exercises: settings.exercises.filter((ex) => ex.id !== id),
    });
    setTmDrafts((prev) => {
      if (!(id in prev)) {
        return prev;
      }
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const moveExercise = (from: number, to: number) => {
    if (
      from === to ||
      from < 0 ||
      to < 0 ||
      from >= settings.exercises.length ||
      to >= settings.exercises.length
    ) {
      return;
    }

    const updatedExercises = [...settings.exercises];
    const [item] = updatedExercises.splice(from, 1);
    updatedExercises.splice(to, 0, item);

    setSettings({ ...settings, exercises: updatedExercises });
  };

  const handleTrainingMaxFocus = (
    event: React.FocusEvent<HTMLInputElement>,
    exercise: Exercise
  ) => {
    const target = event.currentTarget;
    setTmDrafts((prev) => {
      if (prev[exercise.id] !== undefined) {
        return prev;
      }
      return { ...prev, [exercise.id]: exercise.trainingMax.toString() };
    });

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        target.select();
      });
    } else {
      target.select();
    }
  };

  const handleTrainingMaxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    exerciseId: string
  ) => {
    const rawValue = event.target.value;
    setTmDrafts((prev) => ({ ...prev, [exerciseId]: rawValue }));

    if (rawValue === '' || rawValue === '.') {
      return;
    }

    const parsedValue = parseFloat(rawValue);
    if (!Number.isNaN(parsedValue)) {
      updateExercise(exerciseId, 'trainingMax', parsedValue);
    }
  };

  const handleTrainingMaxBlur = (exerciseId: string) => {
    setTmDrafts((prev) => {
      if (prev[exerciseId] === undefined) {
        return prev;
      }
      const { [exerciseId]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div className="pb-24 space-y-8 animate-in fade-in duration-300">

      {/* Lifts Configuration */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Training Max (TM) Inputs</h2>
          <button
            onClick={addExercise}
            className="p-2 bg-gym-card border border-gym-border rounded-full hover:bg-gym-border transition-colors"
          >
            <Plus className="w-5 h-5 text-gym-accent" />
          </button>
        </div>

        <div className="space-y-3">
          {settings.exercises.map((ex, index) => (
            <div
              key={ex.id}
              className="bg-gym-card p-4 rounded-xl border border-gym-border flex items-center gap-4 group"
            >

              {/* Reorder Buttons */}
              <div className="flex flex-col items-center gap-1 text-gym-muted">
                <button
                  type="button"
                  onClick={() => moveExercise(index, index - 1)}
                  disabled={index === 0}
                  className="p-1 rounded-md border border-transparent hover:border-gym-border hover:text-white disabled:opacity-30 disabled:hover:border-transparent"
                  aria-label="Move exercise up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveExercise(index, index + 1)}
                  disabled={index === settings.exercises.length - 1}
                  className="p-1 rounded-md border border-transparent hover:border-gym-border hover:text-white disabled:opacity-30 disabled:hover:border-transparent"
                  aria-label="Move exercise down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={ex.name}
                  onChange={(e) => updateExercise(ex.id, 'name', e.target.value)}
                  className="w-full bg-transparent text-white font-semibold focus:outline-none focus:text-gym-accent placeholder-gym-muted/50"
                  placeholder="Exercise Name"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gym-muted uppercase tracking-wider">Training Max</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={tmDrafts[ex.id] ?? ex.trainingMax.toString()}
                    onFocus={(e) => handleTrainingMaxFocus(e, ex)}
                    onChange={(e) => handleTrainingMaxChange(e, ex.id)}
                    onBlur={() => handleTrainingMaxBlur(ex.id)}
                    inputMode="decimal"
                    pattern="[0-9]*"
                    className="w-20 bg-gym-bg text-right text-white font-mono p-2 rounded-lg border border-gym-border focus:border-gym-accent focus:outline-none no-spinner"
                  />
                </div>
                <button
                  onClick={() => removeExercise(ex.id)}
                  className="p-2 text-gym-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Unit & Rounding */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">Preferences</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gym-card p-3 rounded-xl border border-gym-border">
            <label className="text-xs text-gym-muted block mb-2">Unit</label>
            <select
              value={settings.unit}
              onChange={(e) => setSettings({ ...settings, unit: e.target.value as 'kg' | 'lbs' })}
              className="w-full bg-gym-bg text-white p-2 rounded-lg outline-none border border-gym-border"
            >
              <option value="kg">KG</option>
              <option value="lbs">LBS</option>
            </select>
          </div>
          <div className="bg-gym-card p-3 rounded-xl border border-gym-border">
            <label className="text-xs text-gym-muted block mb-2">Rounding</label>
            <select
              value={settings.rounding}
              onChange={(e) => setSettings({ ...settings, rounding: parseFloat(e.target.value) })}
              className="w-full bg-gym-bg text-white p-2 rounded-lg outline-none border border-gym-border"
            >
              <option value="1">1</option>
              <option value="2.5">2.5</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
};