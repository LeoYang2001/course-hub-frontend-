// Grade & progress calculation helpers
import type { Course } from "./courses";
import type { Assignment } from "./assignments";

export function computeCourseAggregates(course: Course, assignments: Assignment[]) {
  const courseAssignments = assignments.filter(a => a.courseId === course.id);
  const totalWeightDefinedPct = courseAssignments.reduce((sum, a) => sum + (a.weightPct || 0), 0);
  const completed = courseAssignments.filter(a => a.status === "Graded" || a.status === "Submitted");
  const weightCompletedPct = completed.reduce((sum, a) => sum + (a.weightPct || 0), 0);
  const weightedEarnedPct = completed.reduce((sum, a) => sum + ((a.score && a.pointsPossible) ? (a.score / a.pointsPossible) * (a.weightPct || 0) : 0), 0);
  return { totalWeightDefinedPct, weightCompletedPct, weightedEarnedPct };
}
