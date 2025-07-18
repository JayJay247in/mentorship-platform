// client/src/types/index.ts

// --- Core Enums and User Types ---
export type UserRole = 'ADMIN' | 'MENTOR' | 'MENTEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  // --- NEW PROFILE 2.0 FIELDS ---
  title?: string;
  company?: string;
  socialLinks?: any; // For holding { linkedin, github, website }
  skills?: { skill: Skill }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Notification {
  id: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

// --- Messaging and Chat ---
export interface ChatData {
  messages: Message[];
  participants: {
    mentor: { id: string; name: string; avatarUrl?: string };
    mentee: { id: string; name: string; avatarUrl?: string };
  };
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  requestId: string;
  isRead: boolean;
  sender: {
    id:string;
    name: string;
    avatarUrl?: string;
  };
}


// --- Mentorship Flow Types ---

export interface Mentor extends User {}

export interface SentRequest {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  mentor: { id: string; name: string; };
  createdAt: string;
}

export interface ReceivedRequest {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  mentee: { id: string; name: string; };
  createdAt: string;
}

export interface Session {
  id: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELED';
  mentor: { id: string; name: string };
  mentee: { id: string; name: string };
  scheduledTime: string;
  feedback?: { id: string } | null;
}

// Admin-specific types
export interface AdminUser extends User {}

// --- THIS IS THE FIX ---
// The original `AdminRequest` was missing the `mentor` field.
// This new, complete type matches the data your API sends.
export interface AdminRequest {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    mentee: { id: string; name: string; };
    mentor: { id: string; name: string; }; // <-- The missing property
    createdAt: string;
}

export interface AdminSession extends Session {}