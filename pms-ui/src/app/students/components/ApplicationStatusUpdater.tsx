import { useState, useEffect } from "react";
import { updateStudentApplicationStatus } from "./API";
import { JobApplication } from "./types";

export function ApplicationStatusUpdater({
  studentId,
  jobId,
  currentStatus,
  onStatusSaved,
  application
}: {
  studentId: string;
  jobId: string;
  currentStatus?: string;
  onStatusSaved?: () => void;
    application: JobApplication;
}) {
  const [status, setStatus] = useState(currentStatus || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync local status with prop or application when they change
  useEffect(() => {
    setStatus(currentStatus || application.student_status || "");
  }, [currentStatus, application.student_status]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await updateStudentApplicationStatus(studentId, jobId, status);
      setSaved(true);
      if (onStatusSaved) onStatusSaved(); // <-- refresh parent data
    } catch {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      <label className="font-medium mb-2">Update Your Status:</label>
      <input
        type="text"
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setSaved(false);
        }}
        disabled={loading}
        placeholder="Enter status (e.g. Interested, Withdrew)"
        className="border px-2 py-1 rounded mb-2"
        style={{ minWidth: 220 }}
      />
      <button
        onClick={handleSave}
        disabled={loading || status === currentStatus}
        className="bg-blue-600 text-white px-4 py-1 rounded"
      >
        {loading ? "Saving..." : "Save"}
      </button>
      {saved && <span className="text-green-600 mt-2">Status updated!</span>}
    </div>
  );
}