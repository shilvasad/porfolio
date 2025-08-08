import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageProfile.scss';

const ManageProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    profilePictureUrl: '',
    github: '',
    linkedin: '',
    twitter: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/profile');
        setFormData({
          name: data.name || '',
          title: data.title || '',
          bio: data.bio || '',
          profilePictureUrl: data.profilePictureUrl || '',
          github: data.socialLinks?.github || '',
          linkedin: data.socialLinks?.linkedin || '',
          twitter: data.socialLinks?.twitter || '',
          email: data.contact?.email || '',
        });
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const body = {
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        profilePictureUrl: formData.profilePictureUrl,
        socialLinks: {
          github: formData.github,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        },
        contact: {
          email: formData.email,
        },
      };
      await axios.put('/api/profile', body, config);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="manage-profile-container">
      <h2>Manage Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Profile Picture URL</label>
          <input type="text" name="profilePictureUrl" value={formData.profilePictureUrl} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>GitHub URL</label>
          <input type="text" name="github" value={formData.github} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>LinkedIn URL</label>
          <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Twitter URL</label>
          <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ManageProfile;
