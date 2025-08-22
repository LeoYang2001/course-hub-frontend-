import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './courseSlice';
import assignmentListReducer from './assignmentSlice';

const store = configureStore({
  reducer: {
    courses: courseReducer,
    assignmentList: assignmentListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
