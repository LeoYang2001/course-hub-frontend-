
export type Assignment = {
  course_id: number;
  created_at: string;
  due_at: string;
  grading_type: string;
  id: number;
  lock_at: string;
  is_quiz_assignment: boolean;
  lock_explanation: string;
  name: string;
  points_possible: number;
};
