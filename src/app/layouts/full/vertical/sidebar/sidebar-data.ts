import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
    allowedUserTypes: ['Admin', 'Doctor', 'Patient', 'Medical'],
  },
  {
    displayName: 'Analytical',
    iconName: 'aperture',
    route: '/dashboards/dashboard1',
    // allowedUserTypes: ['Admin', 'Doctor', 'Patient', 'Medical'],
  },
  {
    displayName: 'eCommerce',
    iconName: 'shopping-cart',
    route: '/dashboards/dashboard2',
    // allowedUserTypes: ['Admin', 'Doctor', 'Patient', 'Medical'],
  },
  {
    displayName: 'Appointments',
    iconName: 'checkup-list',
    route: '/apps/appointments',
    // allowedUserTypes: ['Admin', 'Doctor', 'Patient'],
  },
  {
    displayName: 'Medical',
    iconName: 'report-medical',
    route: '/apps/medical',
    // allowedUserTypes: ['Admin'],
  },
  {
    displayName: 'Laboratory',
    iconName: 'vaccine',
    route: '/apps/laboratory',
    // allowedUserTypes: ['Admin','Doctor'],
  },
  {
    displayName: 'Lab',
    iconName: 'microscope',
    route: '/apps/lab',
    // allowedUserTypes: ['Admin','Doctor'],
  },
  {
    displayName: 'Clinic',
    iconName: 'first-aid-kit',
    route: '/apps/clinic',
    // allowedUserTypes: ['Admin','Doctor'],
  },
  {
    displayName: 'Stock',
    iconName: 'stack-3',
    route: '/apps/stock',
    // allowedUserTypes: ['Admin','Doctor'],
  },
  {
    displayName: 'Receptionist',
    iconName: 'first-aid-kit',
    route: '/apps/receptionist',
    // allowedUserTypes: ['Admin','Doctor'],
  },
  {
    displayName: 'Staff',
    iconName: 'users',
    route: '/apps/staff',
    // allowedUserTypes: ['Admin','Doctor'],
  },
  {
    displayName: 'Purchase',
    iconName: 'file-invoice',
    route: '/apps/purchase',
    // allowedUserTypes: ['Admin','Doctor'],
  },
  // {
  //   displayName: 'My Report',
  //   iconName: 'file-report',
  //   route: '/apps/report',
  // },
  {
    displayName: 'Patient',
    iconName: 'users',
    route: '/apps/patient',
    // allowedUserTypes: ['Admin','Doctor'],
  },
  {
    displayName: 'Medicine',
    iconName: 'pills',
    route: '/apps/medicine',
    // allowedUserTypes: ['Admin','Doctor','Medical'],
  },
  {
    displayName: 'Doctors',
    iconName: 'stethoscope',
    route: '/apps/doctors',
    // allowedUserTypes: ['Admin','Doctor', 'Patient'],
  },
  {
    displayName: 'Bill',
    iconName: 'receipt-2',
    route: '/apps/bill',
    // allowedUserTypes: ['Admin','Doctor', 'Patient'],
  },

];
