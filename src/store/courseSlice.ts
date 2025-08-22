import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// Redux persistence helpers
const COURSE_LIST_STORAGE_KEY = "courseList";

function loadCourseListFromStorage(): Course[] {
  try {
    const data = localStorage.getItem(COURSE_LIST_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
import type { Course } from '../types/Course';

interface CourseState {
  courseList: Course[];
}

const initialState: CourseState = {
  courseList: loadCourseListFromStorage(),
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourseList: (state, action: PayloadAction<Course[]>) => {
      state.courseList = action.payload;
      try {
        localStorage.setItem(COURSE_LIST_STORAGE_KEY, JSON.stringify(action.payload));
      } catch {}
    },
    addCourse(state, action: PayloadAction<Course>) {
      state.courseList.push(action.payload);
    },
    clearCourses(state) {
      state.courseList = [];
    },
  },
});

export const { setCourseList, addCourse, clearCourses } = courseSlice.actions;
export default courseSlice.reducer;
