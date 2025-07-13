// src/types/index.ts

import { Timestamp } from 'firebase/firestore';

// --- User types ---
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

// --- Dashboard stats ---
export interface DashboardStats {
  totalProblems: number;
  completedProblems: number;
  currentStreak: number;
  totalFocusTime: number;
  coreSubjectProgress: Record<string, number>;
}

// --- DSA Problem types ---
export type Status = 'Not Started' | 'In Progress' | 'Completed';

export interface DSAProblem {
  id: string;
  title: string;
  status: Status;
  timeSpent: number;            // in minutes
  dateCompleted?: Date | null;
  dateAdded?: Date;
}

// --- Core Subject types ---
export interface Topic {
  id: string;
  name: string;
  subjectId: string;
  userId: string;
  completed: boolean;
  dateCompleted?: Timestamp | Date | null;
  link?: string;
}

export interface CoreSubject {
  id: string;
  name: string;
  topics: Topic[];
}

export interface UserProgress {
  userId: string;
  subjectId: string;
  topicId: string;
  completed: boolean;
  dateCompleted?: Timestamp | null;
}

// --- Pomodoro types ---
export interface PomodoroSession {
  id: string;
  userId: string;
  type: 'work' | 'break';
  duration: number; // in minutes
  startTime: Date;
  endTime?: Date;
  completed: boolean;
}

export interface PomodoroStats {
  totalSessions: number;
  completedSessions: number;
  totalFocusTime: number; // in minutes
  averageSessionLength: number;
  streak: number;
}

// --- Resume types ---
export interface ResumeData {
  id: string;
  userId: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skills;
  template: 'modern' | 'classic';
  lastUpdated: Date;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  startDate: string;
  endDate: string;
}

export interface Skills {
  languages: string[];
  frameworks: string[];
  tools: string[];
  databases: string[];
}
