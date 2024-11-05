import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../components/Dashboard/Dashboard')));
const AdminDashboard = Loadable(lazy(() => import('../components/Dashboard/AdminDashboard')));
const ManagerDashboard = Loadable(lazy(() => import('../components/Dashboard/ManagerDashboard')));
const TrainerDashboard = Loadable(lazy(() => import('../components/Dashboard/TrainerDashboard')));

const DashboardRoutes = (role: string | undefined) => [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/dashboard/admin', exact: true, element: role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" /> },
      { path: '/dashboard/manager', exact: true, element: role === 'manager' ? <ManagerDashboard /> : <Navigate to="/dashboard" /> },
      { path: '/dashboard/trainer', exact: true, element: role === 'trainer' ? <TrainerDashboard /> : <Navigate to="/dashboard" /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default DashboardRoutes;
