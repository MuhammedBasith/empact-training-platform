import {
  IconAperture, IconUser, IconReportAnalytics, IconSettings, IconCalendarClock, IconUsers, IconLogin, IconFileText, IconDashboard
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
  },
  {
    navlabel: true,
    subheader: 'Admin Tools',
  },
  {
    id: uniqueId(),
    title: 'User Management',
    icon: IconUsers,
    href: '/admin/users',
  },
  {
    id: uniqueId(),
    title: 'Reports & Analytics',
    icon: IconReportAnalytics,
    href: '/admin/reports',
  },
  {
    id: uniqueId(),
    title: 'Settings',
    icon: IconSettings,
    href: '/admin/settings',
  },
  {
    navlabel: true,
    subheader: 'Manager Tools',
  },
  {
    id: uniqueId(),
    title: 'Team Performance',
    icon: IconUser,
    href: '/manager/team-performance',
  },
  {
    id: uniqueId(),
    title: 'Project Reports',
    icon: IconFileText,
    href: '/manager/project-reports',
  },
  {
    id: uniqueId(),
    title: 'Settings',
    icon: IconSettings,
    href: '/manager/settings',
  },
  {
    navlabel: true,
    subheader: 'Trainer Tools',
  },
  {
    id: uniqueId(),
    title: 'Training Schedule',
    icon: IconCalendarClock,
    href: '/trainer/schedule',
  },
  {
    id: uniqueId(),
    title: 'Attendance Tracker',
    icon: IconFileText,
    href: '/trainer/attendance',
  },
  {
    id: uniqueId(),
    title: 'Course Materials',
    icon: IconAperture,
    href: '/trainer/materials',
  },
  {
    navlabel: true,
    subheader: 'Auth',
  },
  {
    id: uniqueId(),
    title: 'Logout',
    icon: IconLogin,
    href: '/logout',
  },
];

export default Menuitems;