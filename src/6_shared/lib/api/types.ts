/**
 * Типы API GradeBook Backend для использования на фронте.
 * Single source of truth для клиента; см. также документацию API (interfaces guide).
 *
 * Base URL (dev): http://localhost:3000
 * Префикс: /api/v1
 * Даты: ISO 8601 UTC; даты расписания в query: YYYY-MM-DD.
 */

// ============ Enums (соответствуют бэкенду) ============

export type Role = 'student' | 'teacher' | 'admin';

import type { ThemeMode } from '@shared/config/theme';

export type NotificationType = 'grade' | 'homework' | 'announcement' | 'system';

export type NotificationStatus = 'unread' | 'read';

/** Фильтр списка уведомлений: all | read | unread */
export type NotificationFilterStatus = 'all' | 'read' | 'unread';

/** Роль при создании пользователя админом (только student | teacher) */
export type CreatableRole = 'student' | 'teacher';

// ============ Auth ============

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

/**
 * Вложенная группа в `User.group`, `Subject.group`, уроке.
 * В GET /users/me часто только `{ id, name }`; в списках пользователей — с `course` / `groupName`.
 */
export interface Group {
  id: string;
  name: string;
  course?: number;
  groupName?: string;
}

/** Элемент списка GET /groups (полная карточка). */
export interface GroupListItem {
  id: string;
  name: string;
  course: number;
  groupName: string;
  curatorId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** POST /groups (CreateGroupDto). */
export interface CreateGroupRequest {
  course: number;
  groupName: string;
}

/** @deprecated Используйте Group — в API поле называется group */
export type ClassRoom = Group;

/**
 * Пользователь в ответах API.
 * Login/refresh: часто только `groupId`. GET/PATCH /users/me: может быть `group: { id, name }` без groupId на корне.
 */
export interface User {
  id: string;
  login: string;
  role: Role;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  /** Приходит в login/refresh */
  groupId?: string | null;
  /** Приходит в GET/PATCH /users/me, списках и т.д. */
  group?: Group | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  /** Время жизни access токена в секундах (например 900) */
  expiresIn: number;
  user: User;
}

export interface LogoutResponse {
  success: boolean;
}

// ============ User (me, admin create) ============

export interface UpdateMeRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
}

/** UpdateUserByAdminDto */
export interface UpdateUserByAdminRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  groupId?: string;
  login?: string;
  password?: string;
}

/** CreateTeacherSubjectDto */
export interface CreateTeacherSubjectItem {
  name: string;
  groupId?: string;
  groupIds?: string[];
  groups?: string[];
}

/** @deprecated Используйте CreateTeacherSubjectItem */
export type CreateTeacherSubjectRequest = CreateTeacherSubjectItem;

/** Соответствует CreateUserByAdminDto. */
export interface CreateUserByAdminRequest {
  role: CreatableRole;
  firstName: string;
  lastName: string;
  middleName?: string;
  course?: number;
  group?: string;
  subjects?: CreateTeacherSubjectItem[];
  login: string;
  password: string;
}

// ============ Dashboard ============

export interface SubjectRef {
  id: string;
  name: string;
}

export interface TeacherRef {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
}

/**
 * Урок расписания: GET /schedule/week, /schedule/day, POST/PATCH /schedule.
 * В GET /dashboard `todaySchedule` в OpenAPI-примере может не содержать `teacher`/`group` — на клиенте проверяйте опциональные поля.
 */
export interface LessonItem {
  id: string;
  startsAt: string;
  endsAt: string;
  room?: string | null;
  subject: SubjectRef;
  group?: Group | { id: string; name: string };
  /** В сокращённом дашборде может отсутствовать */
  teacher?: TeacherRef;
}

export interface DashboardResponse {
  averageGrade: number | null;
  lessonsToday: number;
  unreadNotifications: number;
  todaySchedule: LessonItem[];
}

// ============ Subjects ============

export interface SubjectListItem {
  id: string;
  name: string;
  groupId: string;
  teacherId: string;
  group?: { id: string; name: string };
  teacher?: TeacherRef;
  createdAt?: string;
  updatedAt?: string;
}

