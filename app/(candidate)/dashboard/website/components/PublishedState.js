import WebsiteCard from './WebsiteCard'
import WebsiteInbox from './WebsiteInbox'
import WebsiteVisits from './WebsiteVisits'

export default function PublishedState() {
  return (
    <>
      <WebsiteCard className="mb-6 lg:mb-8" />
      <WebsiteVisits className="mb-6 lg:mb-8" />
      <WebsiteInbox />
    </>
  )
}
