import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <button onClick={authContext?.signOut}>Sign Out</button>
    </div>
  );
};

export default Dashboard;
