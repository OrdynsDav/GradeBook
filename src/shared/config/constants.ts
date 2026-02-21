import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const IS_SMALL_DEVICE = width < 375;
export const IS_TABLET = width >= 768;

export const GRADE_LABELS: Record<number, string> = {
  5: 'Отлично',
  4: 'Хорошо',
  3: 'Удовлетворительно',
  2: 'Неудовлетворительно',
};

export const WEEKDAYS = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
];

export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

export const APP_NAME = 'ПКТ Журнал';
