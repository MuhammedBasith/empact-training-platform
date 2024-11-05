import {
  IconAperture, IconUser, IconReportAnalytics, IconSettings, IconCalendarClock, IconUsers, IconLogin, IconFileText, IconDashboard, IconUserCheck
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard Overview',
    icon: IconDashboard,
    href: '/dashboard',
    roles: ['admin', 'manager', 'trainer']
  },
  {
    navlabel: true,
    subheader: 'Admin Tools',
    roles: ['admin']
  },
  {
    id: uniqueId(),
    title: 'Managers',
    icon: IconUsers,
    href: '/dashboard/admin/managers',
    roles: ['admin']
  },
  {
    id: uniqueId(),
    title: 'Trainers',
    icon: IconUserCheck,
    href: '/dashboard/admin/trainers',
    roles: ['admin']
  },
  {
    id: uniqueId(),
    title: 'Reports & Analytics',
    icon: IconReportAnalytics,
    href: '/admin/reports',
    roles: ['admin']
  },
  {
    id: uniqueId(),
    title: 'Admin Settings',
    icon: IconSettings,
    href: '/admin/settings',
    roles: ['admin']
  },
  {
    navlabel: true,
    subheader: 'Manager Tools',
    roles: ['manager']
  },
  {
    id: uniqueId(),
    title: 'Team Performance',
    icon: IconUser,
    href: '/manager/team-performance',
    roles: ['manager']
  },
  {
    id: uniqueId(),
    title: 'Project Reports',
    icon: IconFileText,
    href: '/manager/project-reports',
    roles: ['manager']
  },
  {
    id: uniqueId(),
    title: 'Manager Settings',
    icon: IconSettings,
    href: '/manager/settings',
    roles: ['manager']
  },
  {
    navlabel: true,
    subheader: 'Trainer Tools',
    roles: ['trainer']
  },
  {
    id: uniqueId(),
    title: 'Training Schedule',
    icon: IconCalendarClock,
    href: '/trainer/schedule',
    roles: ['trainer']
  },
  {
    id: uniqueId(),
    title: 'Attendance Tracker',
    icon: IconFileText,
    href: '/trainer/attendance',
    roles: ['trainer']
  },
  {
    id: uniqueId(),
    title: 'Course Materials',
    icon: IconAperture,
    href: '/trainer/materials',
    roles: ['trainer']
  },
  {
    navlabel: true,
    subheader: 'Auth',
  },
  {
    id: uniqueId(),
    title: 'Logout',
    icon: IconLogin,
    href: '#',
    action: 'logout',
    roles: ['admin', 'manager', 'trainer'] // Available for all roles
  },
];

export default Menuitems;
