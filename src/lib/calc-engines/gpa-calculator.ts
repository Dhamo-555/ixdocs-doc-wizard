/**
 * GPA / SGPA / CGPA Engine — 10-Point Grading Scale (UGC / AICTE / Indian Universities)
 */

export interface CourseEntry {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

export const GRADE_POINTS: Record<string, number> = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  F: 0,
};

export const GRADE_DESCRIPTIONS: Record<string, string> = {
  O: "Outstanding (10)",
  "A+": "Excellent (9)",
  A: "Very Good (8)",
  "B+": "Good (7)",
  B: "Above Average (6)",
  C: "Pass (5)",
  F: "Reappear / Fail (0)",
};

export interface GpaCalculationResult {
  gpa: number;
  totalCredits: number;
  totalGradePoints: number;
  courseCount: number;
  percentageEquivalent: number;
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
  // Standard UGC conversion guideline: Percentage ≈ (CGPA / SGPA) × 9.5 or 10.0 (using 9.5 standard)
  const percentageEquivalent = Math.round(gpa * 9.5 * 10) / 10;

  return {
    gpa,
    totalCredits,
    totalGradePoints: Math.round(totalPoints * 100) / 100,
    courseCount: count,
    percentageEquivalent,
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

export interface SemesterEntry {
  id: string;
  name: string;
  sgpa: number;
  credits: number;
}

export function calculateCgpaFromSemesters(semesters: SemesterEntry[]): {
  cgpa: number;
  totalCredits: number;
  totalPoints: number;
  percentageEquivalent: number;
} {
  let totalCredits = 0;
  let totalPoints = 0;

  for (const s of semesters) {
    const credits = Math.max(0, s.credits || 0);
    const sgpa = Math.max(0, Math.min(10, s.sgpa || 0));
    if (credits > 0) {
      totalCredits += credits;
      totalPoints += sgpa * credits;
    }
  }

  const cgpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
  const percentageEquivalent = Math.round(cgpa * 9.5 * 10) / 10;

  return {
    cgpa,
    totalCredits,
    totalPoints: Math.round(totalPoints * 100) / 100,
    percentageEquivalent,
  };
}
