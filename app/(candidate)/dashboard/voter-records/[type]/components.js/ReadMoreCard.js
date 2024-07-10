import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import Overline from '@shared/typography/Overline';
import Paper from '@shared/utils/Paper';
import Link from 'next/link';
import { IoArrowForward } from 'react-icons/io5';

export default function ReadMoreCard({ type }) {
  let link = '#';
  if (type === 'sms') {
    link = '/blog/tag/smsmms-messaging';
  }
  if (type === 'telemarketing') {
    link = '/blog/tag/phone-banking';
  }
  if (type === 'directmail') {
    link = '/blog/tag/direct-mail';
  }
  if (type === 'doorknocking') {
    link = '/blog/tag/door-to-door-canvassing';
  }

  return (
    <Paper className="h-full flex flex-col justify-between">
      <div>
        <H3>Read more on our blog</H3>
        <Overline className="text-gray-600 mb-4">Learning</Overline>
        <Body2>
          Want to learn more about phone banking? GoodParty.org has a collection
          of curated content just for you.
        </Body2>
      </div>
      <Link href={link}>
        <div className="mt-4 flex items-center justify-end">
          <div className="mr-2">Read More</div>
          <IoArrowForward />
        </div>
      </Link>
    </Paper>
  );
}
