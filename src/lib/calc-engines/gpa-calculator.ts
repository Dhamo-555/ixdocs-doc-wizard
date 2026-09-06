/**
 * GPA (Grade Point Average) Engine
 */

export interface CourseEntry {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

export const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

export interface GpaCalculationResult {
  gpa: number;
  totalCredits: number;
  totalGradePoints: number;
  courseCount: number;
}

export function calculateGpa(courses: CourseEntry[]): GpaCalculationResult {
  let totalCredits = 0;
  let totalPoints = 0;
  let count = 0;

  for (const c of courses) {
    const credits = Math.max(0, c.credits || 0);
    const points = GRADE_POINTS[c.grade] ?? 0;
    if (credits > 0) {
      totalCredits += credits;
      totalPoints += points * credits;
      count++;
    }
  }

  const gpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;

  return {
    gpa,
    totalCredits,
    totalGradePoints: Math.round(totalPoints * 100) / 100,
    courseCount: count,
  };
}

export function calculateCumulativeGpa(
  priorGpa: number,
  priorCredits: number,
  currentPoints: number,
  currentCredits: number,
): number {
  const allCredits = priorCredits + currentCredits;
  if (allCredits <= 0) return 0;
  const allPoints = priorGpa * priorCredits + currentPoints;
  return Math.round((allPoints / allCredits) * 100) / 100;
}
