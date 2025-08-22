import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Assignment } from "../types/Assignment";

export interface AssignmentState {
  assignments: Assignment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const ASSIGNMENTS_STORAGE_KEY = "assignmentList";
function loadAssignmentsFromStorage(): Assignment[] {
  try {
    const data = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

const initialState: AssignmentState = {
  assignments: loadAssignmentsFromStorage(),
  status: 'idle',
};

const assignmentSlice = createSlice({
  name: "assignmentList",
  initialState,
  reducers: {
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
      state.status = 'succeeded';
      try {
        localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(action.payload));
      } catch {}
    },
    setAssignmentsLoading: (state) => {
      state.status = 'loading';
    },
    setAssignmentsFailed: (state) => {
      state.status = 'failed';
    },
    clearAssignments: (state) => {
      state.assignments = [];
      state.status = 'idle';
      try {
        localStorage.removeItem(ASSIGNMENTS_STORAGE_KEY);
      } catch {}
    },
  },
});

export const { setAssignments, setAssignmentsLoading, setAssignmentsFailed, clearAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer;
