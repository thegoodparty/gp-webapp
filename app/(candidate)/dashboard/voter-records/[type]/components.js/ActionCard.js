import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import H3 from '@shared/typography/H3';
import Overline from '@shared/typography/Overline';
import Paper from '@shared/utils/Paper';
import Link from 'next/link';
import { IoArrowForward } from 'react-icons/io5';

function LinkWrapper({ children, card }) {
  if (card.link) {
    return <Link href={card.link}>{children}</Link>;
  }
  return <>{children}</>;
}

export default function ActionCard({ card, type }) {
  return (
    <Paper className="h-full flex flex-col justify-between">
      <div>
        <H3>{card.title}</H3>
        <Overline className="text-gray-600 mb-4">{card.category}</Overline>
        <Body2>{card.description}</Body2>
      </div>
      <LinkWrapper card={card}>
        <div className="mt-4 flex items-center justify-end">
          <div className="mr-2">{card.cta}</div>
          <IoArrowForward />
        </div>
      </LinkWrapper>
    </Paper>
  );
}
