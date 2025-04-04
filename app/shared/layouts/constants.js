import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa'
import { HiUserGroup } from 'react-icons/hi'

export const FOOTER_COLUMNS = [
  {
    title: 'Our Org',
    links: [
      {
        label: 'Volunteer',
        link: '/volunteer',
        id: 'footer-org-volunteer',
        buttonStyle: 'tertiary',
      },
      { label: 'About Us', link: '/about', id: 'footer-org-about-us' },
      { label: 'Our Team', link: '/team', id: 'footer-org-our-team' },
      {
        label: 'Find Candidates',
        link: '/candidates',
        id: 'footer-org-candidates',
      },
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
        useNativeLink: true,
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
        buttonStyle: 'secondary',
      },
      {
        label: 'Explore offices',
        link: '/elections',
        id: 'footer-campaign-office',
      },
      {
        label: 'GoodParty.org Academy',
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
        label: 'GoodParty.org Community',
        link: 'https://community.goodparty.org',
        id: 'footer-campaign-community',
        isExternal: true,
      },
      {
        label: 'Pricing',
        link: '/run-for-office#pricing-section',
        id: 'footer-campaign-pricing',
      },
    ],
  },
]

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
    label: 'GoodParty.org Community',
    link: 'https://community.goodparty.org',
    isExternal: true,
    icon: <HiUserGroup />,
  },
]
