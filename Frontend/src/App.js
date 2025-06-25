import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MentalHealthLanding from "./MentalHealthLanding";
import UserPage from "./UserPage";
import TherapistFinder from "./TherapistFinder";
import SelfCareResources from './SelfCareResources';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MentalHealthLanding />} />
        <Route path="/dashboard" element={<UserPage />} />
        <Route path="/therapists" element={<TherapistFinder />} />
        <Route path="/resources" element={<SelfCareResources />} />
      </Routes>
    </Router>
  );
}

export default App;
