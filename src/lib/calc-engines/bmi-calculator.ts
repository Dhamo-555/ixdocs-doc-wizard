/**
 * BMI (Body Mass Index) Engine
 */

export interface BmiResult {
  bmi: number;
  category: "Underweight" | "Normal weight" | "Overweight" | "Obesity";
  healthyWeightMin: number;
  healthyWeightMax: number;
  prime: number;
  ponderalIndex: number;
}

export function calculateBmiMetric(weightKg: number, heightCm: number): BmiResult {
  const w = Math.max(1, weightKg);
  const hMeters = Math.max(0.3, heightCm / 100);

  const bmiRaw = w / (hMeters * hMeters);
  const bmi = Math.round(bmiRaw * 10) / 10;

  let category: BmiResult["category"] = "Normal weight";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25.0) category = "Normal weight";
  else if (bmi < 30.0) category = "Overweight";
  else category = "Obesity";

  const healthyMin = Math.round(18.5 * hMeters * hMeters * 10) / 10;
  const healthyMax = Math.round(24.9 * hMeters * hMeters * 10) / 10;
  const prime = Math.round((bmi / 25) * 100) / 100;
  const ponderalIndex = Math.round((w / Math.pow(hMeters, 3)) * 10) / 10;

  return {
    bmi,
    category,
    healthyWeightMin: healthyMin,
    healthyWeightMax: healthyMax,
    prime,
    ponderalIndex,
  };
}

export function calculateBmiImperial(
  weightLbs: number,
  heightFeet: number,
  heightInches: number,
): BmiResult {
  const totalInches = heightFeet * 12 + heightInches;
  const heightCm = totalInches * 2.54;
  const weightKg = weightLbs * 0.45359237;
  return calculateBmiMetric(weightKg, heightCm);
}
