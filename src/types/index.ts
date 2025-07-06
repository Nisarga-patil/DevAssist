// User types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

// DSA Problem types
export interface DSAProblem {
  id: string;
  userId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  status: 'Not Started' | 'In Progress' | 'Completed';
  leetcodeUrl?: string;
  notes?: string;
  dateAdded: Date;
  dateCompleted?: Date;
  timeSpent?: number; // in minutes
}

export interface DSAProblemInput {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  status: 'Not Started' | 'In Progress' | 'Completed';
  leetcodeUrl?: string;
  notes?: string;
}

// Core Subject types
export interface CoreSubject {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  completed: boolean;
  subjectId: string;
  userId: string;
  dateCompleted?: Date;
}

export interface UserProgress {
  userId: string;
  subjectId: string;
  topicId: string;
  completed: boolean;
  dateCompleted?: Date;
}

// Pomodoro types
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

// Resume types
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

// Dashboard stats
export interface DashboardStats {
  totalProblems: number;
  completedProblems: number;
  currentStreak: number;
  totalFocusTime: number;
  coreSubjectProgress: { [subject: string]: number };
}