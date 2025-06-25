import React, { useEffect } from 'react';
import './UserPage.css';

const UserPage = () => {
  useEffect(() => {
    // Animate stat cards on load
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate');
      }, index * 150);
    });

    // Animate info cards on scroll
    const infoCards = document.querySelectorAll('.cards .card');
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target); // Animate once
        }
      });
    }, { threshold: 0.3 });

    infoCards.forEach(card => cardObserver.observe(card));

    // Animate upcoming sessions on scroll
    const upcomingSection = document.querySelector('.upcoming');
    if (upcomingSection) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const sessions = entry.target.querySelectorAll('.session');
            sessions.forEach((session, index) => {
              setTimeout(() => {
                session.classList.add('visible');
              }, index * 200);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(upcomingSection);
    }
  }, []);

  return (
    <>
      <div className="navbar">
        <h1>Mental Health Dashboard</h1>
        <div className="user-menu">
          <div className="user-avatar">JD</div>
          <button className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="container">
        <div className="header-section">
          <h2>Welcome back, John Doe</h2>
          <p className="username">@johndoe</p>
        </div>

        {/* Stats Grid */}
<div className="stats-grid">
  <div className="stats-row">
    <div className="stat-card">
      <div className="stat-number">12</div>
      <div className="stat-label">🗓️ Sessions Completed</div>
    </div>
    <div className="stat-card">
      <div className="stat-number">85%</div>
      <div className="stat-label">💚 Wellness Score</div>
    </div>
  </div>
  <div className="stats-row">
    <div className="stat-card">
      <div className="stat-number">3</div>
      <div className="stat-label">🎯 Active Goals</div>
    </div>
    <div className="stat-card">
      <div className="stat-number">28</div>
      <div className="stat-label">🔥 Days Streak</div>
    </div>
  </div>
</div>


        {/* Info Cards */}
        <div className="cards">
          <div className="card slide-left">
            <div className="card-icon">👨‍⚕️</div>
            <h3>Therapy Services</h3>
            <p>Connect with certified therapists and schedule personalized sessions that fit your schedule and preferences.</p>
            <a href="./browse-professional" className="card-btn">Browse Professionals</a>
          </div>

          <div className="card fade">
            <div className="card-icon">🧘‍♀️</div>
            <h3>Self-Care Tools</h3>
            <p>Access guided meditations, breathing exercises, and personalized wellness routines designed for your needs.</p>
            <a href="./explore-resources" className="card-btn">Explore Resources</a>
          </div>

          <div className="card slide-right">
            <div className="card-icon">👥</div>
            <h3>Community Forum</h3>
            <p>Join safe, anonymous discussions with others on similar journeys. Share experiences and find support.</p>
            <a href="./join-community" className="card-btn">Join Community</a>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="upcoming">
          <h3>Upcoming Sessions</h3>
          <div className="sessions-container">
            <div className="session">
              <div className="session-header">
                <div className="session-title">Dr. Emily Smith</div>
                <div className="session-status">Online</div>
              </div>
              <div className="session-details">
                <div className="session-detail"><strong>Date:</strong> June 25, 2025</div>
                <div className="session-detail"><strong>Time:</strong> 3:00 PM</div>
                <div className="session-detail"><strong>Duration:</strong> 50 minutes</div>
                <div className="session-detail"><strong>Focus:</strong> Anxiety Management</div>
              </div>
            </div>

            <div className="session">
              <div className="session-header">
                <div className="session-title">Dr. Alex Johnson</div>
                <div className="session-status">In-Person</div>
              </div>
              <div className="session-details">
                <div className="session-detail"><strong>Date:</strong> July 1, 2025</div>
                <div className="session-detail"><strong>Time:</strong> 11:00 AM</div>
                <div className="session-detail"><strong>Duration:</strong> 60 minutes</div>
                <div className="session-detail"><strong>Focus:</strong> Cognitive Therapy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
