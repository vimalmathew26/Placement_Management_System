import { useState, useEffect, useCallback } from 'react';
import { JobApplication, Resume } from './types';
import { getJobApplicationAPI, getResumeAPI } from './API';

interface UseApplicationAndResumeProps {
  isOpen: boolean;
  driveId: string;
  jobId: string;
  studentId: string;
}

export const useApplicationAndResume = ({
  isOpen,
  jobId,
  studentId,
}: UseApplicationAndResumeProps) => {
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const app = await getJobApplicationAPI(jobId, studentId);
      setApplication(app);
      if (app && app.saved_resume) {
        const res = await getResumeAPI(app.saved_resume);
        setResume(res);
      } else {
        setResume(null);
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [jobId, studentId]);

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen, fetchData]);

  return { application, resume, loading, error, refetch: fetchData };
};