# DevAssist - Interview Preparation Tracker

A comprehensive full-stack web application built with React.js and Firebase to help developers prepare for technical interviews. Track DSA problems, study core computer science subjects, use Pomodoro timers for focused sessions, and build professional resumes.

## Features

### ✅ Authentication
- **Firebase Authentication** with email/password
- Secure user registration and login
- Protected routes and user session management

### ✅ DSA Problem Tracker
- Add, edit, and delete coding problems
- Track difficulty levels (Easy, Medium, Hard)
- Monitor progress status (Not Started, In Progress, Completed)
- Add tags and LeetCode links
- Filter and search functionality
- Progress statistics and streak tracking

### ✅ Core Subjects Progress
- Pre-defined topics for DBMS, OS, Computer Networks, and OOPs
- Interactive checklist with completion tracking
- Visual progress indicators with circular progress bars
- Real-time progress updates stored in Firebase

### ✅ Pomodoro Timer
- Classic 25/5 minute work/break cycles
- Customizable timer settings
- Audio notifications and browser notifications
- Session tracking and statistics
- Visual circular progress indicator

### ✅ Resume Builder
- Comprehensive resume creation tool
- Multiple sections: Personal Info, Education, Experience, Projects, Skills
- PDF export functionality with professional formatting
- Two template options (Modern and Classic)
- Real-time preview capabilities

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Wouter** for routing
- **Lucide React** for icons
- **jsPDF** for PDF generation

### Backend & Database
- **Firebase Firestore** for real-time data storage
- **Firebase Authentication** for user management
- **Firebase Hosting** ready for deployment

### Development Tools
- **Vite** for fast development and building
- **TypeScript** for type safety
- **ESLint** for code linting
- **PostCSS** for CSS processing

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.tsx      # Navigation component
├── hooks/              # Custom React hooks
│   └── useAuth.tsx     # Authentication context and hooks
├── pages/              # Page components
│   ├── LoginPage.tsx   # User authentication
│   ├── SignUpPage.tsx  # User registration
│   ├── Dashboard.tsx   # Main dashboard with statistics
│   ├── DSATracker.tsx  # DSA problem management
│   ├── CoreSubjects.tsx # Core CS subjects tracking
│   ├── PomodoroTimer.tsx # Pomodoro timer functionality
│   └── ResumeBuilder.tsx # Resume creation tool
├── services/           # Firebase and API services
│   ├── firebase.ts     # Firebase configuration
│   ├── authService.ts  # Authentication service
│   ├── dsaService.ts   # DSA problems CRUD operations
│   └── coreSubjectsService.ts # Core subjects management
├── types/              # TypeScript type definitions
│   └── index.ts        # All application types
└── utils/              # Utility functions
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Firebase account

### 1. Clone and Install
```bash
git clone <repository-url>
cd devassist-interview-tracker
npm install
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new Firebase project
3. Enable Authentication with Email/Password
4. Create a Firestore database
5. Get your Firebase configuration

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Configuration
1. In Firebase Console, go to Authentication > Settings > Authorized domains
2. Add your development domain (e.g., `localhost:5173`)
3. For production, add your deployment domain

### 5. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Key Features Details

### Dashboard
- Overview of all progress statistics
- Quick action buttons for common tasks
- Visual progress indicators
- Motivational elements

### DSA Tracker
- Comprehensive problem management
- Advanced filtering and search
- Progress tracking with streaks
- LeetCode integration support

### Core Subjects
- 40+ predefined topics across 4 core CS subjects
- Real-time progress synchronization
- Visual completion indicators
- Achievement system

### Pomodoro Timer
- Standard 25/5 minute cycles
- Customizable durations
- Audio and browser notifications
- Session history and statistics

### Resume Builder
- Professional PDF generation
- Multiple sections with dynamic forms
- Real-time preview
- Modern template design

## Firebase Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /dsaProblems/{problemId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /userProgress/{progressId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository or contact the development team.