// src/services/dsaService.ts
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { DSAProblem } from '../types';

export type Status = 'Not Started' | 'In Progress' | 'Completed';

export class DSAService {
  /** Fetches all user-specific DSA problems stored */
  static async getAllProblems(userId: string): Promise<DSAProblem[]> {
    const snapshot = await getDocs(
      query(collection(db, 'dsaProblems'), where('userId', '==', userId))
    );
    const arr: DSAProblem[] = [];
    snapshot.forEach(docSnap => {
      const d = docSnap.data() as any;
      arr.push({
        id: docSnap.id,
        title: d.title,
        status: d.status as Status,
        timeSpent: d.timeSpent || 0,
        dateAdded: d.dateAdded?.toDate() ?? undefined,
        dateCompleted: d.dateCompleted?.toDate() ?? null
      });
    });
    return arr;
  }

  /** Fetches a map of question title → status for UI tracking */
  static async getProgressMap(userId: string): Promise<Record<string, Status>> {
    const snapshot = await getDocs(
      query(collection(db, 'dsaProgress'), where('userId', '==', userId))
    );
    const map: Record<string, Status> = {};
    snapshot.forEach(docSnap => {
      const d = docSnap.data() as { title: string; status: Status };
      map[d.title] = d.status;
    });
    return map;
  }

  /** Sets or updates progress for a question title */
  static async setQuestionStatus(
    userId: string,
    title: string,
    status: Status
  ): Promise<void> {
    const id = `${userId}_${title}`;
    const ref = doc(db, 'dsaProgress', id);
    await setDoc(
      ref,
      { userId, title, status, dateUpdated: Timestamp.now() },
      { merge: true }
    );
  }
}
