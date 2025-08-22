// Seed data for 5 courses and ~12 assignments
import type { Course } from "../features/courses";
import type { Assignment } from "../features/assignments";

export const seedCourses: Course[] = [
  {
    id: "ma214",
    code: "MA 214",
    name: "Calculus IV – Differential Equations",
    term: "Fall 2025",
    credits: 3,
    modality: "In-Person",
    instructor: "Dr. Euler",
    instructorEmail: "euler@univ.edu",
    meetings: "MWF 8:00–8:50 @ CP-211",
    finalExam: "2025-12-17T08:00:00",
  },
  {
    id: "app200",
    code: "APP 200",
    name: "Applied Programming",
    term: "Fall 2025",
    credits: 3,
    modality: "Online",
    instructor: "Prof. Turing",
    instructorEmail: "turing@univ.edu",
    meetings: "Online asynchronous",
    finalExam: "2025-12-18T10:00:00",
  },
  {
    id: "ees110",
    code: "EES 110",
    name: "Earth & Environmental Science",
    term: "Fall 2025",
    credits: 4,
    modality: "In-Person",
    instructor: "Dr. Curie",
    instructorEmail: "curie@univ.edu",
    meetings: "TR 9:30–10:45 @ SC-101",
    finalExam: "2025-12-16T13:00:00",
  },
  {
    id: "ma327",
    code: "MA 327",
    name: "Discrete Mathematics",
    term: "Fall 2025",
    credits: 3,
    modality: "In-Person",
    instructor: "Dr. Gauss",
    instructorEmail: "gauss@univ.edu",
    meetings: "MWF 10:00–10:50 @ CP-212",
    finalExam: "2025-12-15T10:00:00",
  },
  {
    id: "acc356",
    code: "ACC 356",
    name: "Accounting Principles",
    term: "Fall 2025",
    credits: 3,
    modality: "Online",
    instructor: "Prof. Nightingale",
    instructorEmail: "nightingale@univ.edu",
    meetings: "Online synchronous",
    finalExam: "2025-12-19T09:00:00",
  },
];

export const seedAssignments: Assignment[] = [
  // MA 214
  { id: "ma214-exam1", courseId: "ma214", title: "Exam 1: First-Order ODEs", type: "Exam", status: "Not Started", dueAt: "2025-09-24T08:00:00", pointsPossible: 100, weightPct: 20, priority: "High" },
  { id: "ma214-exam2", courseId: "ma214", title: "Exam 2: Series Solutions", type: "Exam", status: "Not Started", dueAt: "2025-10-22T08:00:00", pointsPossible: 100, weightPct: 20, priority: "High" },
  { id: "ma214-exam3", courseId: "ma214", title: "Exam 3: Laplace Transforms", type: "Exam", status: "Not Started", dueAt: "2025-11-19T08:00:00", pointsPossible: 100, weightPct: 20, priority: "High" },
  { id: "ma214-final", courseId: "ma214", title: "Final Exam", type: "Exam", status: "Not Started", dueAt: "2025-12-17T08:00:00", pointsPossible: 150, weightPct: 25, priority: "High" },
  { id: "ma214-hw1", courseId: "ma214", title: "HW1: ODEs", type: "Homework", status: "Not Started", dueAt: "2025-09-10T08:00:00", pointsPossible: 20, weightPct: 5, priority: "Normal" },
  // APP 200
  { id: "app200-proj1", courseId: "app200", title: "Project 1: Web App", type: "Project", status: "Not Started", dueAt: "2025-09-15T23:59:00", pointsPossible: 100, weightPct: 30, priority: "High" },
  { id: "app200-quiz1", courseId: "app200", title: "Quiz 1: JS Basics", type: "Quiz", status: "Not Started", dueAt: "2025-09-08T23:59:00", pointsPossible: 20, weightPct: 10, priority: "Normal" },
  { id: "app200-hw1", courseId: "app200", title: "HW1: React", type: "Homework", status: "Not Started", dueAt: "2025-09-12T23:59:00", pointsPossible: 20, weightPct: 10, priority: "Normal" },
  // EES 110
  { id: "ees110-lab1", courseId: "ees110", title: "Lab 1: Minerals", type: "Lab", status: "Not Started", dueAt: "2025-09-09T09:30:00", pointsPossible: 15, weightPct: 10, priority: "Normal" },
  { id: "ees110-exam1", courseId: "ees110", title: "Exam 1: Plate Tectonics", type: "Exam", status: "Not Started", dueAt: "2025-09-30T09:30:00", pointsPossible: 50, weightPct: 20, priority: "High" },
  // MA 327
  { id: "ma327-hw1", courseId: "ma327", title: "HW1: Graph Theory", type: "Homework", status: "Not Started", dueAt: "2025-09-11T10:00:00", pointsPossible: 20, weightPct: 10, priority: "Normal" },
  // ACC 356
  { id: "acc356-quiz1", courseId: "acc356", title: "Quiz 1: Ledgers", type: "Quiz", status: "Not Started", dueAt: "2025-09-13T09:00:00", pointsPossible: 20, weightPct: 10, priority: "Normal" },
];
