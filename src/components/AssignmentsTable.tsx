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
  if (sortBy === "due") {
    filteredAssignments = filteredAssignments.sort((a, b) => {
      const aDue = a.due_at ? new Date(a.due_at).getTime() : Infinity;
      const bDue = b.due_at ? new Date(b.due_at).getTime() : Infinity;
      return aDue - bDue;
    });
  } else if (sortBy === "class") {
    filteredAssignments = filteredAssignments.sort((a, b) => {
      const courseA = courseList.find(c => String(c.id) === String(a.course_id));
      const courseB = courseList.find(c => String(c.id) === String(b.course_id));
      const nameA = courseA ? courseA.name : "";
      const nameB = courseB ? courseB.name : "";
      return nameA.localeCompare(nameB);
    });
  }

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
    <div className="bg-white relative rounded-xl  flex-1 flex shadow-lg border border-[#eee] flex-col p-6">
     <div className="  overflow-hidden">
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-gray-700 text-base border-b border-gray-200">
            <th className="py-3 px-4 font-semibold text-center">Select</th>
            <th className="py-3 px-4 font-semibold text-center">Name</th>
            <th className="py-3 px-4 font-semibold text-center">Course</th>
            <th className="py-3 px-4 font-semibold text-center">Created At</th>
            <th className="py-3 px-4 font-semibold text-center">Due Date</th>
            <th className="py-3 px-4 font-semibold text-center">Points</th>
            <th className="py-3 px-4 font-semibold text-center">Grade</th>
            <th className="py-3 px-4 font-semibold text-center">Quiz?</th>
          </tr>
        </thead>
        <tbody>
          {pagedAssignments.map(a => (
            <AssignmentRow
              key={a.id}
              assignment={a}
              onSelect={onSelectAssignment}
              selected={selectedAssignments.includes(Number(a.id))}
            />
          ))}
        </tbody>
      </table>
    </div>
    <div className=" w-full flex-1  flex justify-center items-center">
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  </div>
  );
};

export default AssignmentsTable;
