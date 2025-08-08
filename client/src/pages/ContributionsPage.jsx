import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContributionsPage.scss';

const ContributionsPage = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const { data } = await axios.get('/api/contributions');
        setContributions(data);
      } catch (err) {
        setError('Failed to load contributions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  if (loading) {
    return <div className="loader">Loading contributions...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="contributions-container">
      <h1>Contributions & Projects</h1>
      <div className="contribution-list">
        {contributions.length > 0 ? (
          contributions.map((item) => (
            <div key={item._id} className="contribution-card">
              <h3>{item.title}</h3>
              <p className="contribution-meta">
                Type: {item.type} | Date: {new Date(item.date).toLocaleDateString()}
              </p>
              <p>{item.description}</p>
              <div className="technologies">
                {item.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
              {item.projectUrl && (
                <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                  View Project
                </a>
              )}
            </div>
          ))
        ) : (
          <p>No contributions have been added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ContributionsPage;
