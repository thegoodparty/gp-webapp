'use client'
import { useState } from 'react'
import { WEBSITE_THEMES } from '../constants/websiteContent.const'
import PrivacyPolicyModal from './PrivacyPolicyModal'
import WebsiteFooter from './WebsiteFooter'
import ContactSection from './ContactSection'
import AboutSection from './AboutSection'
import HeroSection from './HeroSection'
import WebsiteHeader from './WebsiteHeader'
import { getUserFullName } from '@shared/utils/getUserFullName'

export default function WebsiteContent({ website, scale = 1 }) {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const content = website?.content || {}
  const activeTheme = WEBSITE_THEMES[content?.theme] || WEBSITE_THEMES.light

  const candidateName = getUserFullName(website.campaign?.user)

  return (
    <div
      className={`${activeTheme.bg} ${activeTheme.text}`}
      style={{
        zoom: scale,
      }}
    >
      <WebsiteHeader activeTheme={activeTheme} website={website} />
      <HeroSection activeTheme={activeTheme} content={content} />
      <AboutSection activeTheme={activeTheme} content={content} />
      <ContactSection
        activeTheme={activeTheme}
        content={content}
        vanityPath={website.vanityPath}
        onPrivacyPolicyClick={() => setShowPrivacyPolicy(true)}
      />
      <WebsiteFooter
        activeTheme={activeTheme}
        onPrivacyPolicyClick={() => setShowPrivacyPolicy(true)}
        committee={content.about?.committee || candidateName}
      />
      <PrivacyPolicyModal
        open={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        content={content}
      />
    </div>
  )
}
