import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import type { RootState } from "../store/store";
import { fetchAllAssignments } from '../apis/fetchAllAssignmentsShared';

export default function Header() {
  const location = useLocation();
  const isDashboard = location.pathname === "/";
  const isDue = location.pathname === "/due";
  const dispatch = useDispatch();
  const assignmentsStatus = useSelector((state: RootState) => state.assignmentList.status);
  const courseList = useSelector((state: RootState) => state.courses.courseList);
  const assignments = useSelector((state: RootState) => state.assignmentList.assignments);
  const config = localStorage.getItem('coursehub_config');
  const parsedConfig = config ? JSON.parse(config) : {};
  const apiKey = parsedConfig.apiKey;
  const baseUrl = parsedConfig.school_base_url;

  const handleLogOut = () => {
    //clean local storage
    localStorage.removeItem("coursehub_config");
    localStorage.removeItem("courseList");
    localStorage.removeItem("assignmentList");
    //navigate to login page
    window.location.href = "/login";
  }

  const handleRefresh = () => {
    fetchAllAssignments({
      courseList,
      apiKey,
      baseUrl,
      assignmentsStatus,
      assignments,
      dispatch
    });
  }

  return (
    <header className="bg-white border-b border-[#eee] shadow-lg rounded-b-3xl  px-10 py-6 flex justify-between items-center transition-all">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Spring 2024 Dashboard <span className="ml-2 text-base font-medium text-blue-500">{assignmentsStatus}</span></h1>
        <p className="text-gray-500 text-sm">Track your courses and assignments</p>
      </div>
      <div className="flex gap-3 items-center">
        
        <Link
          to="/"
          className={`px-4 py-2 rounded-lg text-sm font-semibold border shadow-sm transition-all duration-150 ${isDashboard ? "bg-gray-800 text-white border-gray-800" : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"}`}
        >
          <span className="inline-block align-middle mr-2"><svg width="18" height="18" fill="currentColor" className="text-gray-700" viewBox="0 0 20 20"><path d="M10 2a1 1 0 01.894.553l7 14A1 1 0 0117 18H3a1 1 0 01-.894-1.447l7-14A1 1 0 0110 2zm0 3.618L5.832 16h8.336L10 5.618z"/></svg></span>
          Dashboard
        </Link>
        <Link
          to="/due"
          className={`px-4 py-2 rounded-lg text-sm font-semibold border shadow-sm transition-all duration-150 ${isDue ? "bg-blue-600 text-white border-blue-600" : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"}`}
        >
          <span className="inline-block align-middle mr-2"><svg width="18" height="18" fill="currentColor" className="text-blue-500" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h14a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm7 2V3H7v1h6zM3 7v9a2 2 0 002 2h10a2 2 0 002-2V7H3zm2 2h10v7a1 1 0 01-1 1H6a1 1 0 01-1-1V9z"/></svg></span>
          Due Table
        </Link>
        <button onClick={handleRefresh} className="border px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 text-sm flex items-center gap-2 font-semibold shadow-sm transition-all duration-150">
          <span className="inline-block align-middle"><svg width="18" height="18" fill="currentColor" className="text-green-500" viewBox="0 0 20 20"><path d="M4 4v2a8 8 0 0016 0V4a8 8 0 00-16 0zm8 10a6 6 0 01-6-6V4a6 6 0 0112 0v4a6 6 0 01-6 6z"/></svg></span>
          Refresh
        </button>
        <button onClick={handleLogOut} className="border px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm flex items-center gap-2 font-semibold shadow-sm transition-all duration-150">
          <span className="inline-block align-middle"><svg width="18" height="18" fill="currentColor" className="text-red-500" viewBox="0 0 20 20"><path d="M7 4V3a3 3 0 116 0v1a1 1 0 102 0V3a5 5 0 00-10 0v1a1 1 0 102 0zm-2 4a1 1 0 011-1h8a1 1 0 011 1v7a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm2 1v6h6V9H7z"/></svg></span>
          Log Out
        </button>
      </div>
    </header>
  );
}