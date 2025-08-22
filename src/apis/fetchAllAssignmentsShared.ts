import { setAssignments, setAssignmentsLoading, setAssignmentsFailed } from '../store/assignmentSlice';
import { fetchAssignmentsForCourses } from '../apis/fetchAllAssignments';

export async function fetchAllAssignments({
  courseList,
  apiKey,
  baseUrl,
  assignmentsStatus,
  assignments,
  dispatch
}: {
  courseList: any[];
  apiKey: string;
  baseUrl: string;
  assignmentsStatus: string;
  assignments: any[];
  dispatch: any;
}) {
    console.log({ courseList, apiKey, baseUrl, assignmentsStatus, assignments })
  if (
    courseList &&
    courseList.length > 0 &&
    apiKey &&
    baseUrl &&
    assignmentsStatus !== 'loading' 
  ) {
    dispatch(setAssignmentsLoading());
    try {
      const result = await fetchAssignmentsForCourses(apiKey, baseUrl, courseList);
      dispatch(setAssignments(result));
    } catch (err) {
      dispatch(setAssignmentsFailed());
    }
  }
}
