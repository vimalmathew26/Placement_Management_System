import { useEffect, useState } from "react";

type Student = {
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
};

type Summary = {
  drive_title: string;
  stages: Record<string, Student[]>;
};

export function DriveSummaryTab({ driveId }: { driveId: string }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!driveId) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/drive/${driveId}/summary`)
      .then(res => res.json())
      .then(setSummary)
      .finally(() => setLoading(false));
  }, [driveId]);

  if (loading) return <div>Loading summary...</div>;
  if (!summary) return <div>No summary available.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Drive Summary: {summary.drive_title}</h2>
      {Object.entries(summary.stages).map(([stage, students]) => (
        <div key={stage} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{stage} ({students.length})</h3>
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Job Title</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{s.first_name} {s.last_name}</td>
                  <td className="border px-2 py-1">{s.email}</td>
                  <td className="border px-2 py-1">{s.job_title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
