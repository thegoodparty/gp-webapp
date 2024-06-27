import H2 from '@shared/typography/H2';
import { MdCheckCircle } from 'react-icons/md';

export const ProPricingCard = ({
  title,
  subTitle,
  features,
  price,
  backgroundClass,
}) => {
  return (
    <div
      className={`
        flex 
        flex-col 
        justify-between 
        min-h-[368px] 
        p-8
        mb-4
        rounded-lg 
        bg-${backgroundClass} 
        text-${backgroundClass}-contrast
        md:mb-0
      `}
    >
      <section className="top-section">
        <header
          className={`border-b border-${
            backgroundClass === 'primary' ? 'neutral' : 'black'
          } mb-6`}
        >
          <H2 className="mb-3">{title}</H2>
        </header>
        {subTitle && <div className="text-xs font-light mb-2">{subTitle}</div>}
        <ul className="list-none text-xs font-light m-0 p-0">
          {features.map((feature, i) => (
            <li className="flex items-center mb-3" key={i}>
              <MdCheckCircle
                className={`mr-3 ${
                  backgroundClass === 'primary' ? 'text-lime-400' : ''
                }`}
              />
              {feature}
            </li>
          ))}
        </ul>
      </section>
      <footer className="text-3xl">${price}/month</footer>
    </div>
  );
};
