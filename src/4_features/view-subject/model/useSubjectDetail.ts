import { useState, useCallback, useEffect } from 'react';
import { useGradesStore } from '@entities/grades';
import { gradeItemsToEntries, type GradeEntry } from './types';

export function useSubjectDetail(subjectId: string) {
  const gradesBySubject = useGradesStore((s) => s.gradesBySubject);
  const fetchGradesForSubject = useGradesStore((s) => s.fetchGradesForSubject);
  const loadingSubjectIds = useGradesStore((s) => s.loadingSubjectIds);

  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(null);

  const gradesList = gradesBySubject[subjectId] ?? [];
  const gradeEntries = gradeItemsToEntries(gradesList);
  const isLoading = loadingSubjectIds.has(subjectId);

  useEffect(() => {
    fetchGradesForSubject(subjectId);
  }, [subjectId, fetchGradesForSubject]);

  const handleCommentPress = useCallback((id: string) => {
    setExpandedCommentId((prev) => (prev === id ? null : id));
  }, []);

  return {
    gradeEntries,
    isLoading,
    expandedCommentId,
    handleCommentPress,
  };
}

export type { GradeEntry };
