import { useState } from "react";
import { createReminder } from "@/app/reminders/api";

export function ReminderForm({ senderId }: { senderId: string }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createReminder({ title, message, sender_id: senderId });
      setTitle("");
      setMessage("");
      alert("Reminder sent!");
    } catch {
      alert("Failed to send reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required className="border p-1 w-full" />
      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" required className="border p-1 w-full" />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded">
        {loading ? "Sending..." : "Send Reminder"}
      </button>
    </form>
  );
}