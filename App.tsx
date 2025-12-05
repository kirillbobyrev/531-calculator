import { useState, useEffect } from 'react';
import { Settings, Dumbbell } from 'lucide-react';
import { UserSettings, DEFAULT_SETTINGS } from './types';
import { SettingsView } from './components/SettingsView';
import { WorkoutView } from './components/WorkoutView';

// Updated version to force a fresh start with new data structure (TM instead of 1RM)
const STORAGE_KEY = 'simple_531_data_v2';

function App() {
  const [view, setView] = useState<'WORKOUT' | 'SETTINGS'>('WORKOUT');
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Simple validation to ensure we don't crash if structure doesn't match perfectly
        if (parsed && parsed.exercises) {
          setSettings(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, loaded]);

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-gym-bg text-gym-text font-sans selection:bg-gym-accent selection:text-white">
      <div className="max-w-md mx-auto min-h-screen relative flex flex-col">

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 pb-32">
          {view === 'WORKOUT' ? (
            <WorkoutView settings={settings} setSettings={setSettings} />
          ) : (
            <SettingsView settings={settings} setSettings={setSettings} />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 border-t border-gym-border bg-gym-bg/95 backdrop-blur-lg z-50">
          <div className="max-w-md mx-auto px-4 pb-[max(env(safe-area-inset-bottom),0px)]">
            <div className="grid grid-cols-2 py-3">
              <button
                onClick={() => setView('WORKOUT')}
                className={`flex flex-col items-center justify-center gap-1.5 py-2 transition-all active:scale-95 ${view === 'WORKOUT' ? 'text-gym-accent' : 'text-gym-muted hover:text-white'
                  }`}
              >
                <Dumbbell className={`w-7 h-7 ${view === 'WORKOUT' ? 'fill-current' : ''}`} />
                <span className="text-sm font-semibold">Workout</span>
              </button>

              <button
                onClick={() => setView('SETTINGS')}
                className={`flex flex-col items-center justify-center gap-1.5 py-2 transition-all active:scale-95 ${view === 'SETTINGS' ? 'text-gym-accent' : 'text-gym-muted hover:text-white'
                  }`}
              >
                <Settings className={`w-7 h-7 ${view === 'SETTINGS' ? 'animate-spin-slow' : ''}`} />
                <span className="text-sm font-semibold">Settings</span>
              </button>
            </div>
          </div>
        </nav>

      </div>
    </div>
  );
}

export default App;