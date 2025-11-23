import { UserSettings, SetData, Exercise } from './types';

// Round weight to nearest X
const roundWeight = (weight: number, rounding: number): number => {
  return Math.round(weight / rounding) * rounding;
};

export const calculateSets = (
  exercise: Exercise,
  settings: UserSettings
): SetData[] => {
  const { currentWeek, rounding } = settings;
  const tm = exercise.trainingMax;

  let mainSets: { percent: number; reps: string | number }[] = [];

  // 5/3/1 Standard Progression
  if (currentWeek === 1) {
    // 5/5/5+
    mainSets = [
      { percent: 0.65, reps: 5 },
      { percent: 0.75, reps: 5 },
      { percent: 0.85, reps: '5+' },
    ];
  } else if (currentWeek === 2) {
    // 3/3/3+
    mainSets = [
      { percent: 0.70, reps: 3 },
      { percent: 0.80, reps: 3 },
      { percent: 0.90, reps: '3+' },
    ];
  } else if (currentWeek === 3) {
    // 5/3/1+
    mainSets = [
      { percent: 0.75, reps: 5 },
      { percent: 0.85, reps: 3 },
      { percent: 0.95, reps: '1+' },
    ];
  } else if (currentWeek === 4) {
    // Deload
    mainSets = [
      { percent: 0.40, reps: 5 },
      { percent: 0.50, reps: 5 },
      { percent: 0.60, reps: 5 },
    ];
  }

  const calculatedSets: SetData[] = mainSets.map((s) => ({
    reps: s.reps,
    percent: s.percent,
    weight: roundWeight(tm * s.percent, rounding),
    type: 'MAIN',
  }));

  return calculatedSets;
};