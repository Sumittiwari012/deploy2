import React, { useEffect, useState } from 'react';
import './Professional.css';

const Professional = () => {
  const [profileComplete, setProfileComplete] = useState(false);
  const [therapist, setTherapist] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    setTherapist({
      name: 'Dr. Priya Sharma',
      edu: 'M.A. Clinical Psychology',
      exp: '5',
      specialization: 'Anxiety, Depression, Teen Counseling',
      certification: ['CBT', 'REBT'],
      lang: ['English', 'Hindi'],
      mode: ['Online', 'Offline'],
      price: '800',
      email: 'priya@email.com',
      pno: '9876543210',
    });

    const slots = [];
    for (let h = 0; h < 24; h++) {
      const ampm = h < 12 ? 'AM' : 'PM';
      const hour = h % 12 === 0 ? 12 : h % 12;
      slots.push(`${hour}:00 ${ampm}`, `${hour}:30 ${ampm}`);
    }
    setTimeSlots(slots);
  }, []);

  if (!therapist) return <div className="loading">Loading...</div>;

  return (
    <div className="pro-wrapper">
      {!profileComplete && (
        <div className="pro-notice">
          ⚠️ Your profile is incomplete.{' '}
          <span onClick={() => setProfileComplete(true)}>Complete Now</span>
        </div>
      )}

      <aside className="pro-sidebar">
        <h2>{therapist.name}</h2>
        <p><strong>Education:</strong> {therapist.edu}</p>
        <p><strong>Experience:</strong> {therapist.exp} yrs</p>
        <p><strong>Specialization:</strong> {therapist.specialization}</p>
        <p><strong>Certifications:</strong> {therapist.certification.join(', ')}</p>
        <p><strong>Languages:</strong> {therapist.lang.join(', ')}</p>
        <p><strong>Mode:</strong> {therapist.mode.join(', ')}</p>
        <p><strong>Fee:</strong> ₹{therapist.price}</p>
        <p><strong>Contact:</strong> {therapist.email} / {therapist.pno}</p>
        <a href="/logout" className="logout-btn">Logout</a>
      </aside>

      <main className="pro-dashboard">
        <h3>Dashboard Actions</h3>
        <div className="pro-cards">
  {[
    'Approve Meetings',
    'Check Scheduled',
    'Edit Pricing / Time',
    'Ask for Rescheduling',
    'Update Specialization'
  ].map((label, i) => (
    <div
      key={i}
      className={`pro-card ${!profileComplete ? 'disabled' : ''}`}
      onClick={() => profileComplete && window.location.assign('#')}
    >
      <div className="pro-number">{i + 1}</div>
      {label}
    </div>
  ))}
</div>


        <div className="edit-form">
          <h4>Edit Availability</h4>
          <label>Date</label>
          <input type="date" />
          <label>Day</label>
          <select>
            <option>--Select--</option>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <option key={day}>{day}</option>
            ))}
          </select>
          <label>Time Slot</label>
          <select>
            {timeSlots.map((t, i) => <option key={i}>{t}</option>)}
          </select>
          <label>Price</label>
          <input type="number" placeholder="e.g. 800" />
          <button>Edit</button>
        </div>
      </main>
    </div>
  );
};

export default Professional;