/** POST /subjects (CreateSubjectDto). */
export interface CreateSubjectRequest {
  name: string;
  groupId: string;
  teacherId: string;
}

/** PATCH /subjects/:id (UpdateSubjectDto). */
export interface UpdateSubjectRequest {
  name?: string;
  groupId?: string;
  teacherId?: string;
}

export interface SubjectsQueryParams {
  groupId?: string;
  teacherId?: string;
}

/** GET /api/v1/subjects/{id}/stats */
export interface SubjectStatsResponse {
  subjectId: string;
  count: number;
  average: number;
  min: number;
  max: number;
}

// ============ Grades ============

export interface StudentRef {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
}

export interface GradeItem {
  id: string;
  subjectId: string;
  studentId: string;
  createdById: string;
  value: number;
  comment?: string | null;
  gradedAt: string;
  student?: StudentRef;
  createdBy?: TeacherRef;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateGradeRequest {
  studentId: string;
  value: number; // 1–5
  comment?: string;
  /** ISO 8601, по умолчанию — сейчас */
  gradedAt?: string;
}

export interface UpdateGradeRequest {
  value?: number; // 1–5
  comment?: string;
  gradedAt?: string;
}

/** DELETE /api/v1/grades/{id} (soft delete) */
export interface GradeDeleteResponse {
  id: string;
  deletedAt: string;
}

// ============ Schedule ============

export interface CreateLessonRequest {
  subjectId: string;
  startsAt: string; // ISO 8601
  endsAt: string;   // ISO 8601
  room?: string;
}

export interface UpdateLessonRequest {
  subjectId?: string;
  startsAt?: string;
  endsAt?: string;
  room?: string;
}

export interface ScheduleQueryParams {
  /** YYYY-MM-DD */
  date: string;
  groupId?: string;
  teacherId?: string;
}

/** Ответ GET /schedule/week — массив уроков (OpenAPI). */
export type ScheduleWeekResponse = LessonItem[];

// ============ Notifications ============

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  status: NotificationStatus;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsListResponse {
  items: NotificationItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationsQueryParams {
  status?: NotificationFilterStatus;
  page?: number;
  limit?: number; // max 100
}

export interface NotificationsReadAllResponse {
  updated: number;
}

// ============ Settings ============

export interface NotificationsSettings {
  enabled?: boolean;
  grades?: boolean;
  homework?: boolean;
  announcements?: boolean;
}

export interface SettingsResponse {
  themeMode: ThemeMode;
  notifications: NotificationsSettings;
  /** Может приходить с бэкенда вместе с профилем настроек */
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSettingsRequest {
  themeMode?: ThemeMode;
  notifications?: NotificationsSettings;
}

// ============ Errors (стандартный формат бэкенда) ============

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  path?: string;
  timestamp?: string;
  requestId?: string;
}

/** GET /api/v1/health */
export interface HealthResponse {
  status: string;
  timestamp: string;
}

// ============ Frontend: классы ошибок и алиасы для совместимости ============

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly details: ApiErrorResponse,
    message?: string
  ) {
    const msg =
      message ??
      (Array.isArray(details.message) ? details.message.join(', ') : details.message);
    super(msg);
    this.name = 'ApiRequestError';
  }
}

/** Сообщение для показа пользователю по ошибке API/сети. */
export function getApiErrorMessage(error: unknown, fallback = 'Неизвестная ошибка'): string {
  if (error instanceof NetworkError) return error.message || 'Проблема с подключением';
  if (error instanceof ApiRequestError) {
    if (error.status === 401) return 'Неверный логин или пароль';
    if (error.status >= 500) return 'Ошибка сервера. Попробуйте позже';
    return error.message || 'Ошибка запроса';
  }
  return fallback;
}

/** Алиасы для обратной совместимости с экранами */
export type LessonDetail = LessonItem;
export type UserSettings = SettingsResponse;
export type Notification = NotificationItem;
export type NotificationsResponse = NotificationsListResponse;
/** Subject в API — SubjectListItem; для экранов с расширенными полями можно расширять локально */
export type Subject = SubjectListItem;
export type Grade = GradeItem;
