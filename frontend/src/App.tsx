// src/App.js
import './App.css';
import './components/RequirementsForm';
import './css/style.css';
import './css/additional-styles/custom-fonts.css';
import './css/additional-styles/theme.css';
import './css/additional-styles/utility-patterns.css';
import SignIn from './components/Auth/signin/SignIn';
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import HomeLayout from './layouts/HomeLayout'; // Import HomeLayout
import Home from './components/Home'; // Import Home
import { Routes, Route } from 'react-router-dom';
import SignUp from './components/Auth/signup/SignUp';


function App() {
  return (
      <RootLayout>
        <Routes>
          <Route path="/" element={<HomeLayout><Home /></HomeLayout>} />
          <Route path="/signin" element={<AuthLayout><SignIn /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
        </Routes>
      </RootLayout>
  );
}

export default App;
