// src/types/index.ts

// --- Core Enums and User Types ---
export type UserRole = 'ADMIN' | 'MENTOR' | 'MENTEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
}

export interface Skill {
  id: string;
  name: string;
}

// --- Page-Specific Data Shapes ---

export interface Mentor {
  id: string;
  name: string;
  bio: string | null;
  skills: { skill: Skill }[];
}

export interface SentRequest {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  mentor: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface ReceivedRequest {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  mentee: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// --- THIS IS THE SINGLE, CORRECTED SESSION TYPE ---
export interface Session {
  id: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELED';
  mentor: { id: string; name: string };
  mentee: { id: string; name: string };
  scheduledTime: string;
}

// Admin types can now safely reuse the core types
export interface AdminUser extends User {
  createdAt: string;
}
export interface AdminRequest extends ReceivedRequest {}
export interface AdminSession extends Session {}