import { LOCAL_PROXY_BASE_URL } from "./apiConfig";

export async function fetchCourses(apiKey: string, baseUrl: string, term: string): Promise<any[]> {
  // Fetch from local proxy server, passing both apiKey and baseUrl as query params
  const LOCAL_PROXY_URL = `${LOCAL_PROXY_BASE_URL}/canvas/courses?apiKey=${encodeURIComponent(apiKey)}&baseUrl=${encodeURIComponent(baseUrl)}`;

  try {
    const response = await fetch(LOCAL_PROXY_URL, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allCourses = await response.json() as any[];
    // Filter by term in course name
    const filtered = allCourses.filter(course => course.name && course.name.includes(term));
    return filtered;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
}