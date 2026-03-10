import React from 'react'
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa'
import { HiUserGroup } from 'react-icons/hi'
import { getMarketingUrl } from 'helpers/linkhelper'

interface FooterLink {
  label: string
  link: string
  id: string
  buttonStyle?: 'tertiary' | 'secondary'
  useNativeLink?: boolean
  isExternal?: boolean
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

interface SocialLink {
  label: string
  link: string
  isExternal: boolean
  icon: React.JSX.Element
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Our Org',
    links: [
      {
        label: 'About Us',
        link: getMarketingUrl('/about'),
        id: 'footer-org-about-us',
        isExternal: true,
      },
      {
        label: 'Our Team',
        link: getMarketingUrl('/team'),
        id: 'footer-org-our-team',
        isExternal: true,
      },
      {
        label: 'Careers',
        link: getMarketingUrl('/work-with-us'),
        id: 'footer-org-careers',
        isExternal: true,
      },
    ],
  },
  {
    title: 'Support',
    links: [
      {
        label: 'FAQs',
        link: getMarketingUrl('/frequently-asked-questions'),
        id: 'footer-support-faqs',
        isExternal: true,
      },
      {
        label: 'Contact Us',
        link: getMarketingUrl('/contact'),
        id: 'footer-support-contact-us',
        isExternal: true,
      },
      {
        label: 'Interactive Demo',
        link: getMarketingUrl('/product-tour'),
        id: 'footer-support-demo',
        isExternal: true,
      },
    ],
  },
  {
    title: 'Campaigns',
    links: [
      {
        label: 'Run for office',
        link: getMarketingUrl('/run-for-office'),
        id: 'footer-campaign-run',
        buttonStyle: 'secondary',
        isExternal: true,
      },
      {
        label: 'Explore offices',
        link: getMarketingUrl('/elections'),
        id: 'footer-campaign-office',
        isExternal: true,
      },
      {
        label: 'Book a Demo',
        link: getMarketingUrl('/get-a-demo'),
        id: 'footer-campaign-demo',
        isExternal: true,
      },
      {
        label: 'Political Definitions',
        link: getMarketingUrl('/political-terms'),
        id: 'footer-campaign-glossary',
        isExternal: true,
      },
      {
        label: 'GoodParty.org Community',
        link: 'https://community.goodparty.org',
        id: 'footer-campaign-community',
        isExternal: true,
      },
      {
        label: 'Pricing',
        link: getMarketingUrl('/run-for-office#pricing-section'),
        id: 'footer-campaign-pricing',
        isExternal: true,
      },
    ],
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
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
