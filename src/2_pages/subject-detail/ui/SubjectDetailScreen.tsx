import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SubjectDetailContent } from '@features/view-subject';
import type { GradesStackParamList } from '@shared/lib/navigation';

type SubjectDetailRouteProp = RouteProp<GradesStackParamList, 'SubjectDetail'>;

export const SubjectDetailScreen: React.FC = () => {
  const route = useRoute<SubjectDetailRouteProp>();
  const { subjectId } = route.params;

  return <SubjectDetailContent subjectId={subjectId} />;
};
