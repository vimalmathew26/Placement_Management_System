import { useEffect, useState } from "react";
import { fetchStudentReminders, markReminderRead } from "@/app/reminders/api";

export function RemindersList({ studentId }: { studentId: string }) {
  const [reminders, setReminders] = useState<Array<{ _id: string; title: string; message: string; created_at: string; read_by?: string[] }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchStudentReminders(studentId)
      .then(setReminders)
      .finally(() => setLoading(false));
  }, [studentId]);

  const handleMarkRead = async (reminderId: string) => {
    await markReminderRead(reminderId, studentId);
    setReminders(reminders.map(r => r._id === reminderId ? { ...r, read_by: [...(r.read_by || []), studentId] } : r));
  };

  if (loading) return <div>Loading reminders...</div>;
  if (!reminders.length) return <div>No reminders.</div>;

  return (
    <div>
      <h3 className="font-bold mb-2">Reminders</h3>
      <ul className="space-y-2">
        {reminders.map(reminder => (
          <li key={reminder._id} className={`p-2 border rounded ${reminder.read_by?.includes(studentId) ? "bg-gray-100" : "bg-yellow-50"}`}>
            <div className="font-semibold">{reminder.title}</div>
            <div>{reminder.message}</div>
            <div className="text-xs text-gray-500">{new Date(reminder.created_at).toLocaleString()}</div>
            {!reminder.read_by?.includes(studentId) && (
              <button className="text-blue-600 text-xs mt-1" onClick={() => handleMarkRead(reminder._id)}>
                Mark as read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}