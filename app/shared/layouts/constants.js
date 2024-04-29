import {
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
} from 'react-icons/fa';

export const FOOTER_COLUMNS = [
  {
    title: 'Our Org',
    links: [
      {
        label: 'Volunteer',
        link: '/volunteer',
        id: 'footer-org-volunteer',
        buttonStyle: { backgroundColor: '#642EFF' },
      },
      { label: 'About Us', link: '/about', id: 'footer-org-about-us' },
      { label: 'Our Team', link: '/team', id: 'footer-org-our-team' },
      { label: 'Careers', link: '/work-with-us', id: 'footer-org-careers' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQs', link: '/faqs', id: 'footer-support-faqs' },
      {
        label: 'Contact Us',
        link: '/contact',
        id: 'footer-support-contact-us',
      },
      {
        label: 'Interactive Demo',
        link: '/product-tour',
        id: 'footer-support-demo',
      },
    ],
  },
  {
    title: 'Campaigns',
    links: [
      {
        label: 'Run for office',
        link: '/run-for-office',
        id: 'footer-campaign-run',
        buttonStyle: {
          backgroundColor: '#E4F47D',
          color: 'black',
        },
      },
      {
        label: 'Explore offices',
        link: '/elections',
        id: 'footer-campaign-office',
      },
      {
        label: 'Good Party Academy',
        link: '/academy',
        id: 'footer-campaign-academy',
      },
      {
        label: 'Book an Info Session',
        link: '/info-session',
        id: 'footer-campaign-info',
      },
      { label: 'Book a Demo', link: '/get-a-demo', id: 'footer-campaign-demo' },
      {
        label: 'Political Definitions',
        link: '/political-terms',
        id: 'footer-campaign-glossary',
      },
      {
        label: 'Declare Independence',
        link: '/declare',
        id: 'footer-campaign-declare',
      },
      {
        label: 'Discord Community',
        link: 'https://discord.gg/invite/goodparty',
        id: 'footer-campaign-discord',
        isExternal: true,
      },
      { label: 'Pricing', link: '/pricing', id: 'footer-campaign-pricing' },
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
    link: 'https://discord.gg/invite/goodparty',
    isExternal: true,
    icon: <FaDiscord />,
  },
];
