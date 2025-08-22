import React, { useEffect, useState } from "react";
import AssignmentsTable from "../components/AssignmentsTable";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { FaSearch, FaSortAmountDown, FaFilter, FaTimes } from 'react-icons/fa';
import { dueTimeBaseReminder, handleCustomTimeReminder } from "../apis/scheduleReminder";

const reminderOptions = [
  { label: "A day before", value: 1 },
  { label: "2 days before", value: 2 },
  { label: "3 days before", value: 3 },
  { label: "A week before", value: 7 }
];

const DueTablePage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("due");
  const [classFilter, setClassFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [reminderDays, setReminderDays] = useState(1);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderMode, setReminderMode] = useState<'days' | 'custom'>('days');
  const courseList = useSelector((state: RootState) => state.courses.courseList);
  const assignments = useSelector((state: RootState) => state.assignmentList.assignments);
  const [selectedAssignments, setSelectedAssignments] = useState<number[]>([]);

  // Handler to toggle assignment selection
  const handleSelectAssignment = (id: number) => {
    setSelectedAssignments(prev =>
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  // Get selected assignments info
  const selectedInfo = assignments.filter(a => selectedAssignments.includes(a.id)).map(a => {
    const course = courseList.find(c => String(c.id) === String(a.course_id));
    return {
      id: a.id,
      name: a.name,
      due_date: a.due_at,
      course_code: course ? course.course_code : '',
    };
  });

  // Select all assignments on current page
  const assignmentsOnPage = assignments.filter(a => {
    const course = courseList.find(c => String(c.id) === String(a.course_id));
    const courseName = course ? course.name.toLowerCase() : "";
    const assignmentName = a.name ? a.name.toLowerCase() : "";
    const matchesSearch = search === "" || courseName.includes(search.toLowerCase()) || assignmentName.includes(search.toLowerCase());
    const matchesClass = classFilter === "" || String(a.course_id) === classFilter;
    return matchesSearch && matchesClass;
  });

  // Toggle select/unselect all assignments on current page
  const allSelected = assignmentsOnPage.every(a => selectedAssignments.includes(a.id)) && assignmentsOnPage.length > 0;
  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedAssignments(prev => prev.filter(id => !assignmentsOnPage.map(a => a.id).includes(id)));
    } else {
      setSelectedAssignments(prev => Array.from(new Set([...prev, ...assignmentsOnPage.map(a => a.id)])));
    }
  };

  // Handle confirm reminder
  const handleConfirmReminder = async () => {
    if (reminderMode === 'days') {
      // Group assignments by reminder time (due date minus reminderDays)
      const grouped: { [reminderTime: string]: { id: number, name: string, due_date: string, course_code: string }[] } = {};
      selectedInfo.forEach(a => {
        if (!a.due_date) return;
        const due = new Date(a.due_date);
        const reminder = new Date(due.getTime() - reminderDays * 24 * 60 * 60 * 1000);
        const reminderStr = reminder.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
        if (!grouped[reminderStr]) grouped[reminderStr] = [];
        grouped[reminderStr].push({ id: a.id, name: a.name, due_date: a.due_date, course_code: a.course_code });
      });
      console.log('Grouped assignments by reminder time:', grouped);
      await dueTimeBaseReminder(grouped);
    } else {
      // Group all assignments together with custom reminder date
      const group = selectedInfo.map(a => ({ id: a.id, name: a.name, due_date: a.due_date, course_code: a.course_code, reminder_date: reminderDate }));
      console.log('All assignments with custom reminder date:', group);
      await handleCustomTimeReminder({ assignments: group });
    }
    setShowModal(false);
  };

  return (
    <div className="px-8 py-6 flex flex-col h-full min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight">Assignments</h2>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <div className=" mr-auto">
            <button
              className={`ml-2 px-4 py-2 rounded font-semibold shadow ${allSelected ? 'bg-gray-400 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              onClick={handleToggleSelectAll}
            >
              {allSelected ? 'Unselect All on Page' : 'Select All on Page'}
            </button>
            <button
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded font-semibold shadow hover:bg-green-700"
              onClick={() => setShowModal(true)}
            >
              Show Selected Assignments
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              className="border border-gray-300 rounded px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pl-10 shadow-sm transition-all duration-150"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>
          <div className="relative">
            <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <select
              className="border border-gray-300 rounded px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pl-10 shadow-sm transition-all duration-150"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="due">Sort by Due Date</option>
              <option value="class">Sort by Class</option>
            </select>
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <select
              className="border border-gray-300 rounded px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pl-10 shadow-sm transition-all duration-150"
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
            >
              <option value="">All Classes</option>
              {courseList.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
        </div>
      </div>
      {/* FiltersBar would go here */}
      <div className=" flex-1 w-full">
        <AssignmentsTable
          search={search}
          sortBy={sortBy}
          classFilter={classFilter}
          onSelectAssignment={handleSelectAssignment}
          selectedAssignments={selectedAssignments}
        />
      </div>
      {/* Modal for selected assignments */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              minWidth: 400,
              maxWidth: 600,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              position: "relative"
            }}
          >
            <button
              style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setShowModal(false)}
              title="Close"
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4">Selected Assignments</h3>
            <ul className="mb-4">
              {selectedInfo.length === 0 ? (
                <li className="text-gray-400">No assignments selected.</li>
              ) : (
                <>
                {
                   selectedInfo.map(a => (
                  <li key={a.id} className="mb-2 text-base text-gray-700">
                    <span className="font-semibold">ID:</span> {a.id} <span className="ml-2 font-semibold">Due:</span> {a.due_date}
                  </li>
                ))}
                </>
                )  
              }
            </ul>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-800">Reminder Type:</label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded transition hover:bg-blue-50" style={{ border: reminderMode === 'days' ? '2px solid #3b82f6' : '2px solid transparent' }}>
                  <input
                    type="radio"
                    name="reminderMode"
                    value="days"
                    checked={reminderMode === 'days'}
                    onChange={() => setReminderMode('days')}
                    className="accent-blue-600"
                  />
                  <span className="font-medium text-gray-700">Based on Due Date</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded transition hover:bg-blue-50" style={{ border: reminderMode === 'custom' ? '2px solid #3b82f6' : '2px solid transparent' }}>
                  <input
                    type="radio"
                    name="reminderMode"
                    value="custom"
                    checked={reminderMode === 'custom'}
                    onChange={() => setReminderMode('custom')}
                    className="accent-blue-600"
                  />
                  <span className="font-medium text-gray-700">Custom Time</span>
                </label>
              </div>
              {reminderMode === 'days' ? (
                <div className="mb-2">
                  <label className="block mb-2 font-semibold text-gray-700">Schedule reminder based on:</label>
                  <select
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm"
                    value={reminderDays}
                    onChange={e => setReminderDays(Number(e.target.value))}
                  >
                    {reminderOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="mb-2">
                  <label className="block mb-2 font-semibold text-gray-700">Pick reminder time:</label>
                  <input
                    type="datetime-local"
                    value={reminderDate}
                    onChange={e => setReminderDate(e.target.value)}
                    className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm"
                  />
                </div>
              )}
            </div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700"
              onClick={handleConfirmReminder}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DueTablePage;
