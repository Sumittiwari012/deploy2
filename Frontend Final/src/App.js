import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MentalHealthLanding from "./MentalHealthLanding";
import UserPage from "./UserPage";
import TherapistFinder from "./TherapistFinder";
import SelfCareResources from './SelfCareResources';
import Professional from './Professional';
import AdminDashboard from './AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MentalHealthLanding />} />
        <Route path="/dashboard" element={<UserPage />} />
        <Route path="/therapists" element={<TherapistFinder />} />
        <Route path="/resources" element={<SelfCareResources />} />
        <Route path="/professional" element={<Professional/>}/>
        <Route path="/admin" element={<AdminDashboard />} />
    
      </Routes>
    </Router>
  );
}

export default App;
