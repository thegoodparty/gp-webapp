import WebsiteCard from './WebsiteCard'
import WebsiteInbox from './WebsiteInbox'
import { useWebsite } from './WebsiteProvider'

export default function PublishedState() {
  const { website } = useWebsite()

  return (
    <>
      <WebsiteCard className="mb-6 lg:mb-8" website={website} />
      <WebsiteInbox />
    </>
  )
}
