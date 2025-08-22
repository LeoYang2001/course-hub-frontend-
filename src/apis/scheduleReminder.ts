import { LOCAL_PROXY_BASE_URL } from "./apiConfig";

interface CustomTimeAssignment {
  id: number;
  name: string;
  due_date: string;
  course_code: string;
  reminder_date: string;
}

interface ScheduleReminderParams {
  assignments: CustomTimeAssignment[];
}

export async function dueTimeBaseReminder(grouped: {
  [reminderTime: string]: {
    id: number;
    name: string;
    due_date: string;
    course_code: string;
  }[];
}) {
  const to = 'jya261@uky.edu';
  const subject = 'ASSIGNMENT REMINDER';
  let scheduledIds: number[] = [];
  try {
    const stored = localStorage.getItem('scheduled_assignments');
    if (stored) {
      scheduledIds = JSON.parse(stored);
    }
  } catch (e) {
    scheduledIds = [];
  }
  for (const reminderTime in grouped) {
    const assignments = grouped[reminderTime];
    const text = assignments.map(assignment => {
      const dateObj = new Date(assignment.due_date);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
      return `• ${assignment.name}\n   Course: ${assignment.course_code}\n   Due: ${formattedDate}`;
    }).join('\n\n');
    await scheduleReminder({
      time: reminderTime,
      to,
      subject,
      text
    });
    // Push scheduled assignment ids one by one
    assignments.forEach(assignment => {
      if (!scheduledIds.includes(assignment.id)) {
        scheduledIds.push(assignment.id);
      }
    });
  }
  localStorage.setItem('scheduled_assignments', JSON.stringify(scheduledIds));
}

export async function handleCustomTimeReminder({assignments}: ScheduleReminderParams){
    console.log('Custom time reminder for assignments:', assignments);
    if (!assignments.length) return;
    // Use the reminder_date from the first assignment (all have same reminder_date)
    const reminder_date = assignments[0].reminder_date;
    const subject = 'ASSIGNMENT REMINDER';
    const text = assignments.map(assignment => {
      const dateObj = new Date(assignment.due_date);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
      return `• ${assignment.name}\n   Course: ${assignment.course_code}\n   Due: ${formattedDate}`;
    }).join('\n\n');
    const to = 'jya261@uky.edu';
    await scheduleReminder({ time: reminder_date, to, subject, text });
    // Push all scheduled assignment ids together
    let scheduledIds: number[] = [];
    try {
      const stored = localStorage.getItem('scheduled_assignments');
      if (stored) {
        scheduledIds = JSON.parse(stored);
      }
    } catch (e) {
      scheduledIds = [];
    }
    assignments.forEach(assignment => {
      if (!scheduledIds.includes(assignment.id)) {
        scheduledIds.push(assignment.id);
      }
    });
    localStorage.setItem('scheduled_assignments', JSON.stringify(scheduledIds));
}


export async function scheduleReminder({ time, to, subject, text }: {
  time: string;
  to: string;
  subject: string;
  text: string;
}) {
  const response = await fetch(`${LOCAL_PROXY_BASE_URL}/canvas/handle-schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ time, to, subject, text })
  });
  if (!response.ok) {
    throw new Error(`Failed to schedule reminder: ${response.statusText}`);
  }
  return await response.json();
}

