import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { CoreSubject, Topic, UserProgress } from '../types';

// Predefined core subjects and topics
const CORE_SUBJECTS_DATA: Omit<CoreSubject, 'id'>[] = [
  {
    name: 'Database Management Systems (DBMS)',
    topics: [
      { id: 'dbms-1', name: 'Introduction to DBMS', completed: false, subjectId: 'dbms', userId: '' },
      { id: 'dbms-2', name: 'ER Model and Diagrams', completed: false, subjectId: 'dbms', userId: '' },
      { id: 'dbms-3', name: 'Relational Model', completed: false, subjectId: 'dbms', userId: '' },
      { id: 'dbms-4', name: 'SQL Queries and Commands', completed: false, subjectId: 'dbms', userId: '' },
      { id: 'dbms-5', name: 'Normalization (1NF, 2NF, 3NF, BCNF)', completed: false, subjectId: 'dbms', userId: '' },
      { id: 'dbms-6', name: 'Transaction Management', completed: false, subjectId: 'dbms', userId: '' },
      { id: 'dbms-7', name: 'Concurrency Control', completed: false, subjectId: 'dbms', userId: '' },
      { id: 'dbms-8', name: 'Indexing and B+ Trees', completed: false, subjectId: 'dbms', userId: '' },
      { id: 'dbms-9', name: 'ACID Properties', completed: false, subjectId: 'dbms', userId: '' },
      { id: 'dbms-10', name: 'NoSQL Databases', completed: false, subjectId: 'dbms', userId: '' }
    ]
  },
  {
    name: 'Operating Systems (OS)',
    topics: [
      { id: 'os-1', name: 'Introduction to OS', completed: false, subjectId: 'os', userId: '' },
      { id: 'os-2', name: 'Process Management', completed: false, subjectId: 'os', userId: '' },
      { id: 'os-3', name: 'CPU Scheduling Algorithms', completed: false, subjectId: 'os', userId: '' },
      { id: 'os-4', name: 'Memory Management', completed: false, subjectId: 'os', userId: '' },
      { id: 'os-5', name: 'Virtual Memory and Paging', completed: false, subjectId: 'os', userId: '' },
      { id: 'os-6', name: 'Deadlock Detection and Prevention', completed: false, subjectId: 'os', userId: '' },
      { id: 'os-7', name: 'File Systems', completed: false, subjectId: 'os', userId: '' },
      { id: 'os-8', name: 'Synchronization and Semaphores', completed: false, subjectId: 'os', userId: '' },
      { id: 'os-9', name: 'Inter-Process Communication', completed: false, subjectId: 'os', userId: '' },
      { id: 'os-10', name: 'System Calls', completed: false, subjectId: 'os', userId: '' }
    ]
  },
  {
    name: 'Computer Networks (CN)',
    topics: [
      { id: 'cn-1', name: 'OSI Model', completed: false, subjectId: 'cn', userId: '' },
      { id: 'cn-2', name: 'TCP/IP Protocol Suite', completed: false, subjectId: 'cn', userId: '' },
      { id: 'cn-3', name: 'HTTP/HTTPS Protocols', completed: false, subjectId: 'cn', userId: '' },
      { id: 'cn-4', name: 'IP Addressing and Subnetting', completed: false, subjectId: 'cn', userId: '' },
      { id: 'cn-5', name: 'Routing Algorithms', completed: false, subjectId: 'cn', userId: '' },
      { id: 'cn-6', name: 'DNS and DHCP', completed: false, subjectId: 'cn', userId: '' },
      { id: 'cn-7', name: 'Network Security', completed: false, subjectId: 'cn', userId: '' },
      { id: 'cn-8', name: 'Switching and Bridging', completed: false, subjectId: 'cn', userId: '' },
      { id: 'cn-9', name: 'Error Detection and Correction', completed: false, subjectId: 'cn', userId: '' },
      { id: 'cn-10', name: 'Network Topology', completed: false, subjectId: 'cn', userId: '' }
    ]
  },
  {
    name: 'Object-Oriented Programming (OOPs)',
    topics: [
      { id: 'oops-1', name: 'Classes and Objects', completed: false, subjectId: 'oops', userId: '' },
      { id: 'oops-2', name: 'Inheritance', completed: false, subjectId: 'oops', userId: '' },
      { id: 'oops-3', name: 'Polymorphism', completed: false, subjectId: 'oops', userId: '' },
      { id: 'oops-4', name: 'Encapsulation', completed: false, subjectId: 'oops', userId: '' },
      { id: 'oops-5', name: 'Abstraction', completed: false, subjectId: 'oops', userId: '' },
      { id: 'oops-6', name: 'Method Overloading and Overriding', completed: false, subjectId: 'oops', userId: '' },
      { id: 'oops-7', name: 'Constructor and Destructor', completed: false, subjectId: 'oops', userId: '' },
      { id: 'oops-8', name: 'Static and Dynamic Binding', completed: false, subjectId: 'oops', userId: '' },
      { id: 'oops-9', name: 'Design Patterns', completed: false, subjectId: 'oops', userId: '' },
      { id: 'oops-10', name: 'SOLID Principles', completed: false, subjectId: 'oops', userId: '' }
    ]
  }
];

