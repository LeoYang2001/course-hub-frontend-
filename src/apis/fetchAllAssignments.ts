//create a function that receives a list of courses and fetch assignments based on the course.id, for fetching assignments for one course, use api fetchAssignment
//each course should return an array of assignments, to fetch all assignments, mesh the results into a single array

import { fetchAssignment } from './fetchAssignment';

export async function fetchAssignmentsForCourses(apiKey: string, baseUrl: string, courses: { id: number }[]) {
  const allAssignments: any[] = [];
  for (const course of courses) {
    const assignments = await fetchAssignment(apiKey, baseUrl, course.id);
    allAssignments.push(...assignments);
  }
  return allAssignments;
}
