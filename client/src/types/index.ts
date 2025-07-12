// src/types/index.ts

export type UserRole = 'ADMIN' | 'MENTOR' | 'MENTEE';

// Basic user type from our AuthContext
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
}

// Type for a single skill
export interface Skill {
  id: string;
  name: string;
}

// Type for the Mentor card on the discovery page
export interface Mentor {
  id: string;
  name: string;
  bio: string | null;
  skills: { skill: Skill }[];
}

// Type for a mentorship request viewed by the mentee
export interface SentRequest {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  mentor: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// Type for a request viewed by the mentor
export interface ReceivedRequest {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  mentee: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// Type for a session viewed by the mentor
export interface MentorSession {
  id: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELED';
  mentee: {
    id: string;
    name: string;
  };
  scheduledTime: string;
}

// Type for a user record in the admin's user list
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Type for a request in the admin's global view
export interface AdminRequest {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  mentee: { id: string; name: string };
  mentor: { id: string; name: string };
  createdAt: string;
}

// Type for a session in the admin's global view
export interface AdminSession {
  id: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELED';
  mentee: { id: string; name: string };
  mentor: { id: string; name: string };
  scheduledTime: string;
}