export class CoreSubjectsService {
  static async initializeUserProgress(userId: string): Promise<void> {
    try {
      // Check if user progress already exists
      const progressQuery = query(
        collection(db, 'userProgress'),
        where('userId', '==', userId)
      );
      const existingProgress = await getDocs(progressQuery);
      
      if (existingProgress.empty) {
        // Initialize progress for all subjects and topics
        const batch: Promise<void>[] = [];
        
        CORE_SUBJECTS_DATA.forEach((subject, subjectIndex) => {
          subject.topics.forEach((topic) => {
            const progressData: UserProgress = {
              userId,
              subjectId: ['dbms', 'os', 'cn', 'oops'][subjectIndex],
              topicId: topic.id,
              completed: false
            };
            
            batch.push(
              setDoc(doc(db, 'userProgress', `${userId}_${topic.id}`), progressData)
            );
          });
        });
        
        await Promise.all(batch);
      }
    } catch (error: any) {
      throw new Error(`Failed to initialize user progress: ${error.message}`);
    }
  }
  
  static async getUserProgress(userId: string): Promise<CoreSubject[]> {
    try {
      const progressQuery = query(
        collection(db, 'userProgress'),
        where('userId', '==', userId)
      );
      const progressSnapshot = await getDocs(progressQuery);
      
      const userProgressMap = new Map<string, UserProgress>();
      progressSnapshot.forEach((doc) => {
        const data = doc.data() as UserProgress;
        userProgressMap.set(data.topicId, data);
      });
      
      // Merge predefined subjects with user progress
      const subjects: CoreSubject[] = CORE_SUBJECTS_DATA.map((subject, index) => ({
        id: ['dbms', 'os', 'cn', 'oops'][index],
        name: subject.name,
        topics: subject.topics.map((topic) => {
          const userProgress = userProgressMap.get(topic.id);
          return {
            ...topic,
            userId,
            completed: userProgress?.completed || false,
            dateCompleted: userProgress?.dateCompleted
          };
        })
      }));
      
      return subjects;
    } catch (error: any) {
      throw new Error(`Failed to fetch user progress: ${error.message}`);
    }
  }
  
  static async updateTopicProgress(userId: string, topicId: string, completed: boolean): Promise<void> {
    try {
      const progressRef = doc(db, 'userProgress', `${userId}_${topicId}`);
      const updateData: Partial<UserProgress> = {
        completed,
        dateCompleted: completed ? new Date() : undefined
      };
      
      await updateDoc(progressRef, updateData);
    } catch (error: any) {
      throw new Error(`Failed to update topic progress: ${error.message}`);
    }
  }
  
  static getSubjectProgress(subject: CoreSubject): number {
    const completedTopics = subject.topics.filter(topic => topic.completed).length;
    return subject.topics.length > 0 ? (completedTopics / subject.topics.length) * 100 : 0;
  }
}