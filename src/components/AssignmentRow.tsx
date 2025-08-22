import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { fetchAssignmentGrade } from "../apis/fetchAssignmentGrade";
import type { Assignment } from "../types/Assignment";
import { FaQuestionCircle, FaRegFileAlt } from 'react-icons/fa';

interface AssignmentRowProps {
  assignment: Assignment;
  onSelect?: (id: number) => void;
  selected?: boolean;
}

function AssignmentRow({ assignment, onSelect, selected = false }: AssignmentRowProps) {
  const courseList = useSelector((state: RootState) => state.courses.courseList);
  const course = courseList.find(c => String(c.id) === String(assignment.course_id));
  const [grade, setGrade] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(false);


  // Use course color with low opacity
  const rowBg = course && course.color ? `${course.color}46` : 'rgba(52, 152, 219, 0.15)'; // '46' is ~15% opacity in hex

  useEffect(() => {
    async function getGrade() {
      setLoading(true);
      const config = localStorage.getItem("coursehub_config");
      const parsedConfig = config ? JSON.parse(config) : {};
      const apiKey = parsedConfig.apiKey;
      const baseUrl = parsedConfig.school_base_url;
      if (apiKey && baseUrl) {
        const gradeData = await fetchAssignmentGrade(apiKey, baseUrl, assignment.course_id, assignment.id);
        setGrade(gradeData?.grade ?? gradeData?.score ?? null);
      }
      setLoading(false);
    }
    getGrade();
  }, [assignment.course_id, assignment.id]);

  /**
   * Determines the type of assignment based on its name.
   * @param {string} name - The assignment name.
   * @returns {"quiz" | "exam" | "assignment"} The type of assignment.
   */
  function getAssignmentType(name: string): "quiz" | "exam" | "assignment" {
    const lower = name.toLowerCase();
    if (lower.includes("quiz")) return "quiz";
    if (lower.includes("exam") || lower.includes("midterm") || lower.includes("final")) return "exam";
    return "assignment";
  }

  const assignmentType = getAssignmentType(assignment.name);

  return (
    <tr
      style={{
        background: rowBg,
        height: '56px',
        cursor: 'pointer',
        opacity: selected ? 0.6 : 1,
        transition: 'background 0.2s'
      }}
      onClick={() => onSelect && onSelect(assignment.id)}
      className={selected ? '' : ''}
      onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
      onMouseLeave={e => e.currentTarget.style.background = rowBg}
    >
      <td className="py-2 px-2 text-center" onClick={e => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect && onSelect(assignment.id)}
        />
      </td>
      <td className="py-2 px-2 text-base font-medium text-gray-900 text-center">{assignment.name}</td>
      <td className="py-2 px-2 text-base font-semibold text-blue-700 text-center">{course ? course.name : assignment.course_id}</td>
      <td className="py-2 px-2 text-sm font-normal text-gray-500 text-center">{assignment.created_at ? new Date(assignment.created_at).toLocaleString() : "—"}</td>
      <td className="py-2 px-2 text-sm font-normal text-gray-500 text-center">{assignment.due_at ? new Date(assignment.due_at).toLocaleString() : "—"}</td>
      <td className="py-2 px-2 text-base font-bold text-green-700 text-center">{assignment.points_possible}</td>
      <td className="py-2 px-2 text-base font-bold text-purple-700 text-center">
        {loading ? <span className="text-blue-500">Loading...</span> : grade !== null ? grade : "—"}
      </td>
      <td className="py-2 px-2 text-sm font-semibold text-center"
        style={{
          background:
            assignmentType === "exam"
              ? "#ffe5e5" // light red for exam
              : assignmentType === "quiz"
              ? "#fff7e0" // light orange/yellow for quiz
              : "#f3f4f6" // light gray for assignment
        }}
      >
        {/* Assignment type icon and label, priority: exam > quiz > assignment */}
        {assignmentType === "exam" ? (
          <span title="Exam" className="inline-flex items-center gap-1 text-red-700">
            <FaRegFileAlt className="text-lg text-red-500" /> Exam
          </span>
        ) : assignmentType === "quiz" ? (
          <span title="Quiz" className="inline-flex items-center gap-1 text-orange-600">
            <FaQuestionCircle className="text-lg text-orange-500" /> Quiz
          </span>
        ) : (
          <span title="Assignment" className="inline-flex items-center gap-1 text-gray-600">
            <FaRegFileAlt className="text-lg text-gray-400" /> Assignment
          </span>
        )}
      </td>
    </tr>
  );
}

export default AssignmentRow;
