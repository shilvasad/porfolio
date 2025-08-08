import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.scss';

const HomePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/profile');
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home-container">
      {profile && (
        <header className="profile-header">
          <img
            src={profile.profilePictureUrl || 'https://via.placeholder.com/150'}
            alt={profile.name}
            className="profile-picture"
          />
          <h1>{profile.name}</h1>
          <h2>{profile.title}</h2>
          <p className="bio">{profile.bio}</p>
          <div className="social-links">
            {profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
            {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {profile.socialLinks?.twitter && <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
          </div>
        </header>
      )}
    </div>
  );
};

export default HomePage;
