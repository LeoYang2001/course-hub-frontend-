import { LOCAL_PROXY_BASE_URL } from "./apiConfig";
export async function fetchCourseDetail(apiKey: string, baseUrl: string, courseId: number): Promise<any> {
  const LOCAL_PROXY_URL = `${LOCAL_PROXY_BASE_URL}/canvas/course?apiKey=${encodeURIComponent(apiKey)}&baseUrl=${encodeURIComponent(baseUrl)}&courseId=${encodeURIComponent(courseId)}`;

  try {
    const response = await fetch(LOCAL_PROXY_URL, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch course detail:", error);
    return null;
  }
}
