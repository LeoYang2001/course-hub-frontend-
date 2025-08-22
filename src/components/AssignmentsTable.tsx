import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { Assignment } from "../types/Assignment";
import AssignmentRow from "./AssignmentRow";

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        className="px-3 py-1 rounded bg-gray-200 text-gray-700"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      <span className="px-2">Page {page} of {totalPages}</span>
      <button
        className="px-3 py-1 rounded bg-gray-200 text-gray-700"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

interface AssignmentsTableProps {
  search?: string;
  sortBy?: string;
  classFilter?: string;
  onSelectAssignment?: (id: number) => void;
  selectedAssignments?: number[];
}

const AssignmentsTable: React.FC<AssignmentsTableProps> = ({ search = "", sortBy = "due", classFilter = "", onSelectAssignment, selectedAssignments = [] }) => {
  const assignments = useSelector((state: RootState) => state.assignmentList.assignments) as Assignment[];
  const courseList = useSelector((state: RootState) => state.courses.courseList);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string>('due');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sorting handler
  function handleSort(col: string) {
    if (sortColumn === col) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  }

  // Get scheduled assignment IDs from localStorage
  const [scheduledIds, setScheduledIds] = useState<number[]>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem('scheduled_assignments');
      if (stored) {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr)) {
          setScheduledIds(arr.map(Number));
        }
      }
    } catch (e) {
      setScheduledIds([]);
    }
  }, []);

  // Filter by search and class
  let filteredAssignments = assignments.filter(a => {
    const course = courseList.find(c => String(c.id) === String(a.course_id));
    const courseName = course ? course.name.toLowerCase() : "";
    const assignmentName = a.name ? a.name.toLowerCase() : "";
    const matchesSearch = search === "" || courseName.includes(search.toLowerCase()) || assignmentName.includes(search.toLowerCase());
    const matchesClass = classFilter === "" || String(a.course_id) === classFilter;
    return matchesSearch && matchesClass;
  });

  // Sort
  filteredAssignments = [...filteredAssignments];
  filteredAssignments.sort((a, b) => {
    let valA, valB;
    switch (sortColumn) {
      case 'name':
        valA = a.name || '';
        valB = b.name || '';
        break;
      case 'course':
        valA = courseList.find(c => String(c.id) === String(a.course_id))?.name || '';
        valB = courseList.find(c => String(c.id) === String(b.course_id))?.name || '';
        break;
      case 'created':
        valA = a.created_at ? new Date(a.created_at).getTime() : 0;
        valB = b.created_at ? new Date(b.created_at).getTime() : 0;
        break;
      case 'due':
        valA = a.due_at ? new Date(a.due_at).getTime() : Infinity;
        valB = b.due_at ? new Date(b.due_at).getTime() : Infinity;
        break;
      case 'points':
        valA = a.points_possible || 0;
        valB = b.points_possible || 0;
        break;
      case 'grade':
        // If you have a different property for grade, use it here. Otherwise, default to 0.
        valA = 0;
        valB = 0;
        break;
      case 'type':
        valA = a.name || '';
        valB = b.name || '';
        break;
      case 'scheduled':
        valA = scheduledIds.includes(Number(a.id)) ? 1 : 0;
        valB = scheduledIds.includes(Number(b.id)) ? 1 : 0;
        break;
      default:
        valA = a.due_at ? new Date(a.due_at).getTime() : Infinity;
        valB = b.due_at ? new Date(b.due_at).getTime() : Infinity;
    }
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    } else {
      // fallback to string comparison if types mismatch or are not number
      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    }
  });

  // Pagination logic
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 13;
  const totalPages = Math.max(1, Math.ceil(filteredAssignments.length / rowsPerPage));
  const pagedAssignments = filteredAssignments.slice((page - 1) * rowsPerPage, page * rowsPerPage);


  useEffect(() => {
    // Reset page to 1 when filters change
    setPage(1);
  }, [search, sortBy, classFilter]);

  return (
    <div className="bg-white relative rounded-xl flex-1 flex shadow-lg border border-[#eee] flex-col p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-gray-700 text-base border-b border-gray-200">
              <th className="py-3 px-4 font-semibold text-center">Select</th>
              <th className="py-3 px-4 font-semibold text-center cursor-pointer" onClick={() => handleSort('name')}>
                Name {sortColumn === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th className="py-3 px-4 font-semibold text-center cursor-pointer" onClick={() => handleSort('course')}>
                Course {sortColumn === 'course' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th className="py-3 px-4 font-semibold text-center cursor-pointer" onClick={() => handleSort('created')}>
                Created At {sortColumn === 'created' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th className="py-3 px-4 font-semibold text-center cursor-pointer" onClick={() => handleSort('due')}>
                Due Date {sortColumn === 'due' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th className="py-3 px-4 font-semibold text-center cursor-pointer" onClick={() => handleSort('points')}>
                Points {sortColumn === 'points' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th className="py-3 px-4 font-semibold text-center cursor-pointer" onClick={() => handleSort('grade')}>
                Grade {sortColumn === 'grade' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th className="py-3 px-4 font-semibold text-center cursor-pointer" onClick={() => handleSort('type')}>
                Type {sortColumn === 'type' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th className="py-3 px-4 font-semibold text-center cursor-pointer" onClick={() => handleSort('scheduled')}>
                Scheduled {sortColumn === 'scheduled' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedAssignments.map(a => (
              <AssignmentRow
                key={a.id}
                assignment={a}
                onSelect={onSelectAssignment}
                selected={selectedAssignments.includes(Number(a.id))}
                isScheduled={scheduledIds.includes(Number(a.id))}
                showScheduleButton={!scheduledIds.includes(Number(a.id))}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex-1 flex justify-center items-center">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default AssignmentsTable;
