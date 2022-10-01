import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'new-password', element: <NewPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <AuditApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },

        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShop /> },
            { path: 'product/:name', element: <EcommerceProductDetails /> },
            { path: 'list', element: <EcommerceProductList /> },
            { path: 'product/new', element: <EcommerceProductCreate /> },
            { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
            { path: 'checkout', element: <EcommerceCheckout /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/list" replace />, index: true },
            { path: 'profile', element: <UserProfile /> },
            { path: 'cards', element: <UserCards /> },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':name/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> },

            // Role
            { element: <Navigate to="/dashboard/user/role" replace />, index: true },
            { path: 'role', element: <RoleList /> },
            { path: 'rolenew', element: <RoleCreate /> },
            { path: ':id/roleedit', element: <RoleCreate /> },

            // Employee
            { element: <Navigate to="/dashboard/user/employee" replace />, index: true },
            { path: 'employee', element: <EmployeeList /> },
            { path: 'employeenew', element: <EmployeeCreate /> },
            { path: ':id/employeeedit', element: <EmployeeCreate /> },
          ],
        },
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceList /> },
            { path: ':id', element: <InvoiceDetails /> },
            { path: ':id/edit', element: <InvoiceEdit /> },
            { path: 'new', element: <InvoiceCreate /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPosts /> },
            { path: 'post/:title', element: <BlogPost /> },
            { path: 'new', element: <BlogNewPost /> },
          ],
        },
        {
          path: 'mail',
          children: [
            { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
            { path: 'label/:customLabel', element: <Mail /> },
            { path: 'label/:customLabel/:mailId', element: <Mail /> },
            { path: ':systemLabel', element: <Mail /> },
            { path: ':systemLabel/:mailId', element: <Mail /> },
          ],
        },
        {
          path: 'chat',
          children: [
            { element: <Chat />, index: true },
            { path: 'new', element: <Chat /> },
            { path: ':conversationKey', element: <Chat /> },
          ],
        },
        { path: 'calendar', element: <Calendar /> },
        { path: 'kanban', element: <Kanban /> },
        { path: 'permission-denied', element: <PermissionDenied /> },
        {
          path: 'nist',
          children: [
            // Systems
            { element: <Navigate to="/dashboard/nist/systems" replace />, index: true },
            { path: 'systems', element: <SystemsUserList /> },
            { path: 'systemsnew', element: <SystemsCreate /> },
            { path: ':id/systemsedit', element: <SystemsCreate /> },
            // softwares
            { element: <Navigate to="/dashboard/nist/softwares" replace />, index: true },
            { path: 'softwares', element: <SoftwaresUserList /> },
            { path: 'softwarenew', element: <SoftwaresCreate /> },
            { path: ':id/softwareedit', element: <SoftwaresCreate /> },
            // controls
            { element: <Navigate to="/dashboard/nist/controls" replace />, index: true },
            { path: 'controls', element: <ControlsUserList /> },
            { path: 'controlsnew', element: <ControlsCreate /> },
            { path: ':id/controlsedit', element: <ControlsCreate /> },
            // features
            { element: <Navigate to="/dashboard/nist/features" replace />, index: true },
            { path: 'features', element: <FeaturesUserList /> },
            { path: 'featurenew', element: <FeaturesCreate /> },
            { path: ':id/featuresedit', element: <FeaturesCreate /> },
          ],
        },
        {
          path: 'hr',
          children: [
            // Status
            { element: <Navigate to="/dashboard/hr/status" replace />, index: true },
            { path: 'status', element: <HRStatusList /> },
            { path: 'statusnew', element: <HRStatusCreate /> },
            { path: ':id/statusedit', element: <HRStatusCreate /> },

            // Department
            { element: <Navigate to="/dashboard/hr/department" replace />, index: true },
            { path: 'department', element: <DepartmentList /> },
            { path: 'departmentnew', element: <DepartmentCreate /> },
            { path: ':id/departmentedit', element: <DepartmentCreate /> },

            //  TimesheetAttendance
            { element: <Navigate to="/dashboard/hr/timesheetattendance" replace />, index: true },
            { path: 'timesheetattendance', element: <HRTimesheetAttendanceList /> },
            { path: 'timesheetattendancenew', element: <HRTimesheetAttendanceCreate /> },
            { path: ':id/timesheetattendanceedit', element: <HRTimesheetAttendanceCreate /> },
            // Project
            { element: <Navigate to="/dashboard/hr/project" replace />, index: true },
            { path: 'project', element: <HRProjectList /> },
            { path: 'projectnew', element: <HRProjectCreate /> },
            { path: ':id/projectedit', element: <HRProjectCreate /> },

            // Task
            { element: <Navigate to="/dashboard/hr/task" replace />, index: true },
            { path: 'task', element: <HRTaskList /> },
            { path: 'tasknew', element: <HRTaskCreate /> },
            { path: ':id/taskedit', element: <HRTaskCreate /> },

            // Subtask
            { element: <Navigate to="/dashboard/hr/subtask" replace />, index: true },
            { path: 'subtask', element: <HRSubtaskList /> },
            { path: 'subtasknew', element: <HRSubtaskCreate /> },
            { path: ':id/subtaskedit', element: <HRSubtaskCreate /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'pricing', element: <Pricing /> },
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '/', element: <Navigate to="/auth/login" replace /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/audit/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));

// ECOMMERCE
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const EcommerceProductDetails = Loadable(
  lazy(() => import('../pages/dashboard/EcommerceProductDetails'))
);
const EcommerceProductList = Loadable(
  lazy(() => import('../pages/dashboard/EcommerceProductList'))
);
const EcommerceProductCreate = Loadable(
  lazy(() => import('../pages/dashboard/EcommerceProductCreate'))
);
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));

