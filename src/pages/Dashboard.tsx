import React from "react";
import StatTiles from "../components/StatTiles";
import ProgressBar from "../components/ProgressBar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAssignments } from '../apis/fetchAllAssignmentsShared';

import type { RootState } from "../store/store";
import CourseCard from "../components/CourseCard";

// Mock data for UI development
const mockStats = {
  dueThisWeek: 3,
  overdue: 1,
  nextExam: { title: "Data Structures Midterm", date: "March 15, 2024" },
  avgProgressPct: 78,
};

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const courseList = useSelector((state: RootState) => state.courses.courseList);
  const assignmentsStatus = useSelector((state: RootState) => state.assignmentList.status);
  const assignments = useSelector((state: RootState) => state.assignmentList.assignments);
  const config = localStorage.getItem('coursehub_config');
  const parsedConfig = config ? JSON.parse(config) : {};
  const apiKey = parsedConfig.apiKey;
  const baseUrl = parsedConfig.school_base_url;

  React.useEffect(() => {
    fetchAllAssignments({
      courseList,
      apiKey,
      baseUrl,
      assignmentsStatus,
      assignments,
      dispatch
    });
  }, [courseList, apiKey, baseUrl, assignmentsStatus, assignments.length, dispatch]);

  // Responsive grid columns: 2 for 2, 3 for 3, 4 for 4+, fallback to 1 for 1
  let gridCols = "grid-cols-1";
  if (courseList.length === 2) gridCols = "grid-cols-2";
  else if (courseList.length === 3) gridCols = "grid-cols-3";
  else if (courseList.length >= 4) gridCols = "grid-cols-4";

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <main className="px-8 py-8">
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3 flex items-center gap-2">
            <span className="inline-block"><svg width="28" height="28" fill="currentColor" className="text-blue-500" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z"/></svg></span>
            Overview
          </h2>
          <StatTiles stats={mockStats} />
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3 flex items-center gap-2">
            <span className="inline-block"><svg width="28" height="28" fill="currentColor" className="text-amber-500" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2v2h2V7H6zm4 0v2h2V7h-2z"/></svg></span>
            Courses
          </h2>
          <div className={`grid ${gridCols} gap-8 justify-center items-stretch`}> 
            {courseList.length === 0 ? (
              <div className="text-gray-400 col-span-full text-center py-8 text-lg font-medium bg-white rounded-xl shadow">No courses found.</div>
            ) : (
              courseList.map((course) => (
                <div key={course.id} className="flex justify-center items-stretch">
                  <CourseCard course={course} />
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
