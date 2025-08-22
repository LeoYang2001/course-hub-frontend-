import { LOCAL_PROXY_BASE_URL } from "./apiConfig";




// export async function scheduleReminder({assignments} : {assignments: []}) {
//   const LOCAL_PROXY_URL = `${LOCAL_PROXY_BASE_URL}/canvas/schedule_reminder`;

//   try {
//     const response = await fetch(LOCAL_PROXY_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(params)
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error("Failed to schedule reminder:", error);
//     throw error;
//   }
// }
