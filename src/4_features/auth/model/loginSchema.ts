import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string({ message: 'Введите корректный логин' }),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
