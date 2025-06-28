import React, { useEffect } from 'react';
import './MentalHealthLanding.css';
import heroImage from './bg_img3.png';

const MentalHealthLanding = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    const textSection = document.querySelector('.text-section');
    const imageSection = document.querySelector('.image-section');

    if (textSection) observer.observe(textSection);
    if (imageSection) observer.observe(imageSection);

    // Button hover animations
    const buttons = document.querySelectorAll('.cta-primary, .cta-secondary');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
      });
    });
  }, []);

  const toggleMobileMenu = () => {
    const navbar = document.getElementById('mobileNavbar');
    navbar.classList.toggle('show');
  };

  return (
    <div>
      {/* Hamburger Icon for Mobile */}
      <div className="hamburger" onClick={toggleMobileMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Floating Login/Register */}
      <div className="floating-login-register">
        <a className="nav-button login" href="login.html">Login</a>
        <a className="nav-button register" href="register.html">Register</a>
      </div>

      {/* Mobile Sidebar */}
      <nav className="mobile-navbar" id="mobileNavbar">
        <a className="nav-button" href="therapy/directory.html">Therapy Directory</a>
        <a className="nav-button" href="self_care/library.html">Self-Care Resources</a>
        <a className="nav-button" href="community/forum.html">Community Forum</a>
        <a className="nav-button" href="corporate/employer_dashboard.html">Corporate Dashboard</a>
        <a className="nav-button" href="admin/user_management.html">Admin Panel</a>
      </nav>

      {/* Desktop Navbar */}
      <nav className="navbar">
        <div className="navbar-desktop">
          <div className="nav-left">
            <a className="nav-button" href="therapy/directory.html">Therapy Directory</a>
            <a className="nav-button" href="self_care/library.html">Self-Care Resources</a>
            <a className="nav-button" href="community/forum.html">Community Forum</a>
            <a className="nav-button" href="corporate/employer_dashboard.html">Corporate Dashboard</a>
            <a className="nav-button" href="admin/user_management.html">Admin Panel</a>
          </div>
          <div className="nav-right">
            <a className="nav-button login" href="login.html">Login</a>
            <a className="nav-button register" href="register.html">Register</a>
          </div>
        </div>
      </nav>

      {/* Intro Section */}
      <div className="main-content" id="mainContent">
        <div className="container">
          <div className="text-section">
            <h1>Welcome to Mental Health App</h1>
            <h3>Your companion for better mental health and well-being.</h3>
            <h3>Track your emotions, manage stress, and build healthy habits — all in one place.</h3>
            <h3>We're here to support your journey, every step of the way.</h3>
            <h3>Because your mental health matters — today, tomorrow, always.</h3>

            <div className="cta-buttons">
              <a href="./get-started" className="cta-primary">Get Started <span>→</span></a>
              <a href="./learn-more" className="cta-secondary">Learn More <span>→</span></a>
            </div>
          </div>

          <div className="image-section">
            <img src={heroImage} alt="Mental Health Illustration" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthLanding;