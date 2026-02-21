import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, Typography, Card } from '../../../shared/ui';
import { colors, spacing, borderRadius } from '../../../shared/config/theme';
import { GradesStackParamList } from '../../../app/navigation/types';

type NavigationProp = NativeStackNavigationProp<GradesStackParamList, 'GradesList'>;

interface Subject {
  id: string;
  name: string;
  average: number;
  grades: number[];
  teacher: string;
}

const subjects: Subject[] = [
  { id: '1', name: 'Математика', average: 4.5, grades: [5, 4, 5, 4, 5], teacher: 'Петрова А.И.' },
  { id: '2', name: 'Русский язык', average: 4.2, grades: [4, 4, 5, 4, 4], teacher: 'Сидорова М.П.' },
  { id: '3', name: 'Физика', average: 4.8, grades: [5, 5, 5, 4, 5], teacher: 'Козлов В.А.' },
  { id: '4', name: 'История', average: 4.0, grades: [4, 4, 4, 4, 4], teacher: 'Иванов С.С.' },
  { id: '5', name: 'Английский язык', average: 4.6, grades: [5, 4, 5, 5, 4], teacher: 'Смирнова Е.В.' },
  { id: '6', name: 'Химия', average: 3.8, grades: [4, 3, 4, 4, 4], teacher: 'Новикова О.Н.' },
  { id: '7', name: 'Биология', average: 4.4, grades: [4, 5, 4, 5, 4], teacher: 'Морозова Л.К.' },
  { id: '8', name: 'География', average: 4.6, grades: [5, 5, 4, 5, 4], teacher: 'Волкова Н.А.' },
];

const getGradeColor = (grade: number): string => {
  if (grade >= 4.5) return colors.grades.excellent;
  if (grade >= 3.5) return colors.grades.good;
  if (grade >= 2.5) return colors.grades.satisfactory;
  return colors.grades.poor;
};

interface SubjectCardProps {
  subject: Subject;
  onPress: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onPress }) => (
  <Card style={styles.subjectCard} onPress={onPress}>
    <View style={styles.subjectHeader}>
      <View style={styles.subjectInfo}>
        <Typography variant="h4" numberOfLines={1}>
          {subject.name}
        </Typography>
        <Typography variant="caption" color="secondary">
          {subject.teacher}
        </Typography>
      </View>
      <Ionicons style={styles.cardArrow} name="chevron-forward" size={20} color={colors.text.secondary} />
    </View>
    <View style={styles.gradesPreview}>
      <Typography variant="caption" color="secondary" style={styles.gradesLabel}>
        Последние оценки:
      </Typography>
      <View style={styles.gradesList}>
        {subject.grades.slice(-5).map((grade, index) => (
          <View
            key={index}
            style={[
              styles.gradeBadge,
              { backgroundColor: getGradeColor(grade) },
            ]}
          >
            <Typography variant="body2" color="light">
              {grade}
            </Typography>
          </View>
        ))}
      </View>
      <View
        style={[
          styles.averageContainer,
          { backgroundColor: getGradeColor(subject.average) },
        ]}
      >
        <Typography variant="h4" color="light">
          {subject.average.toFixed(1)}
        </Typography>
      </View>
    </View>
  </Card>
);

export const GradesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleSubjectPress = (subject: Subject) => {
    navigation.navigate('SubjectDetail', {
      subjectId: subject.id,
      subjectName: subject.name,
    });
  };

  const overallAverage =
    subjects.reduce((sum, s) => sum + s.average, 0) / subjects.length;

  return (
    <ScreenContainer padding={false}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryContent}>
          <Typography variant="body1" color="light">
            Общий средний балл
          </Typography>
          <Typography variant="h1" color="light">
            {overallAverage.toFixed(2)}
          </Typography>
        </View>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Typography variant="h4" color="light">
              {subjects.length}
            </Typography>
            <Typography variant="caption" color="light">
              предметов
            </Typography>
          </View>
          <View style={styles.summaryStat}>
            <Typography variant="h4" color="light">
              {subjects.reduce((sum, s) => sum + s.grades.length, 0)}
            </Typography>
            <Typography variant="caption" color="light">
              оценок
            </Typography>
          </View>
        </View>
      </View>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubjectCard
            subject={item}
            onPress={() => handleSubjectPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.primary.main,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryContent: {},
  summaryStats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  summaryStat: {
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  subjectCard: {},
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subjectInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  gradesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradesLabel: {
    marginRight: spacing.sm,
  },
  gradesList: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  gradeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardArrow: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    marginTop: -20,
  },
  averageContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginLeft: spacing.sm,
  },
});
