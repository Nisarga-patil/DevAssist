// src/App.tsx

import React from 'react';
import { Router, Route } from 'wouter';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { Dashboard } from './pages/Dashboard';
import { DSATracker } from './pages/DSATracker';
import { CoreSubjects } from './pages/CoreSubjects';
import { PomodoroTimer } from './pages/PomodoroTimer';
import { ResumeBuilder } from './pages/ResumeBuilder';

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Router>
        <Route path="/signup" component={SignUpPage} />
        <Route path="/" component={LoginPage} />
        <Route component={LoginPage} />
      </Router>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Router>
        <Route path="/" component={Dashboard} />
        <Route path="/dsa" component={DSATracker} />
        <Route path="/core-subjects" component={CoreSubjects} />
        <Route path="/pomodoro" component={PomodoroTimer} />
        <Route path="/resume" component={ResumeBuilder} />
         {/* separate route */}
      </Router>
    </div>
  );
}
export interface DSAProgress {
  userId: string;
  questionId: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
