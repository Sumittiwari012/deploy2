import React, { useState } from 'react';
import './AdminDashboard.css';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const dummyGraphData = [
  { name: 'Mon', visits: 2400, sales: 1200 },
  { name: 'Tue', visits: 2210, sales: 1100 },
  { name: 'Wed', visits: 2290, sales: 1600 },
  { name: 'Thu', visits: 2000, sales: 1300 },
  { name: 'Fri', visits: 2181, sales: 1500 },
  { name: 'Sat', visits: 2500, sales: 1700 },
  { name: 'Sun', visits: 2100, sales: 1400 },
];

const approved = [
  { name: 'Dr. Priya Sharma', email: 'priya@mentalhealth.com', specialization: 'Child Therapy' },
  { name: 'Dr. Vikram Desai', email: 'vikram@healing.com', specialization: 'Stress Management' },
];

const unapproved = [
  { name: 'Dr. Anjali Mehta', email: 'anjali@mindspace.com', specialization: 'Depression' },
  { name: 'Dr. Neeraj Sinha', email: 'neeraj@peace.com', specialization: 'Anxiety' },
];

const AdminDashboard = () => {
  const [section, setSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filterData = (data) =>
    data.filter((person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Admin Panel</h1>

      {/* Graphs Section */}
      <div className="graph-section">
        <div className="circle-graph-wrapper">
          <div className="circle-graph">
            <svg viewBox="0 0 36 36" className="circular-chart green">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="circle" strokeDasharray="72, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <text x="18" y="20.35" className="percentage">72%</text>
            </svg>
            <p className="circle-label">Traffic</p>
          </div>

          <div className="circle-graph">
            <svg viewBox="0 0 36 36" className="circular-chart yellow">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="circle" strokeDasharray="56, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <text x="18" y="20.35" className="percentage">56%</text>
            </svg>
            <p className="circle-label">Booking Rate</p>
          </div>
        </div>

        <div className="line-graph">
          <h4 className="admin-graph-title">Weekly Activity Overview</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyGraphData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3d47" />
              <XAxis dataKey="name" stroke="#9ca9ad" />
              <YAxis stroke="#9ca9ad" />
              <Tooltip />
              <Line type="monotone" dataKey="visits" stroke="#5b846e" strokeWidth={3} />
              <Line type="monotone" dataKey="sales" stroke="#d0dada" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section Control Buttons + Unified Search */}
      <div className="admin-controls-bar">
        <div className="admin-controls">
          <button className="admin-btn" onClick={() => setSection('approved')}>
            View Approved Professionals
          </button>
          <button className="admin-btn" onClick={() => setSection('unapproved')}>
            View Unapproved Professionals
          </button>
        </div>
        <input
          type="text"
          className="admin-search"
          placeholder="Search doctors/users by name, email, or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Approved Professionals */}
      {section === 'approved' && (
        <div className="admin-card">
          <h4>Approved Professionals</h4>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                </tr>
              </thead>
              <tbody>
                {filterData(approved).map((p, i) => (
                  <tr key={i}>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.specialization}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Unapproved Professionals */}
      {section === 'unapproved' && (
        <div className="admin-card">
          <h4>Unapproved Professionals</h4>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterData(unapproved).map((p, i) => (
                  <tr key={i}>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.specialization}</td>
                    <td>
                      <button className="admin-btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                        View Profile
                      </button>
                      <div className="form-check">
                        <input type="checkbox" />
                        <label>Approve</label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
