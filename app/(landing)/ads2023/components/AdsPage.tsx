import CommunitySection from './CommunitySection'
import DiscordSection from './DiscordSection'
import HeroSection from './HeroSection'
import VolunteerSection from './VolunteerSection'

export default function AdsPage(): React.JSX.Element {
  return (
    <>
      <HeroSection />
      <DiscordSection />
      <VolunteerSection />
      <CommunitySection />
    </>
  )
}
