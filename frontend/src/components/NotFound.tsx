import React from 'react';
import './notFoundStyle.css'; // Ensure this path is correct relative to your Vite project
import bgImage from '../assets/images/Notfound.jpg'; // Ensure this path is correct relative to your Vite project

const NotFound: React.FC = () => {
  return (
    <div id="notfound" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="notfound">
        <div className="notfound-404">
          <h1>Oops!</h1>
        </div>
        <h2>404 - Page not found</h2>
        <p>
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
        <a href="/">Go To Homepage</a>
      </div>
    </div>
  );
};

export default NotFound;
