import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownloadCv = async () => {
    setError('');
    setDownloading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/cv/generate', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Important for handling file downloads
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cv.pdf');
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download CV.');
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! This is your private dashboard.</p>

      <div style={{ marginTop: '2rem' }}>
        <h3>Tools</h3>
        <button onClick={handleDownloadCv} disabled={downloading}>
          {downloading ? 'Generating...' : 'Download CV as PDF'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* Other dashboard components will go here */}
    </div>
  );
};

export default AdminDashboard;
