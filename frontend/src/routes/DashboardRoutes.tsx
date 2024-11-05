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
    path: '/dashboard', // base path
    element: <FullLayout />,
    children: [
      { path: '', element: <Navigate to="/dashboard" /> },
      // Role-based routes for dashboard pages:
      { path: 'admin', element: role === 'admin' ? <AdminDashboard /> : <Navigate to="/404" /> },
      { path: 'manager', element: role === 'manager' ? <ManagerDashboard /> : <Navigate to="/404" /> },
      { path: 'trainer', element: role === 'trainer' ? <TrainerDashboard /> : <Navigate to="/404" /> },
      
      // catch all routes
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
];

export default DashboardRoutes;