// INVOICE
const InvoiceList = Loadable(lazy(() => import('../pages/dashboard/InvoiceList')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/InvoiceDetails')));
const InvoiceCreate = Loadable(lazy(() => import('../pages/dashboard/InvoiceCreate')));
const InvoiceEdit = Loadable(lazy(() => import('../pages/dashboard/InvoiceEdit')));

// BLOG
const BlogPosts = Loadable(lazy(() => import('../pages/dashboard/BlogPosts')));
const BlogPost = Loadable(lazy(() => import('../pages/dashboard/BlogPost')));
const BlogNewPost = Loadable(lazy(() => import('../pages/dashboard/BlogNewPost')));

// USER
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

// Role
const RoleList = Loadable(lazy(() => import('../pages/dashboard/Admin/role/RoleList')));
const RoleCreate = Loadable(lazy(() => import('../pages/dashboard/Admin/role/RoleCreate')));

// Employee
const EmployeeList = Loadable(lazy(() => import('../pages/dashboard/Admin/employee/EmployeeList')));
const EmployeeCreate = Loadable(lazy(() => import('../pages/dashboard/Admin/employee/EmployeeCreate')));

// APP
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')));
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));
const Kanban = Loadable(lazy(() => import('../pages/dashboard/Kanban')));

// TEST RENDER PAGE BY ROLE
const PermissionDenied = Loadable(lazy(() => import('../pages/dashboard/PermissionDenied')));

// MAIN
const HomePage = Loadable(lazy(() => import('../pages/Home')));
const About = Loadable(lazy(() => import('../pages/About')));
const Contact = Loadable(lazy(() => import('../pages/Contact')));
const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));

//Audit
const AuditApp = Loadable(lazy(() => import('../pages/audit/dashboard/GeneralApp')));

const SystemsUserList = Loadable(lazy(() => import('../pages/audit/nist/systems/SystemsList')));
const SystemsCreate = Loadable(lazy(() => import('../pages/audit/nist/systems/SystemsCreate')));

const SoftwaresUserList = Loadable(
  lazy(() => import('src/pages/audit/nist/softwares/SoftwaresList'))
);
const SoftwaresCreate = Loadable(
  lazy(() => import('src/pages/audit/nist/softwares/SoftwaresCreate'))
);

const ControlsUserList = Loadable(lazy(() => import('src/pages/audit/nist/controls/ControlsList')));
const ControlsCreate = Loadable(lazy(() => import('src/pages/audit/nist/controls/ControlsCreate')));

const FeaturesUserList = Loadable(lazy(() => import('src/pages/audit/nist/features/FeaturesList')));
const FeaturesCreate = Loadable(lazy(() => import('src/pages/audit/nist/features/FeaturesCreate')));

//HR
const HRStatusList = Loadable(lazy(() => import('../pages/audit/hr/status/StatusList')));
const HRStatusCreate = Loadable(lazy(() => import('../pages/audit/hr/status/StatusCreate')));

// TimesheetAttendanceState
const HRTimesheetAttendanceList = Loadable(lazy(() => import('../pages/audit/hr/timesheetattendance/TimesheetAttendanceList')));
const HRTimesheetAttendanceCreate = Loadable(lazy(() => import('../pages/audit/hr/timesheetattendance/TimesheetAttendanceCreate')));

// Task
const DepartmentList = Loadable(lazy(() => import('../pages/audit/hr/department/DepartmentList')));
const DepartmentCreate = Loadable(lazy(() => import('../pages/audit/hr/department/DepartmentCreate')));

// Project
const HRProjectList = Loadable(lazy(() => import('../pages/audit/hr/project/ProjectList')));
const HRProjectCreate = Loadable(lazy(() => import('../pages/audit/hr/project/ProjectCreate')));

// Task
const HRTaskList = Loadable(lazy(() => import('../pages/audit/hr/task/TaskList')));
const HRTaskCreate = Loadable(lazy(() => import('../pages/audit/hr/task/TaskCreate')));

// Subtask
const HRSubtaskList = Loadable(lazy(() => import('../pages/audit/hr/subtask/SubtaskList')));
const HRSubtaskCreate = Loadable(lazy(() => import('../pages/audit/hr/subtask/SubtaskCreate')));
