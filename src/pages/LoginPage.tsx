import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCourses } from "../apis/fetchCourses";
import { useDispatch } from "react-redux";
import { setCourseList } from "../store/courseSlice";

const currentYear = new Date().getFullYear() - 1;
const terms = [
  `Fall ${currentYear + 1}`,
  `Summer ${currentYear + 1}`,
  `Spring ${currentYear + 1}`,
  `Fall ${currentYear }`,
  `Summer ${currentYear}`,
  `Spring ${currentYear}`,
  `Fall ${currentYear - 1}`,
  `Summer ${currentYear - 1}`,
  `Spring ${currentYear - 1}`,
    `Fall ${currentYear - 2}`,
  `Summer ${currentYear - 2}`,
  `Spring ${currentYear - 2}`,
];

const OnboardingPage: React.FC = () => {
  // On mount, check for config and courseList, navigate if present

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [school, setSchool] = useState("");
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  React.useEffect(() => {
    const config = localStorage.getItem("coursehub_config");
    const courseList = localStorage.getItem("courseList");
    if (config && courseList) {
      navigate("/");
    }
  }, [navigate]);
  const school_options = [
    {
      school_name: "University of Kentucky",
      school_url_key: 'https://uk.instructure.com/api/v1',
      school_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Kentucky_Wildcats_logo.svg/1200px-Kentucky_Wildcats_logo.svg.png'
    },
    {
      school_name: "State College",
      school_url_key: 'https://statecollege.instructure.com/api/v1',
      school_image: 'https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_2/v1718801487/scasdorg/ly3gtlomrnd26doittoj/Slogo.png'
    },
    {
      school_name: "Stanford",
      school_url_key: 'https://stanford.instructure.com/api/v1',
      school_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1200px-Stanford_Cardinal_logo.svg.png'
    }
  ]

  const validate = () => {
    if (!apiKey.trim()) return "Canvas API key is required.";
    if (!school.trim()) return "Please select your school.";
    if (!term.trim()) return "Please select your semester term.";
    return "";
  };



  const handleConfiguration = (apiKey: string, school_base_url: string, term: string) => {
    const config = { apiKey, school_base_url, term };
    localStorage.setItem("coursehub_config", JSON.stringify(config));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setLoading(true);
    handleConfiguration(apiKey, school, term);

    //fetch classes
    const classes = await fetchCourses(apiKey, school, term);
    const coloredClasses = assignUniqueColorsToCourses(classes);
    dispatch(setCourseList(coloredClasses));
    setLoading(false);
    navigate("/");

  };

  function assignUniqueColorsToCourses(courses: any[]) {
    const usedColors = new Set();
    const colorPalette = [
      '#154D71', // Deep Blue
      '#1C6EA4', // Blue
      '#33A1E0', // Sky Blue
      '#FFF9AF', // Soft Yellow
      '#F7B32B', // Warm Gold
      '#6DD3CE', // Aqua
      '#F6511D', // Vivid Orange
      '#7FB800', // Fresh Green
      '#B2B09B', // Stone Gray
      '#FFB7B2'  // Light Coral
    ];
    return courses.map(course => {
      let color;
      do {
        color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      } while (usedColors.has(color) && usedColors.size < colorPalette.length);
      usedColors.add(color);
      return { ...course, color };
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Welcome to Course Hub</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="apiKey">Canvas API Key</label>
          <input
            id="apiKey"
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="school">School</label>
          <div className="relative">
            <button
              type="button"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 flex items-center justify-between bg-white"
              disabled={loading}
              onClick={() => setDropdownOpen(v => !v)}
              id="school"
            >
              {school ? (
                <span className="flex items-center gap-2">
                  <img
                    src={school_options.find(opt => opt.school_url_key === school)?.school_image}
                    alt={school_options.find(opt => opt.school_url_key === school)?.school_name}
                    className="h-6 w-6 rounded-full border"
                  />
                  <span>{school_options.find(opt => opt.school_url_key === school)?.school_name}</span>
                </span>
              ) : (
                <span className="text-gray-400">Select school</span>
              )}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-10 bg-white border rounded shadow-lg mt-1">
                {school_options.map(opt => (
                  <button
                    type="button"
                    key={opt.school_url_key}
                    className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-blue-50 ${school === opt.school_url_key ? "bg-blue-100" : ""}`}
                    onClick={() => { setSchool(opt.school_url_key); setDropdownOpen(false); }}
                    disabled={loading}
                  >
                    <img src={opt.school_image} alt={opt.school_name} className="h-6 w-6 rounded-full border" />
                    <span>{opt.school_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="term">Semester Term</label>
          <select
            id="term"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={term}
            onChange={e => setTerm(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Select term</option>
            {terms.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default OnboardingPage;
