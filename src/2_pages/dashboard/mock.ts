/** Мок дашборда в форме, близкой к GET /api/v1/dashboard (OpenAPI). */
const dashboardMock = {
    averageGrade: 4.5,
    lessonsToday: 5,
    unreadNotifications: 3,
    todaySchedule: [
        {
            id: '1',
            startsAt: '2026-03-27T06:00:00.000Z',
            endsAt: '2026-03-27T06:45:00.000Z',
            room: '101',
            subject: { id: '1', name: 'Математика' },
            group: { id: 'g1', name: '10А' },
            teacher: {
                id: 't1',
                firstName: 'Иван',
                lastName: 'Иванов',
                middleName: 'Иванович',
            },
        },
        {
            id: '2',
            startsAt: '2026-03-27T07:00:00.000Z',
            endsAt: '2026-03-27T07:45:00.000Z',
            room: '102',
            subject: { id: '2', name: 'Физика' },
        },
    ],
};