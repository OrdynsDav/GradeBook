import { apiClient } from './client';
import type {
  User,
  DashboardResponse,
  SubjectListItem,
  GradeItem,
  ScheduleWeekResponse,
  LessonItem,
  NotificationsListResponse,
  NotificationItem,
  SettingsResponse,
  UpdateSettingsRequest,
  UpdateMeRequest,
  SubjectsQueryParams,
  ScheduleQueryParams,
  NotificationsQueryParams,
  CreateGradeRequest,
  NotificationsReadAllResponse,
} from './types';

export class UserApi {
  static async getMe(): Promise<User> {
    return apiClient.request<User>('/api/v1/users/me');
  }

  static async updateMe(data: UpdateMeRequest): Promise<User> {
    return apiClient.request<User>('/api/v1/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
}

export class DashboardApi {
  static async getDashboard(): Promise<DashboardResponse> {
    return apiClient.request<DashboardResponse>('/api/v1/dashboard');
  }
}

export class SubjectsApi {
  static async getSubjects(params: SubjectsQueryParams = {}): Promise<SubjectListItem[]> {
    const url = new URL('/api/v1/subjects', apiClient['baseURL']);
    if (params.classRoomId) url.searchParams.set('classRoomId', params.classRoomId);
    if (params.teacherId) url.searchParams.set('teacherId', params.teacherId);

    return apiClient.request<SubjectListItem[]>(url.pathname + url.search);
  }

  static async getSubjectGrades(subjectId: string): Promise<GradeItem[]> {
    return apiClient.request<GradeItem[]>(`/api/v1/subjects/${subjectId}/grades`);
  }

  static async createGrade(subjectId: string, data: CreateGradeRequest): Promise<GradeItem> {
    return apiClient.request<GradeItem>(`/api/v1/subjects/${subjectId}/grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
}

export class ScheduleApi {
  static async getWeekSchedule(
    date: string,
    params: Omit<ScheduleQueryParams, 'date'> = {}
  ): Promise<ScheduleWeekResponse> {
    const url = new URL('/api/v1/schedule/week', apiClient['baseURL']);
    url.searchParams.set('date', date);
    if (params.classRoomId) url.searchParams.set('classRoomId', params.classRoomId);
    if (params.teacherId) url.searchParams.set('teacherId', params.teacherId);

    return apiClient.request<ScheduleWeekResponse>(url.pathname + url.search);
  }

  static async getDaySchedule(
    date: string,
    params: Omit<ScheduleQueryParams, 'date'> = {}
  ): Promise<LessonItem[]> {
    const url = new URL('/api/v1/schedule/day', apiClient['baseURL']);
    url.searchParams.set('date', date);
    if (params.classRoomId) url.searchParams.set('classRoomId', params.classRoomId);
    if (params.teacherId) url.searchParams.set('teacherId', params.teacherId);

    return apiClient.request<LessonItem[]>(url.pathname + url.search);
  }
}

export class NotificationsApi {
  static async getNotifications(params: NotificationsQueryParams = {}): Promise<NotificationsListResponse> {
    const url = new URL('/api/v1/notifications', apiClient['baseURL']);
    if (params.status) url.searchParams.set('status', params.status);
    if (params.page != null) url.searchParams.set('page', params.page.toString());
    if (params.limit != null) url.searchParams.set('limit', params.limit.toString());

    return apiClient.request<NotificationsListResponse>(url.pathname + url.search);
  }

  static async markAsRead(notificationId: string): Promise<NotificationItem> {
    return apiClient.request<NotificationItem>(`/api/v1/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  static async markAllAsRead(): Promise<NotificationsReadAllResponse> {
    return apiClient.request<NotificationsReadAllResponse>('/api/v1/notifications/read-all', {
      method: 'PATCH',
    });
  }
}

export class SettingsApi {
  static async getSettings(): Promise<SettingsResponse> {
    return apiClient.request<SettingsResponse>('/api/v1/settings');
  }

  static async updateSettings(data: UpdateSettingsRequest): Promise<SettingsResponse> {
    return apiClient.request<SettingsResponse>('/api/v1/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
}