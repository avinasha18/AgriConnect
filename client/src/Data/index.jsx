import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilPackage,
  UilChart,
} from '@iconscout/react-unicons';

export const SidebarData = [
  {
    icon: UilEstate,
    heading: 'Dashboard',
    to: '/dashboard',
  },
  {
    icon: UilEstate,
    heading: 'Recommendation',
    to: '/recommendation',
  },
  {
    icon: UilClipboardAlt,
    heading: 'Crop Disease',
    to: '/disease',
  },
  {
    icon: UilUsersAlt,
    heading: 'Market Price',
    to: '/price',
  },
  {
    icon: UilPackage,
    heading: 'Yield Prediction',
    to: '/yield',
  },
  {
    icon: UilChart,
    heading: 'Sale',
    to: '/sale',
  },
];
