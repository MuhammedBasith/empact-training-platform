import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { saveUserToDb } from '../../api/userApi';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authContext?.signUp(email, password);
      await saveUserToDb({ email }); // Save user details to the backend
      alert('Sign up successful!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
