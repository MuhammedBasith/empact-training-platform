import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

/* ****Pages***** */
const AdminDashboard = Loadable(lazy(() => import('../components/Dashboard/AdminDashboard')));
const ManagerDashboard = Loadable(lazy(() => import('../components/Dashboard/ManagerDashboard')));
const TrainerDashboard = Loadable(lazy(() => import('../components/Dashboard/TrainerDashboard')));

// Manager Details page
const ManagerDetailsPage = Loadable(lazy(() => import('../views/AdminView/dashboard/components/ManagerDetails')));
const ManagersData = Loadable(lazy(() => import('../views/AdminView/dashboard/components/ManagersData')));

const DashboardRoutes = (role: string | undefined) => [
  {
    path: '/dashboard', // base path
    element: <FullLayout />,
    children: [
      { path: '', element: role ? <Navigate to={`/dashboard/${role}`} /> : <Navigate to="/404" /> }, // Redirect to the role-specific dashboard
      // Role-based routes for dashboard pages:
      { path: 'admin', element: role === 'admin' ? <AdminDashboard /> : <Navigate to="/404" /> },
      { path: 'manager', element: role === 'manager' ? <ManagerDashboard /> : <Navigate to="/404" /> },
      { path: 'trainer', element: role === 'trainer' ? <TrainerDashboard /> : <Navigate to="/404" /> },
      
      // Manager Details route
      { path: 'admin/managers/', element: role === 'admin' ? <ManagersData /> : <Navigate to="/404" /> },
      { path: 'admin/managers/:id', element: role === 'admin' ? <ManagerDetailsPage /> : <Navigate to="/404" /> },
      
      // catch all routes
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
];

export default DashboardRoutes;
