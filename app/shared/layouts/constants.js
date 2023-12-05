import {
  FaTiktok,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaDiscord,
} from 'react-icons/fa';

export const FOOTER_COLUMNS = [
  {
    title: 'Our Org',
    links: [
      { label: 'Volunteer', link: '/volunteer' },
      { label: 'About Us', link: '/about' },
      { label: 'Our Team', link: '/team' },
      { label: 'Careers', link: '/work-with-us' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQs', link: '/faqs' },
      {
        label: 'Contact Us',
        link: '/contact',
      },
      {
        label: 'Interactive Demo',
        link: '/product-tour',
      },
    ],
  },
  {
    title: 'Campaigns',
    links: [
      { label: 'Run for office', link: '/run-for-office' },
      { label: 'Good Party Academy', link: '/academy' },
      { label: 'Political Definitions', link: '/political-terms' },
      { label: 'Declare Independence', link: '/declare' },
      { label: 'Discord Community', link: 'https://discord.gg/goodparty' },
      { label: 'Pricing', link: '/pricing' },
    ],
  },
];

export const SOCIAL_LINKS = [
  {
    label: 'TikTok',
    link: 'https://www.tiktok.com/@goodparty',
    isExternal: true,
    icon: <FaTiktok />,
  },
  {
    label: 'Twitter',
    link: 'https://twitter.com/goodpartyorg',
    icon: <FaTwitter />,
    isExternal: true,
  },
  {
    label: 'Instagram',
    link: 'https://www.instagram.com/goodpartyorg/',
    isExternal: true,
    icon: <FaInstagram />,
  },
  {
    label: 'Facebook',
    link: 'https://www.facebook.com/goodpartyorg',
    isExternal: true,
    icon: <FaFacebook />,
  },
  {
    label: 'Discord',
    link: 'https://discord.gg/goodparty',
    isExternal: true,
    icon: <FaDiscord />,
  },
];
