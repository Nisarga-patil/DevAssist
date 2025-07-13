// src/services/CoreSubjectsService.ts
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
import type { CoreSubject, Topic, UserProgress } from '../types';

const SUBJECT_IDS = ['dbms', 'os', 'cn', 'oops', 'sysdesign', 'mysql'] as const;

interface TopicDef {
  id: string;
  name: string;
  link: string;
  subjectId: string;
}

// Define core subjects with GfG links
const CORE_SUBJECTS_DATA: { name: string; topics: TopicDef[] }[] = [
  {
    name: 'Database Management Systems (DBMS)',
    topics: [
      { id: 'dbms-1', name: 'Data Models', link: 'https://www.geeksforgeeks.org/data-models-in-dbms/', subjectId: 'dbms' },
      { id: 'dbms-2', name: 'Storage Models', link: 'https://www.geeksforgeeks.org/storage-structure-dbms/', subjectId: 'dbms' },
      { id: 'dbms-3', name: 'SQL Query Language', link: 'https://www.geeksforgeeks.org/sql-tutorial/', subjectId: 'dbms' },
      { id: 'dbms-4', name: 'Storage Architecture', link: 'https://www.geeksforgeeks.org/storage-architecture-in-dbms/', subjectId: 'dbms' },
      { id: 'dbms-5', name: 'Indexing', link: 'https://www.geeksforgeeks.org/indexing-in-dbms/', subjectId: 'dbms' },
      { id: 'dbms-6', name: 'Transaction Processing', link: 'https://www.geeksforgeeks.org/transaction-management-in-dbms/', subjectId: 'dbms' },
      { id: 'dbms-7', name: 'ACID Properties', link: 'https://www.geeksforgeeks.org/acid-properties-in-dbms/', subjectId: 'dbms' },
      { id: 'dbms-8', name: 'Concurrency Control', link: 'https://www.geeksforgeeks.org/concurrency-control-in-dbms/', subjectId: 'dbms' },
      { id: 'dbms-9', name: 'B+ Trees & Indexes', link: 'https://www.geeksforgeeks.org/b-tree-in-dbms/', subjectId: 'dbms' },
      { id: 'dbms-10', name: 'NoSQL Databases', link: 'https://www.geeksforgeeks.org/introduction-of-nosql/', subjectId: 'dbms' }
    ]
  },
  {
    name: 'Operating Systems (OS)',
    topics: [
      { id: 'os-1', name: 'Introduction to OS', link: 'https://www.geeksforgeeks.org/introduction-of-operating-system-set-1/', subjectId: 'os' },
      { id: 'os-2', name: 'Process Management', link: 'https://www.geeksforgeeks.org/process-management-in-operating-system-tutorial/', subjectId: 'os' },
      { id: 'os-3', name: 'CPU Scheduling', link: 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/', subjectId: 'os' },
      { id: 'os-4', name: 'Memory Management', link: 'https://www.geeksforgeeks.org/memory-management-in-operating-system/', subjectId: 'os' },
      { id: 'os-5', name: 'Virtual Memory', link: 'https://www.geeksforgeeks.org/virtual-memory-in-operating-system/', subjectId: 'os' },
      { id: 'os-6', name: 'Deadlock', link: 'https://www.geeksforgeeks.org/deadlocks-in-operating-system/', subjectId: 'os' },
      { id: 'os-7', name: 'File Systems', link: 'https://www.geeksforgeeks.org/file-system-in-operating-system/', subjectId: 'os' },
      { id: 'os-8', name: 'Semaphores & Sync', link: 'https://www.geeksforgeeks.org/semaphores-in-process-synchronization/', subjectId: 'os' },
      { id: 'os-9', name: 'IPC Mechanisms', link: 'https://www.geeksforgeeks.org/inter-process-communication/', subjectId: 'os' },
      { id: 'os-10', name: 'System Calls', link: 'https://www.geeksforgeeks.org/system-call-in-operating-system/', subjectId: 'os' }
    ]
  },
  {
    name: 'Computer Networks (CN)',
    topics: [
      { id: 'cn-1', name: 'OSI Model', link: 'https://www.geeksforgeeks.org/layers-of-osi-model/', subjectId: 'cn' },
      { id: 'cn-2', name: 'TCP/IP Suite', link: 'https://www.geeksforgeeks.org/tcp-ip-model/', subjectId: 'cn' },
      { id: 'cn-3', name: 'HTTP & HTTPS', link: 'https://www.geeksforgeeks.org/http-and-https-protocols/', subjectId: 'cn' },
      { id: 'cn-4', name: 'IP Addressing', link: 'https://www.geeksforgeeks.org/ip-addressing-and-subnetting/', subjectId: 'cn' },
      { id: 'cn-5', name: 'Routing Algorithms', link: 'https://www.geeksforgeeks.org/routing-algorithms-in-computer-network/', subjectId: 'cn' },
      { id: 'cn-6', name: 'DNS and DHCP', link: 'https://www.geeksforgeeks.org/dns-internet-domain-name-system/', subjectId: 'cn' },
      { id: 'cn-7', name: 'Network Security', link: 'https://www.geeksforgeeks.org/network-security-introduction/', subjectId: 'cn' },
      { id: 'cn-8', name: 'Switching & Bridging', link: 'https://www.geeksforgeeks.org/switching-in-computer-network/', subjectId: 'cn' },
      { id: 'cn-9', name: 'Error Detection & Correction', link: 'https://www.geeksforgeeks.org/error-detection-and-correction-codes/', subjectId: 'cn' },
      { id: 'cn-10', name: 'Network Topology', link: 'https://www.geeksforgeeks.org/computer-network-tutorials/', subjectId: 'cn' }
    ]
  },
  {
    name: 'Object‑Oriented Programming (OOP)',
    topics: [
      { id: 'oops-1', name: 'Classes & Objects', link: 'https://www.geeksforgeeks.org/class-and-object-in-java/', subjectId: 'oops' },
      { id: 'oops-2', name: 'Inheritance', link: 'https://www.geeksforgeeks.org/inheritance-in-java/', subjectId: 'oops' },
      { id: 'oops-3', name: 'Polymorphism', link: 'https://www.geeksforgeeks.org/runtime-polymorphism-java/', subjectId: 'oops' },
      { id: 'oops-4', name: 'Encapsulation', link: 'https://www.geeksforgeeks.org/encapsulation-in-java/', subjectId: 'oops' },
      { id: 'oops-5', name: 'Abstraction', link: 'https://www.geeksforgeeks.org/abstraction-in-java/', subjectId: 'oops' },
      { id: 'oops-6', name: 'Method Overloading/Overriding', link: 'https://www.geeksforgeeks.org/method-overloading-in-java/', subjectId: 'oops' },
      { id: 'oops-7', name: 'Constructors & Destructors', link: 'https://www.geeksforgeeks.org/constructors-in-java/', subjectId: 'oops' },
      { id: 'oops-8', name: 'Binding (Static/Dynamic)', link: 'https://www.geeksforgeeks.org/static-and-dynamic-binding-in-java/', subjectId: 'oops' },
      { id: 'oops-9', name: 'Design Patterns', link: 'https://www.geeksforgeeks.org/software-design-patterns/', subjectId: 'oops' },
      { id: 'oops-10', name: 'SOLID Principles', link: 'https://www.geeksforgeeks.org/solid-principle/', subjectId: 'oops' }
    ]
  },
  {
    name: 'System Design',
    topics: [
      { id: 'sysdesign-1', name: 'System Design Basics', link: 'https://www.geeksforgeeks.org/system-design/system-design-tutorial/', subjectId: 'sysdesign' },
      { id: 'sysdesign-2', name: 'Architecture & Scaling', link: 'https://www.geeksforgeeks.org/system-design-life-cycle-sdlc-design/', subjectId: 'sysdesign' },
      { id: 'sysdesign-3', name: 'SOLID Principles', link: 'https://www.geeksforgeeks.org/object-oriented-analysis-and-design/', subjectId: 'sysdesign' }
    ]
  },
  {
    name: 'MySQL',
    topics: [
      { id: 'mysql-1', name: 'MySQL Basics', link: 'https://www.geeksforgeeks.org/mysql/mysql-tutorial/', subjectId: 'mysql' },
      { id: 'mysql-2', name: 'What is MySQL?', link: 'https://www.geeksforgeeks.org/sql/what-is-mysql/', subjectId: 'mysql' },
      { id: 'mysql-3', name: 'Common MySQL Queries', link: 'https://www.geeksforgeeks.org/mysql-mysql-common-mysql-queries/', subjectId: 'mysql' }
    ]
  }
];

export class CoreSubjectsService {
  static async initializeUserProgress(userId: string): Promise<void> {
    const snap = await getDocs(query(collection(db, 'userProgress'), where('userId', '==', userId)));
    if (!snap.empty) return;

    const batch: Promise<void>[] = [];
    CORE_SUBJECTS_DATA.forEach((subj, idx) => {
      subj.topics.forEach(t => {
        const prog: UserProgress = {
          userId,
          subjectId: SUBJECT_IDS[idx],
          topicId: t.id,
          completed: false,
          dateCompleted: undefined
        };
        batch.push(setDoc(doc(db, 'userProgress', `${userId}_${t.id}`), prog));
      });
    });
    await Promise.all(batch);
  }

  static async getUserProgress(userId: string): Promise<CoreSubject[]> {
    const snap = await getDocs(query(collection(db, 'userProgress'), where('userId', '==', userId)));
    const progMap = new Map<string, UserProgress>();
    snap.forEach(d => {
      const data = d.data() as UserProgress;
      progMap.set(data.topicId, data);
    });

    return CORE_SUBJECTS_DATA.map((subj, idx) => ({
      id: SUBJECT_IDS[idx],
      name: subj.name,
      topics: subj.topics.map(t => {
        const p = progMap.get(t.id);
        return {
          id: t.id,
          name: t.name,
          subjectId: t.subjectId,
          userId,
          completed: p?.completed ?? false,
          dateCompleted: p?.dateCompleted,
          link: t.link
        } as Topic;
      })
    }));
  }

  static async updateTopicProgress(userId: string, topicId: string, completed: boolean): Promise<void> {
    const ref = doc(db, 'userProgress', `${userId}_${topicId}`);
    await updateDoc(ref, {
      completed,
      dateCompleted: completed ? Timestamp.now() : undefined
    });
  }

  static getSubjectProgress(subject: CoreSubject): number {
    const done = subject.topics.filter(t => t.completed).length;
    return subject.topics.length ? (done / subject.topics.length) * 100 : 0;
  }
}
