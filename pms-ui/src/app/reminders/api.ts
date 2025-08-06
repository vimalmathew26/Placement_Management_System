const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchStudentReminders(studentId: string) {
  const res = await fetch(`${API_URL}/reminders/student/${studentId}`);
  if (!res.ok) throw new Error("Failed to fetch reminders");
  return res.json();
}

export async function markReminderRead(reminderId: string, studentId: string) {
  const res = await fetch(`${API_URL}/reminders/${reminderId}/read/${studentId}`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to mark as read");
  return res.json();
}

export async function createReminder(reminder: {
  title: string;
  message: string;
  sender_id: string;
  recipient_ids?: string[];
  drive_id?: string;
  job_id?: string;
}) {
  const res = await fetch(`${API_URL}/reminders/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reminder),
  });
  if (!res.ok) throw new Error("Failed to create reminder");
  return res.json();
}