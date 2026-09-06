/**
 * Calorie, BMR & Daily Caloric Needs Engine (Mifflin-St Jeor)
 */

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "veryActive";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export interface CalorieResult {
  bmr: number;
  maintenance: number;
  mildLoss: number;
  weightLoss: number;
  extremeLoss: number;
  mildGain: number;
  weightGain: number;
}

export function calculateCalories(
  gender: "male" | "female",
  age: number,
  weightKg: number,
  heightCm: number,
  activity: ActivityLevel,
): CalorieResult {
  const w = Math.max(1, weightKg);
  const h = Math.max(30, heightCm);
  const a = Math.max(10, age);

  // Mifflin - St Jeor Equation
  let bmr = 10 * w + 6.25 * h - 5 * a;
  bmr += gender === "male" ? 5 : -161;

  const multiplier = ACTIVITY_MULTIPLIERS[activity] || 1.2;
  const maintenance = Math.round(bmr * multiplier);

  return {
    bmr: Math.round(bmr),
    maintenance,
    mildLoss: Math.max(1200, maintenance - 250),
    weightLoss: Math.max(1200, maintenance - 500),
    extremeLoss: Math.max(1200, maintenance - 1000),
    mildGain: maintenance + 250,
    weightGain: maintenance + 500,
  };
}
