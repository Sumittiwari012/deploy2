import React, { useState, useEffect } from 'react';
import './TherapistFinder.css';
import Select from 'react-select';

const languageOptions = [
  { value: 'ALL', label: 'ALL' },
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Gujarati', label: 'Gujarati' },
  { value: 'Kannada', label: 'Kannada' },
  { value: 'Malayalam', label: 'Malayalam' },
  { value: 'Punjabi', label: 'Punjabi' },
  { value: 'Urdu', label: 'Urdu' },
];

const consultationModes = [
  { value: 'ALL', label: 'ALL' },
  { value: 'Virtual', label: 'Virtual' },
  { value: 'In-Person', label: 'In-Person' }
];

const consultationTypes = [
  { value: 'ALL', label: 'ALL' },
  { value: '1:1 Therapy', label: '1:1 Therapy' },
  { value: 'Couples Therapy', label: 'Couples Therapy' },
  { value: 'Family Therapy', label: 'Family Therapy' },
  { value: 'Group Therapy', label: 'Group Therapy' },
  { value: 'Psychiatric Consultation', label: 'Psychiatric Consultation' },
  { value: 'Child/Adolescent Counseling', label: 'Child/Adolescent Counseling' },
  { value: 'Career Counseling', label: 'Career Counseling' },
  { value: 'Online Chat-based Counseling', label: 'Online Chat-based Counseling' },
  { value: 'Phone Call Session', label: 'Phone Call Session' },
  { value: 'Emergency Counseling', label: 'Emergency Counseling' }
];

const TherapistFinder = () => {
  const [therapists, setTherapists] = useState([]);
  const [filters, setFilters] = useState({
    specialization: 'ALL',
    language: 'ALL',
    mode: 'ALL',
    date: '',
    type: 'ALL',
    locationVisible: false,
    address: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        name: 'Dr. Anjali Sharma',
        specialization: 'Anxiety, Depression',
        language: 'English, Hindi',
        mode: 'Virtual',
        availability: 'Mon, Wed, Fri',
      },
      {
        id: 3,
        name: 'Dr. Virat Kohli',
        specialization: 'Anxiety, Depression',
        language: 'English, Hindi, Tamil',
        mode: 'Virtual',
        availability: 'Mon, Wed, Fri',
      },
      {
        id: 2,
        name: 'Dr. Raj Mehta',
        specialization: 'Stress Management',
        language: 'Gujarati, English',
        mode: 'In-Person',
        availability: 'Tue, Thu',
      },
    ];
    setTherapists(dummyData);
  }, []);

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(prev => ({ ...prev, [id]: value }));
  };

  const toggleLocation = () => {
    setFilters(prev => ({ ...prev, locationVisible: !prev.locationVisible }));
  };
const isMobile = window.innerWidth <= 768;
  return (
    <div className="finder-wrapper">
      <h2 className="section-title">Find a Therapist</h2>
      <div className="finder-container">
        <aside className="sidebar">
          {/* ✅ Mobile Top Row */}
          <div className="filter-top-row mobile-only">
            <input
              type="date"
              id="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
            <button type="button" onClick={() => setShowFilters(prev => !prev)}>
  {showFilters ? 'Hide Filters' : 'Add Filter'}
</button>

          </div>

          {/* ✅ Desktop Date Field */}
          <div className="desktop-only">
            <label>Date</label>
            <input
              type="date"
              id="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>

          {/* ✅ Filters visible based on state or desktop */}
          
{(!isMobile || showFilters) && (
  <div className={`filters-block ${showFilters ? 'show mobile-filters-animated' : ''}`}>

              <label>Specialization</label>
              <div className="custom-select">
                <Select
                  options={[
                    { value: 'ALL', label: 'ALL' },
                    { value: 'Anxiety', label: 'Anxiety' },
                    { value: 'Depression', label: 'Depression' },
                    { value: 'Relationship Issues', label: 'Relationship Issues' },
                    { value: 'Stress Management', label: 'Stress Management' },
                    { value: 'Child Therapy', label: 'Child Therapy' }
                  ]}
                  defaultValue={{ value: 'ALL', label: 'ALL' }}
                  onChange={(selectedOption) =>
                    setFilters(prev => ({ ...prev, specialization: selectedOption.value }))
                  }
                  classNamePrefix="react-select"
                  menuPlacement="top"
                />
              </div>

              <label>Language</label>
              <div className="custom-select">
                <Select
                  options={languageOptions}
                  defaultValue={languageOptions[0]}
                  onChange={(selectedOption) =>
                    setFilters(prev => ({ ...prev, language: selectedOption.value }))
                  }
                  classNamePrefix="react-select"
                  menuPlacement="top"
                />
              </div>

              <label>Consultation Mode</label>
              <div className="custom-select">
                <Select
                  options={consultationModes}
                  defaultValue={consultationModes[0]}
                  onChange={(selectedOption) =>
                    setFilters(prev => ({ ...prev, mode: selectedOption.value }))
                  }
                  classNamePrefix="react-select"
                  menuPlacement="top"
                />
              </div>

              {filters.mode === 'In-Person' && (
                <div className="location-field">
                  <label>Location Preference</label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Enter your address"
                    onChange={handleFilterChange}
                  />
                  <button onClick={toggleLocation}>Use Current Location</button>
                </div>
              )}

              <label>Consultation Type</label>
              <div className="custom-select">
                <Select
                  options={consultationTypes}
                  defaultValue={consultationTypes[0]}
                  onChange={(selectedOption) =>
                    setFilters(prev => ({ ...prev, type: selectedOption.value }))
                  }
                  classNamePrefix="react-select"
                  menuPlacement="top"
                />
              </div>
            </div>
          )}
        </aside>

        <section className="results">
          <div className="cards-grid">
            {therapists.map(t => (
              <div className="profile-card" key={t.id}>
                <div className="card-header">{t.name}</div>
                <div className="card-body">
                  <p><strong>Specialization:</strong> {t.specialization}</p>
                  <p><strong>Language:</strong> {t.language}</p>
                  <p><strong>Mode:</strong> {t.mode}</p>
                  <p className="availability"><strong>Available:</strong> {t.availability}</p>
                  <button className="btn btn-success mt-2">Book Session</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TherapistFinder;
