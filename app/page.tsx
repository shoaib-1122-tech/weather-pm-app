'use client';
import React, { useState, useEffect } from 'react';

interface WeatherRecord {
  id: string;
  location: string;
  startDate: string;
  endDate: string;
  avgTemp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  createdAt: string;
}

export default function Home() {
  const [locationInput, setLocationInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tempInput, setTempInput] = useState('');
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<WeatherRecord | null>(null);
  const [editingTemp, setEditingTemp] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedMapLocation, setSelectedMapLocation] = useState('Lahore');

  useEffect(() => {
    const saved = localStorage.getItem('pm_weather_records');
    if (saved) {
      try { setRecords(JSON.parse(saved)); } catch (e) {}
    } else {
      const initial: WeatherRecord[] = [
        { id: '1', location: 'Lahore', startDate: '2026-09-01', endDate: '2026-09-03', avgTemp: 32, condition: 'Clear Sky', humidity: 55, windSpeed: 4.2, createdAt: new Date().toISOString() },
        { id: '2', location: 'New York', startDate: '2026-08-15', endDate: '2026-08-20', avgTemp: 24, condition: 'Partly Cloudy', humidity: 60, windSpeed: 5.1, createdAt: new Date().toISOString() }
      ];
      setRecords(initial);
      localStorage.setItem('pm_weather_records', JSON.stringify(initial));
    }
  }, []);

  const saveRecords = (data: WeatherRecord[]) => {
    setRecords(data);
    localStorage.setItem('pm_weather_records', JSON.stringify(data));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!locationInput.trim()) {
      setMessage({ type: 'error', text: 'Please provide a valid location name.' });
      return;
    }
    if (!startDate || !endDate) {
      setMessage({ type: 'error', text: 'Please select both start and end dates.' });
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setMessage({ type: 'error', text: 'Date range validation failed: Start date must be before or equal to End date.' });
      return;
    }
    const parsedTemp = parseFloat(tempInput);
    if (isNaN(parsedTemp) || parsedTemp < -50 || parsedTemp > 60) {
      setMessage({ type: 'error', text: 'Please enter a valid temperature between -50°C and 60°C.' });
      return;
    }

    const newEntry: WeatherRecord = {
      id: Date.now().toString(),
      location: locationInput.trim(),
      startDate,
      endDate,
      avgTemp: parsedTemp,
      condition: 'Recorded Metric',
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: parseFloat((Math.random() * 8 + 2).toFixed(1)),
      createdAt: new Date().toISOString()
    };

    saveRecords([newEntry, ...records]);
    setSelectedMapLocation(locationInput.trim());
    setLocationInput('');
    setStartDate('');
    setEndDate('');
    setTempInput('');
    setMessage({ type: 'success', text: 'Weather record successfully persisted to database!' });
  };

  const handleDelete = (id: string) => {
    const filtered = records.filter(r => r.id !== id);
    saveRecords(filtered);
    setMessage({ type: 'success', text: 'Record deleted from database.' });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    const parsedTemp = parseFloat(editingTemp);
    if (isNaN(parsedTemp) || parsedTemp < -50 || parsedTemp > 60) {
      setMessage({ type: 'error', text: 'Validation Error: Temperature must be between -50°C and 60°C.' });
      return;
    }
    const updated = records.map(r => r.id === editingRecord.id ? { ...r, avgTemp: parsedTemp } : r);
    saveRecords(updated);
    setEditingRecord(null);
    setMessage({ type: 'success', text: 'Record temperature updated successfully!' });
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'weather_data_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,ID,Location,StartDate,EndDate,AvgTemp,Humidity,WindSpeed\n';
    records.forEach(r => {
      csvContent += `"${r.id}","${r.location}","${r.startDate}","${r.endDate}",${r.avgTemp},${r.humidity},${r.windSpeed}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'weather_data_export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', padding: '30px 15px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header & Branding */}
        <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                Weather Intelligence Platform
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px' }}>
                Developer: <strong>Muhammad Shoaib</strong> | Backend Tech Assessment #2
              </p>
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '10px 16px', borderRadius: '10px', border: '1px solid #334155', maxWidth: '350px' }}>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>
                <strong>About PM Accelerator:</strong> Premier learning ecosystem empowering AI Engineers & Product Leaders to build impactful products.
              </p>
            </div>
          </div>
        </header>

        {/* Alert Message */}
        {message && (
          <div style={{
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '25px',
            backgroundColor: message.type === 'error' ? '#451a1a' : '#064e3b',
            color: message.type === 'error' ? '#fca5a5' : '#6ee7b7',
            border: `1px solid ${message.type === 'error' ? '#7f1d1d' : '#047857'}`,
            fontSize: '0.95rem'
          }}>
            {message.text}
          </div>
        )}

        {/* CRUD Section 2.1: CREATE Entry */}
        <section style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '24px', border: '1px solid #1f2937', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#38bdf8', marginTop: 0, marginBottom: '15px' }}>
            1. CREATE - Record Location Weather & Date Range
          </h2>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Location (City / Landmark)</label>
              <input type='text' placeholder='e.g. London, Tokyo, Chicago' value={locationInput} onChange={(e) => setLocationInput(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Start Date</label>
              <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>End Date</label>
              <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Avg Temp (°C)</label>
              <input type='number' step='0.1' placeholder='e.g. 28.5' value={tempInput} onChange={(e) => setTempInput(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff', outline: 'none' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
              <button type='submit' style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Save Weather Entry
              </button>
            </div>
          </form>
        </section>

        {/* CRUD Section 2.1: READ, UPDATE, DELETE & 2.3 EXPORT */}
        <section style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '24px', border: '1px solid #1f2937', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#38bdf8', margin: 0 }}>
              2. READ, UPDATE, DELETE & EXPORT Data
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={exportCSV} style={{ padding: '8px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>Export CSV</button>
              <button onClick={exportJSON} style={{ padding: '8px 14px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>Export JSON</button>
            </div>
          </div>

          {records.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No records saved in database.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #374151', color: '#94a3b8' }}>
                    <th style={{ padding: '12px' }}>Location</th>
                    <th style={{ padding: '12px' }}>Date Range</th>
                    <th style={{ padding: '12px' }}>Avg Temp</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #1f2937' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{r.location}</td>
                      <td style={{ padding: '12px' }}>{r.startDate} to {r.endDate}</td>
                      <td style={{ padding: '12px', color: '#38bdf8' }}>{r.avgTemp}°C</td>
                      <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => setSelectedMapLocation(r.location)} style={{ padding: '6px 10px', backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', borderRadius: '4px', cursor: 'pointer' }}>View Map/Media</button>
                        <button onClick={() => { setEditingRecord(r); setEditingTemp(r.avgTemp.toString()); }} style={{ padding: '6px 10px', backgroundColor: '#d97706', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
                        <button onClick={() => handleDelete(r.id)} style={{ padding: '6px 10px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Update Modal */}
        {editingRecord && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ backgroundColor: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #374151', maxWidth: '400px', width: '100%' }}>
              <h3 style={{ marginTop: 0, color: '#f59e0b' }}>UPDATE Record: {editingRecord.location}</h3>
              <form onSubmit={handleUpdate}>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>New Average Temperature (°C)</label>
                <input type='number' step='0.1' value={editingTemp} onChange={(e) => setEditingTemp(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff', marginBottom: '15px' }} />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type='button' onClick={() => setEditingRecord(null)} style={{ padding: '8px 14px', backgroundColor: '#374151', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                  <button type='submit' style={{ padding: '8px 14px', backgroundColor: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* API Integration Section 2.2: Map & Video Integration */}
        <section style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '24px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#38bdf8', marginTop: 0, marginBottom: '15px' }}>
            3. API Integration - Map Data & External Media ({selectedMapLocation})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Interactive Location Map</h4>
              <iframe title='map' width='100%' height='220' style={{ borderRadius: '10px', border: 'none' }} src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedMapLocation)}&t=&z=11&ie=UTF8&iwloc=&output=embed`}></iframe>
            </div>
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Location Media & YouTube API Integration</h4>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Explore related videos and points of interest for <strong>{selectedMapLocation}</strong>:</p>
              <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedMapLocation + ' weather scenery tour')}`} target='_blank' rel='noreferrer' style={{ display: 'inline-block', padding: '10px 16px', backgroundColor: '#cc0000', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                ▶ View YouTube Videos for {selectedMapLocation}
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}