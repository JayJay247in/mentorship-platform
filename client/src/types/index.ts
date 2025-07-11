// src/types/index.ts
export type UserRole = 'ADMIN' | 'MENTOR' | 'MENTEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
}