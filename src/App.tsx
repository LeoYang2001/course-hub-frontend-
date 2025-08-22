import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DueTablePage from './pages/DueTablePage';
import OnboardingPage from './pages/LoginPage';
import './App.css';
import Header from './components/Header';
import { Provider } from 'react-redux';
import store from './store/store';



function App() {


  
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<OnboardingPage />} />
          <Route
            path="*"
            element={
              <div className=' w-full h-[100vh] flex flex-col'>
                <Header />
                <main className=' flex-1  overflow-y-scroll '>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/due" element={<DueTablePage />} />
                    {/* Example details route, replace with actual component later */}
                    <Route path="/course/:courseId" element={<div>Course Details Page (WIP)</div>} />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

  export default App;
