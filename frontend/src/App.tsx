import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { baselightTheme } from './theme/DefaultColors';
import { useUserContext } from './context/UserContext';

// Import layouts
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import HomeLayout from './layouts/HomeLayout';

// Import pages
import SignIn from './components/Auth/signin/SignIn';
import SignUp from './components/Auth/signup/SignUp';
import ResetPassword from './components/Auth/reset-password/ResetPassword';
import Home from './components/Home';
import NotFound from './components/Error';

// Import Dashboard Routes
import DashboardRoutes from './routes/DashboardRoutes';

function App() {
  const { user } = useUserContext();
  const isAuthenticated = !!user;
  const location = useLocation();
  const role = user?.role?.toLowerCase();

  const myTheme = baselightTheme;

  return (
    <RootLayout>
      <CssBaseline />
      <ThemeProvider theme={myTheme}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeLayout><Home /></HomeLayout>} />

          {/* Redirect if authenticated */}
          <Route 
            path="/signin" 
            element={isAuthenticated ? <Navigate to={`/dashboard/${role}`} replace state={{ from: location }} /> : <AuthLayout><SignIn /></AuthLayout>} 
          />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to={`/dashboard/${role}`} replace state={{ from: location }} /> : <AuthLayout><SignUp /></AuthLayout>} 
          />
          <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />

          {/* Protected Dashboard Routes */}
          {isAuthenticated && DashboardRoutes(role).map((route, idx) => (
            <Route key={idx} path={route.path} element={route.element}>
              {route.children && route.children.map((childRoute, childIdx) => (
                <Route key={childIdx} path={childRoute.path} element={childRoute.element} />
              ))}
            </Route>
          ))}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </RootLayout>
  );
}

export default App;
