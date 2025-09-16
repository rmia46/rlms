import { create } from 'zustand';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { Course, CourseData } from '../types/data';

interface CourseState {
  data: CourseData;
  loading: boolean;
  updateCourse: (updatedCourses: Course[]) => Promise<void>;
}

const coursesDocRef = doc(db, 'content', 'courses');

export const useCourseStore = create<CourseState>((_set) => ({
  data: { courses: [] },
  loading: true,
  updateCourse: async (updatedCourses) => {
    try {
      await setDoc(coursesDocRef, { courses: updatedCourses });
    } catch (error) {
      console.error("Error updating courses in Firestore: ", error);
    }
  },
}));

export const initializeCourseListener = () => {
  onSnapshot(coursesDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as CourseData;
      useCourseStore.setState({ data, loading: false });
    } else {
      setDoc(coursesDocRef, { courses: [] });
      useCourseStore.setState({ data: { courses: [] }, loading: false });
    }
  });
};