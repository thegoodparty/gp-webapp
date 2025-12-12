import PrimaryButton from '@shared/buttons/PrimaryButton'
import MaxWidth from '@shared/layouts/MaxWidth'
import MarketingH2 from '@shared/typography/MarketingH2'
import Link from 'next/link'

const dates: string[] = [
  'Thursday, December 14th, 2023 @ 9am PST',
  'Friday, December 15th, 2023 @ 10am PST',
  'Wednesday, December 20th, 2023 @ 1pm PST',
  'More dates coming soon!',
]

export default function Dates(): React.JSX.Element {
  return (
    <MaxWidth>
      <div className="lg:w-1/2 mt-24 mb-12">
        <MarketingH2>Session dates</MarketingH2>
      </div>
      <div className="">
        {dates.map((d, index) => (
          <div
            key={index}
            className={`flex items-center justify-between mb-3 px-4 py-3 rounded-xl ${
              index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-50'
            }`}
          >
            <div>{d}</div>
            {index !== dates.length - 1 && (
              <div className="ml-3">
                <Link href="/academy-intro" id={`dates-cta${index + 1}`}>
                  <PrimaryButton size="medium">
                    <div className=" whitespace-nowrap">Sign up</div>
                  </PrimaryButton>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </MaxWidth>
  )
}
