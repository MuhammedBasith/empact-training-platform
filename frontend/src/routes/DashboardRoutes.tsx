import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

/* ****Pages***** */
const AdminDashboard = Loadable(lazy(() => import('../components/Dashboard/AdminDashboard')));
const ManagerDashboard = Loadable(lazy(() => import('../components/Dashboard/ManagerDashboard')));
const TrainerDashboard = Loadable(lazy(() => import('../components/Dashboard/TrainerDashboard')));

const DashboardRoutes = (role: string | undefined) => [
  {
    path: '/dashboard', // This is the base path for the dashboard
    element: <FullLayout />,
    children: [
      // Redirecting to `/dashboard` if accessing `/dashboard` directly
      { path: '', element: <Navigate to="/dashboard" /> }, // No `/dashboard` URL directly; empty path for base
      // Role-based routes for dashboard pages:
      { path: 'admin', element: role === 'admin' ? <AdminDashboard /> : <Navigate to="/404" /> },
      { path: 'manager', element: role === 'manager' ? <ManagerDashboard /> : <Navigate to="/404" /> },
      { path: 'trainer', element: role === 'trainer' ? <TrainerDashboard /> : <Navigate to="/404" /> },
      
      // This is the "catch-all" route for any invalid dashboard URLs
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
];

export default DashboardRoutes;
