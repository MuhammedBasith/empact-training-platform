import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
const RequirementsForm = Loadable(lazy(() => import('../../src/components/RequirementsForm')));

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

/* ****Pages***** */
const AdminDashboard = Loadable(lazy(() => import('../components/Dashboard/AdminDashboard')));
const ManagerDashboard = Loadable(lazy(() => import('../components/Dashboard/ManagerDashboard')));
const TrainerDashboard = Loadable(lazy(() => import('../components/Dashboard/TrainerDashboard')));

// Manager Details page
const ManagerDetailsPage = Loadable(lazy(() => import('../views/AdminView/dashboard/components/ManagerDetails')));
const ManagersData = Loadable(lazy(() => import('../views/AdminView/dashboard/components/ManagersData')));
const TrainersData = Loadable(lazy(() => import('../views/AdminView/dashboard/components/TrainersData')));
const EmployeeDetails = Loadable(lazy(() => import('../views/AdminView/dashboard/components/EmployeeDetails')));
const ProgressDetails = Loadable(lazy(() => import('../views/AdminView/dashboard/components/ProgressDetails')));
const AddResultsPage = Loadable(lazy(() => import('../views/AdminView/dashboard/components/AddResultsPage')));
const ManagerInsights = Loadable(lazy(() => import('../views/ManagerView/dashboard/components/ManagerInsights')));
const EmployeeDetailsForManagers = Loadable(lazy(() => import('../views/ManagerView/dashboard/components/EmployeeDetailsForManagers')));
const AddEmployees = Loadable(lazy(() => import('../views/ManagerView/dashboard/components/AddEmployees')));
const TrainingDetails = Loadable(lazy(() => import('../views/TrainerView/dashboard/components/TrainingDetails')));





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

      // Admin route
      { path: 'admin/managers/', element: role === 'admin' ? <ManagersData /> : <Navigate to="/404" /> },
      { path: 'admin/managers/:id', element: role === 'admin' ? <ManagerDetailsPage /> : <Navigate to="/404" /> },
      { path: 'admin/managers/:id/:trainingId', element: role === 'admin' ? <EmployeeDetails /> : <Navigate to="/404" /> },
      { path: 'admin/managers/:id/:trainingId/:batchId', element: role === 'admin' ? <EmployeeDetails /> : <Navigate to="/404" /> },
      { path: 'admin/managers/:id/:trainingId/:batchId/progress/:cognitoId', element: role === 'admin' ? <ProgressDetails /> : <Navigate to="/404" /> },
      { path: 'admin/managers/:id/:trainingId/results', element: role === 'admin' ? <AddResultsPage /> : <Navigate to="/404" /> },
      { path: 'admin/trainers/', element: role === 'admin' ? <TrainersData /> : <Navigate to="/404" /> },


      // Managers route
      { path: 'manager/trainings', element: role === 'manager' ? <ManagerInsights /> : <Navigate to="/404" /> },
      { path: 'manager/trainings/add', element: role === 'manager' ? <RequirementsForm /> : <Navigate to="/404" /> },
      { path: 'manager/trainings/:cognitoId/:trainingId/:batchId', element: role === 'manager' ? <EmployeeDetailsForManagers /> : <Navigate to="/404" /> },
      { path: 'manager/trainings/:cognitoId/:trainingId/:batchId/progress', element: role === 'manager' ? <ProgressDetails /> : <Navigate to="/404" /> },
      { path: 'manager/trainings/:cognitoId/:trainingId/:batchId/add-employees', element: role === 'manager' ? <AddEmployees /> : <Navigate to="/404" /> },


      // Traine Route 
      { path: 'trainer/trainings', element: role === 'trainer' ? <TrainersData /> : <Navigate to="/404" /> },
      { path: 'trainer/trainings/:trainingId', element: role === 'trainer' ? <TrainingDetails /> : <Navigate to="/404" /> },
      


      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
];

export default DashboardRoutes;
