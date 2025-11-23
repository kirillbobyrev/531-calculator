import React, { useRef } from 'react';
import { UserSettings, Exercise } from '../types';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

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
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    // Needed for mobile drag preview sometimes, or just standard behavior
    e.dataTransfer.effectAllowed = "move";
    // Make the drag ghost cleaner if desired, but default is fine for now
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) {
        dragItem.current = null;
        dragOverItem.current = null;
        return;
    }

    const copyListItems = [...settings.exercises];
    const dragItemContent = copyListItems[dragItem.current];
    
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    
    setSettings({ ...settings, exercises: copyListItems });
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
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
            >
              
              {/* Drag Handle */}
              <div className="cursor-grab active:cursor-grabbing text-gym-muted hover:text-white touch-none">
                  <GripVertical className="w-5 h-5" />
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
                        type="number"
                        value={ex.trainingMax}
                        onChange={(e) => updateExercise(ex.id, 'trainingMax', parseFloat(e.target.value) || 0)}
                        className="w-20 bg-gym-bg text-right text-white font-mono p-2 rounded-lg border border-gym-border focus:border-gym-accent focus:outline-none"
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
                    onChange={(e) => setSettings({...settings, unit: e.target.value as 'kg' | 'lbs'})}
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
                    onChange={(e) => setSettings({...settings, rounding: parseFloat(e.target.value)})}
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