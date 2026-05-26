export interface WeightRecord {
  date: string;
  weight: number;
}

export interface BMIResult {
  bmi: number;
  category: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
}

export interface AIExerciseTask {
  name: string;
  type: string;
  frequency: string;
  duration: string;
  notes: string;
}

export interface AIMealTask {
  meal: string;
  foods: string;
  calories: string;
  notes: string;
}

export interface AIPlan {
  exercise_plan: AIExerciseTask[];
  meal_plan: AIMealTask[];
}

export interface ExerciseEntry {
  id: string;
  day: string;
  name: string;
  type: string;
  duration: string;
  notes: string;
  completed: boolean;
}

export type TabType = 'bmi' | 'tracker' | 'recommendations';
