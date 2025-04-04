import MaxWidth from '@shared/layouts/MaxWidth'
import Image from 'next/image'
import Signatures from './Signatures'
import H1 from '@shared/typography/H1'

export default function DeclarePage({ signatures, baskerville, tangerine }) {
  const content = [
    {
      key: 't1',
      content:
        'When in the course of human events it becomes necessary for people to have a GoodParty.org, we need to ditch the two-party system. We hold these truths to be self-evident, that the political duopoly sucks, and that we truly deserve real Independent choices on the ballot. That we are endowed with certain unalienable rights to political representatives who are Honest, Independent, and People-Powered.',
      type: 'normal',
    },
    {
      key: 't2',
      content:
        'The history of the two-party system is a history of bad vibes and worse choices, all having in direct object the establishment of an absolute Tyranny over these States. To prove this, let Facts be submitted to a candid world:',
      type: 'normal',
    },
    {
      key: 'm1',
      content:
        'In the last Presidential election, 74 million voted for Trump, 81 million voted for Biden, but a whopping 83 million did not vote at all.',
      type: 'highlight',
    },
    {
      key: 'm2',
      content:
        "Our elected officials spend up to 70% of their time in office fundraising for the next election. When they're not fundraising, they have no choice but to make sure the laws they pass keep their major donors happy – or they won't be able to run in the next election.",
      type: 'highlight',
    },
    {
      key: 'm3',
      content:
        'Congress has a 20% approval rating, but our districts are so gerrymandered the same unpopular politicians keep getting re-elected. The only way to fix this is to pay attention to local races and pass better redistricting laws in the states.',
      type: 'highlight',
    },
    {
      key: 'm4',
      content: 'And worst of all, politicians have made Party a dirty word.',
      type: 'highlight',
    },
    {
      key: 'b1',
      content:
        "It's no wonder that a majority of eligible voters (over 130M Americans), including more than half of Millennials and GenZ, say that neither Republicans, nor Democrats represent them. It's time to declare independence from the corrupt two-party system.",
      type: 'normal',
    },
  ]

  let modalProps = { signatures, tangerine }

  return (
    <MaxWidth>
      <div className="xl:max-w-5xl mx-auto w-full items-center">
        <div className="flex flex-col mt-12 mb-12">
          <div>
            <div className="flex flex-row ml-14 md:ml-0 justify-center mx-auto mb-6">
              <Image
                src="/images/heart.svg"
                alt="GP"
                width={56}
                height={56}
                className="mr-3"
                priority
              />
              <H1>GoodParty.org Declaration of Independence</H1>
            </div>
            <div className="flex flex-col justify-center md:items-center">
              {content.map((line) => (
                <div
                  key={line.key}
                  className={
                    line.type === 'normal'
                      ? `md:w-[55%] text-sm mt-5 ${baskerville.className}`
                      : `md:w-[45%] border-yellow-400 p-2 border-l-4 mt-5 font-italic text-sm ${baskerville.className}`
                  }
                >
                  {line.content}
                </div>
              ))}
            </div>
            <Signatures {...modalProps} />
          </div>
        </div>
      </div>
    </MaxWidth>
  )
}
