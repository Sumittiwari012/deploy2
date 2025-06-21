import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MentalHealthLanding from './MentalHealthLanding';
import UserPage from './UserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MentalHealthLanding />} />
        <Route path="/dashboard" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
