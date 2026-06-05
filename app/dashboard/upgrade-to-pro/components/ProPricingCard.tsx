import { CheckIcon, CircleMinusIcon } from '@styleguide'
import H3 from '@shared/typography/H3'

interface ProPricingCardProps {
  title: string
  features: string[]
  price: string
  sub?: string
  primaryCard?: boolean
}

export const ProPricingCard = ({
  title,
  features,
  price,
  sub,
  primaryCard = false,
}: ProPricingCardProps): React.JSX.Element => {
  return (
    <div
      className={`flex flex-col rounded-lg border border-border p-6 ${
        primaryCard ? 'bg-blue-50' : ''
      }`}
    >
      <section className="top-section">
        <H3 className="mb-5">{title}</H3>
        <ul className="list-none text-sm m-0 p-0 mb-8">
          {features.map((feature, i) => (
            <li className="mb-3 flex gap-3" key={i}>
              {primaryCard ? <CheckIcon /> : <CircleMinusIcon />}
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>
      <footer className="text-3xl font-medium mt-auto">
        {price}
        {sub && <div className="text-xs italic font-light mt-2">{sub}</div>}
      </footer>
    </div>
  )
}
