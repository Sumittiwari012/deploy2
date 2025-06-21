import React from 'react';
import './UserPage.css';

const UserPage = () => {
  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>Welcome Back!</h1>
        <p>Manage your mental wellness journey here.</p>
      </header>

      <section className="dashboard-cards">
        <div className="card">Your Mood Tracker</div>
        <div className="card">Upcoming Therapy Sessions</div>
        <div className="card">Recommended Resources</div>
        <div className="card">Daily Journal</div>
      </section>
    </div>
  );
};

export default UserPage;
