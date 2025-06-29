import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { DSAProblem, DSAProblemInput } from '../types';

export class DSAService {
  static async getAllProblems(userId: string): Promise<DSAProblem[]> {
    try {
      const q = query(
        collection(db, 'dsaProblems'),
        where('userId', '==', userId),
        orderBy('dateAdded', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const problems: DSAProblem[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        problems.push({
          id: doc.id,
          ...data,
          dateAdded: data.dateAdded.toDate(),
          dateCompleted: data.dateCompleted?.toDate()
        } as DSAProblem);
      });
      
      return problems;
    } catch (error: any) {
      throw new Error(`Failed to fetch DSA problems: ${error.message}`);
    }
  }
  
  static async addProblem(userId: string, problemData: DSAProblemInput): Promise<string> {
    try {
      const newProblem = {
        ...problemData,
        userId,
        dateAdded: Timestamp.fromDate(new Date()),
        dateCompleted: problemData.status === 'Completed' ? Timestamp.fromDate(new Date()) : null,
        timeSpent: 0
      };
      
      const docRef = await addDoc(collection(db, 'dsaProblems'), newProblem);
      return docRef.id;
    } catch (error: any) {
      throw new Error(`Failed to add DSA problem: ${error.message}`);
    }
  }
  
  static async updateProblem(problemId: string, updates: Partial<DSAProblemInput>): Promise<void> {
    try {
      const problemRef = doc(db, 'dsaProblems', problemId);
      const updateData: any = { ...updates };
      
      // If status is being changed to completed, set completion date
      if (updates.status === 'Completed') {
        updateData.dateCompleted = Timestamp.fromDate(new Date());
      } else if (updates.status && updates.status !== 'Completed') {
        updateData.dateCompleted = null;
      }
      
      await updateDoc(problemRef, updateData);
    } catch (error: any) {
      throw new Error(`Failed to update DSA problem: ${error.message}`);
    }
  }
  
  static async deleteProblem(problemId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'dsaProblems', problemId));
    } catch (error: any) {
      throw new Error(`Failed to delete DSA problem: ${error.message}`);
    }
  }
  
  static async getProblemById(problemId: string): Promise<DSAProblem | null> {
    try {
      const docRef = doc(db, 'dsaProblems', problemId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          dateAdded: data.dateAdded.toDate(),
          dateCompleted: data.dateCompleted?.toDate()
        } as DSAProblem;
      }
      
      return null;
    } catch (error: any) {
      throw new Error(`Failed to fetch DSA problem: ${error.message}`);
    }
  }
}