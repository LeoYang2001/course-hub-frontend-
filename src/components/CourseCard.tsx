import React, { useEffect, useState } from 'react'
import type { Course } from '../types/Course'
import { fetchCourseDetail } from '../apis/fetchCourseDetail';
import { fetchAssignment } from '../apis/fetchAssignment';

interface Teacher {
  display_name: string;
}

// Helper to convert hex color to rgba with given opacity
function hexToRgba(hex: string, opacity: number) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${opacity})`;
}

function CourseCard({ course }: { course: Course }) {

    const [teachers, setTeachers] = useState<Teacher[]>([]);


    useEffect(() => {
      const fetchCourseDetails = async () => {
        // Fetch course details from API, fetch apikey and baseUrl from localStorage
        const config = localStorage.getItem("coursehub_config");
        const parsedConfig = config ? JSON.parse(config) : {};
        const apiKey = parsedConfig.apiKey;
        const schoolBaseUrl = parsedConfig.school_base_url;
        const courseDetail = await fetchCourseDetail(apiKey, schoolBaseUrl, course.id);
        const assignments = await fetchAssignment(apiKey, schoolBaseUrl, course.id);
        console.log("assignments from class", courseDetail.name);
        console.log(assignments);

        const teachers = courseDetail?.teachers || [];
        setTeachers(teachers);
      };
      fetchCourseDetails();
    }, []);

  return (
    <div
      style={{ backgroundColor: course.color ? hexToRgba(course.color, 0.3) : 'rgba(255, 248, 225, 0.3)' }}
      className="relative border select-none border-[#eee] rounded-2xl p-8 shadow-xl bg-white hover:shadow-2xl transition-all duration-200 flex flex-col gap-4 items-start min-h-[280px] max-w-[420px] w-full"
    >
      <div className="flex items-center gap-4 mb-3">
        <span className="inline-block"><svg width="40" height="40" fill="currentColor" className="text-blue-400" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/><text x="10" y="15" textAnchor="middle" fontSize="12" fill="#fff">{course.course_code?.slice(0,2) || '?'}</text></svg></span>
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">{course.name}</h3>
          <p className="text-base text-gray-500 font-semibold">{course.course_code}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-400">Course ID: {course.id}</span>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-sm font-semibold text-gray-600">Teachers:</span>
          {teachers.length === 0 ? (
            <span className="text-sm text-gray-400">N/A</span>
          ) : (
            teachers.map((teacher) => (
              <span key={teacher.display_name} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold shadow mr-2">
                <svg width="18" height="18" fill="currentColor" className="mr-1 text-blue-400" viewBox="0 0 20 20"><circle cx="8" cy="8" r="7"/><text x="8" y="12" textAnchor="middle" fontSize="8" fill="#fff">{teacher.display_name.charAt(0)}</text></svg>
                {teacher.display_name}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard