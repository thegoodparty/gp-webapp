import { FaCirclePlay } from 'react-icons/fa6'

interface CardData {
  key: string
  title: string
  category: string
  description: string
  cta: string
  link?: string
}

const cards: CardData[] = [
  {
    key: 'script',
    title: 'Create a script',
    category: 'Tools',
    description:
      "Use GoodParty.org's content builder to write a phone banking script. When you are done, you can attach that script to this campaign.",
    cta: 'Write Script',
  },
  {
    key: 'schedule',
    title: 'Schedule a campaign',
    category: 'Resources',
    description:
      'Connect with our Politics team to schedule a phone banking campaign. Attach your script and pay just $.04 per outbound call. Automatically leave voicemails for one and a half cents.',
    cta: 'Schedule Today',
  },
  {
    key: 'read',
    title: 'Read more on our blog',
    category: 'Learning',
    description:
      'Want to learn more about phone banking? GoodParty.org has a collection of curated content just for you.',
    cta: 'Read More',
    link: '#',
  },
]

function readMoreLink(type: string): string {
  if (type === 'sms') {
    return '/blog/tag/smsmms-messaging'
  }
  return '#'
}

interface LearnActionProps {
  type: string
  isCustom?: boolean
}

export default function LearnAction({
  type,
  isCustom,
}: LearnActionProps): React.JSX.Element | null {
  if (isCustom) {
    return null
  }
  const readLink = readMoreLink(type)
  if (cards[2]) {
    cards[2].link = readLink
  }
  return (
    <>
      <div className=" bg-neutral-background border border-slate-300 h-[420px] rounded-2xl flex justify-center items-center">
        <FaCirclePlay size={120} className="text-neutral" />
      </div>
    </>
  )
}
