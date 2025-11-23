export interface Exercise {
  id: string;
  name: string;
  trainingMax: number; // Changed from oneRepMax + percentage to direct TM
}

export interface UserSettings {
  exercises: Exercise[];
  currentWeek: 1 | 2 | 3 | 4;
  rounding: number; // e.g., 2.5 or 5
  unit: 'kg' | 'lbs';
}

export interface SetData {
  reps: string | number;
  percent: number;
  weight: number;
  type: 'MAIN';
}

export const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', name: 'Squat', trainingMax: 90 },
  { id: '2', name: 'Bench Press', trainingMax: 70 },
  { id: '3', name: 'Deadlift', trainingMax: 130 },
  { id: '4', name: 'Overhead Press', trainingMax: 45 },
];

export const DEFAULT_SETTINGS: UserSettings = {
  exercises: DEFAULT_EXERCISES,
  currentWeek: 1,
  rounding: 2.5,
  unit: 'kg',
};