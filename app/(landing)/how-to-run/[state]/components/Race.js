import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body1 from '@shared/typography/Body1';
import H3 from '@shared/typography/H3';
import { slugify } from 'helpers/articleHelper';
import Link from 'next/link';
import { Fragment } from 'react';

export default function Race({ race }) {
  const { position_name, position_description, election_day } = race.data || {};
  const slug = slugify(position_name, true);
  return (
    <div className="border-2 border-slate-400 bg-slate-50 p-6 rounded-2xl text-left mb-6 cursor-pointer h-full flex flex-col justify-between">
      <div className="mb-3">
        <H3 className="mt-2 mb-6">{position_name}</H3>
        <Body1 className="line-clamp-4">{position_description}</Body1>
        <Body1 className="my-2 font-semibold">{election_day}</Body1>
      </div>
      <Link href={`/how-to-run/${slug}/${race.hashId}/`}>
        <PrimaryButton fullWidth>Read More</PrimaryButton>
      </Link>
    </div>
  );
}
