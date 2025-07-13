

## Overview

DevAssist is a comprehensive full-stack interview preparation tracker built with React.js and Firebase. The application helps developers prepare for technical interviews by providing tools to track DSA problems, study core computer science subjects, use Pomodoro timers for focused sessions, and build professional resumes. The project is complete and fully functional with authentication, real-time data storage, and responsive design.

## System Architecture

**Frontend Architecture:**
- React 18 with TypeScript for type safety and modern development
- Wouter for lightweight client-side routing
- Tailwind CSS for utility-first styling and responsive design
- Component-based architecture with clear separation of concerns

**Backend Architecture:**
- Firebase Firestore for real-time NoSQL database
- Firebase Authentication for secure user management
- Client-side Firebase SDK for direct database interactions
- Serverless architecture with Firebase services

**State Management:**
- React Context API for authentication state
- Local component state for UI interactions
- Firebase real-time listeners for data synchronization

## Key Components

**Authentication System:**
- `AuthProvider` context for global user state management
- `AuthService` for Firebase authentication operations
- Protected routes with authentication guards
- Login and SignUp pages with form validation

**Core Application Pages:**
- `Dashboard`: Overview with statistics and quick actions
- `DSATracker`: Comprehensive problem management with CRUD operations
- `CoreSubjects`: Pre-defined CS topics with progress tracking
- `PomodoroTimer`: Customizable timer with notifications
- `ResumeBuilder`: Multi-section resume creation with PDF export

**Services Layer:**
- `dsaService`: DSA problem CRUD operations with Firestore
- `coreSubjectsService`: Subject progress management
- `authService`: User authentication and profile management
- Firebase configuration and initialization

**UI Components:**
- `Navbar`: Responsive navigation with active state
- Reusable form components and input elements
- Modal dialogs for forms and confirmations
- Progress indicators and statistics cards

## Data Flow

**Authentication Flow:**
1. User authentication through Firebase Auth
2. User state managed via React Context
3. Protected routes check authentication status
4. Automatic session persistence and restoration

**Data Management Flow:**
1. Components interact with service layer
2. Services communicate with Firebase Firestore
3. Real-time updates via Firestore listeners
4. Local state updates trigger UI re-renders
5. Optimistic updates for better user experience

**Application Navigation:**
1. Wouter handles client-side routing
2. Navbar provides navigation between sections
3. Authentication state determines available routes
4. Dashboard serves as the central hub

## External Dependencies

**Core Dependencies:**
- React 18 & React DOM for UI framework
- Firebase 10+ for backend services
- TypeScript for type safety
- Wouter for routing
- Tailwind CSS for styling

**Development Dependencies:**
- Vite for fast development and building
- PostCSS & Autoprefixer for CSS processing
- Lucide React for icon components
- jsPDF for PDF generation
- html2canvas for PDF rendering support

**Firebase Services:**
- Firestore for database operations
- Authentication for user management
- Hosting for deployment (ready)

## Deployment Strategy

**Current Setup:**
- Vite build system configured for production
- Firebase Hosting ready for deployment
- Environment variables configured for Firebase
- TypeScript compilation and optimization

**Deployment Steps:**
1. Configure Firebase project with API keys
2. Set up Firestore security rules
3. Build production bundle with `npm run build`
4. Deploy to Firebase Hosting or other platforms
5. Configure custom domain if needed

**Environment Configuration:**
- Development: Local Vite server on port 5173
- Production: Optimized build with Firebase backend
- Environment variables for Firebase configuration

## Recent Changes

**June 29, 2025 - Project Completion:**
- Built complete DevAssist interview preparation tracker
- Implemented Firebase authentication with email/password
- Created comprehensive DSA problem tracking system
- Developed core CS subjects with predefined topics (DBMS, OS, CN, OOPs)
- Built functional Pomodoro timer with customization
- Completed resume builder with PDF export
- Added responsive design with Tailwind CSS
- Implemented real-time data synchronization
- Created comprehensive dashboard with statistics
- Added progress tracking and streak calculations

**Architecture Decisions:**
- Chose Firebase for serverless backend simplicity
- Used Wouter instead of React Router for lighter bundle
- Implemented client-side authentication state management
- Structured services layer for clean separation
- Used TypeScript throughout for better development experience

## User Preferences

**Communication Style:** Simple, everyday language that's accessible to non-technical users while maintaining technical accuracy.

**Project Priorities:**
1. User experience and ease of use
2. Real-time data synchronization
3. Comprehensive feature set for interview preparation
4. Clean, professional design
5. Mobile responsiveness

**Technical Decisions:**
- Firebase for rapid development and real-time features
- React with TypeScript for type safety
- Component-based architecture for maintainability
- Tailwind CSS for consistent design system
- Service layer pattern for clean data management
