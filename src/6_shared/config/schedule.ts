export interface Lesson {
  id: string;
  number: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

/**
 * 0..6 => Пн..Вс
 */
export type WeekSchedule = Record<number, Lesson[]>;

export const WEEK_SCHEDULE: WeekSchedule = {
  0: [
    { id: '1', number: 1, time: '08:30 - 09:15', subject: 'Математика', teacher: 'Петрова А.И.', room: '301' },
    { id: '2', number: 2, time: '09:25 - 10:10', subject: 'Русский язык', teacher: 'Сидорова М.П.', room: '205' },
    { id: '3', number: 3, time: '10:30 - 11:15', subject: 'Физика', teacher: 'Козлов В.А.', room: '312' },
    { id: '4', number: 4, time: '11:25 - 12:10', subject: 'История', teacher: 'Иванов С.С.', room: '108' },
    { id: '5', number: 5, time: '12:30 - 13:15', subject: 'Английский язык', teacher: 'Смирнова Е.В.', room: '215' },
  ],
  1: [
    { id: '6', number: 1, time: '08:30 - 09:15', subject: 'Химия', teacher: 'Новикова О.Н.', room: '310' },
    { id: '7', number: 2, time: '09:25 - 10:10', subject: 'Биология', teacher: 'Морозова Л.К.', room: '302' },
    { id: '8', number: 3, time: '10:30 - 11:15', subject: 'География', teacher: 'Волкова Н.А.', room: '201' },
    { id: '9', number: 4, time: '11:25 - 12:10', subject: 'Математика', teacher: 'Петрова А.И.', room: '301' },
    { id: '10', number: 5, time: '12:30 - 13:15', subject: 'Литература', teacher: 'Сидорова М.П.', room: '205' },
    { id: '11', number: 6, time: '13:25 - 14:10', subject: 'ОБЖ', teacher: 'Кузнецов П.В.', room: '101' },
  ],
  2: [
    { id: '12', number: 1, time: '08:30 - 09:15', subject: 'Английский язык', teacher: 'Смирнова Е.В.', room: '215' },
    { id: '13', number: 2, time: '09:25 - 10:10', subject: 'Информатика', teacher: 'Павлов Д.С.', room: '401' },
    { id: '14', number: 3, time: '10:30 - 11:15', subject: 'Физика', teacher: 'Козлов В.А.', room: '312' },
    { id: '15', number: 4, time: '11:25 - 12:10', subject: 'Математика', teacher: 'Петрова А.И.', room: '301' },
    { id: '16', number: 5, time: '12:30 - 13:15', subject: 'Физкультура', teacher: 'Соколов И.М.', room: 'Спортзал' },
  ],
  3: [
    { id: '17', number: 1, time: '08:30 - 09:15', subject: 'Русский язык', teacher: 'Сидорова М.П.', room: '205' },
    { id: '18', number: 2, time: '09:25 - 10:10', subject: 'История', teacher: 'Иванов С.С.', room: '108' },
    { id: '19', number: 3, time: '10:30 - 11:15', subject: 'Обществознание', teacher: 'Иванов С.С.', room: '108' },
    { id: '20', number: 4, time: '11:25 - 12:10', subject: 'Химия', teacher: 'Новикова О.Н.', room: '310' },
    { id: '21', number: 5, time: '12:30 - 13:15', subject: 'Математика', teacher: 'Петрова А.И.', room: '301' },
  ],
  4: [
    { id: '22', number: 1, time: '08:30 - 09:15', subject: 'Литература', teacher: 'Сидорова М.П.', room: '205' },
    { id: '23', number: 2, time: '09:25 - 10:10', subject: 'Биология', teacher: 'Морозова Л.К.', room: '302' },
    { id: '24', number: 3, time: '10:30 - 11:15', subject: 'Английский язык', teacher: 'Смирнова Е.В.', room: '215' },
    { id: '25', number: 4, time: '11:25 - 12:10', subject: 'Физика', teacher: 'Козлов В.А.', room: '312' },
    { id: '26', number: 5, time: '12:30 - 13:15', subject: 'Физкультура', teacher: 'Соколов И.М.', room: 'Спортзал' },
  ],
  5: [],
  6: [],
};
