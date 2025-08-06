const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchNotices() {
  const res = await fetch(`${API_URL}/notices/get`);
  if (!res.ok) throw new Error("Failed to fetch notices");
  return res.json();
}

export async function createNotice(data: { title: string; content: string }) {
  const res = await fetch(`${API_URL}/notices/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create notice");
  return res.json();
}

export async function updateNotice(id: string, data: { title: string; content: string }) {
  const res = await fetch(`${API_URL}/notices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update notice");
  return res.json();
}

export async function deleteNotice(id: string) {
  const res = await fetch(`${API_URL}/notices/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete notice");
  return res.json();
}