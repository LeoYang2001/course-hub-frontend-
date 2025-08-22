import { LOCAL_PROXY_BASE_URL } from "./apiConfig";

export async function fetchAssignmentGrade(
  apiKey: string,
  baseUrl: string,
  courseId: number,
  assignmentId: number
) {
  const url = `${LOCAL_PROXY_BASE_URL}/canvas/assignmentDetail?apiKey=${encodeURIComponent(apiKey)}&baseUrl=${encodeURIComponent(baseUrl)}&courseId=${courseId}&assignmentId=${assignmentId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch assignment grade: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching assignment grade:', err);
    return null;
  }
}