import GpHead from '@shared/layouts/GpHead';
import { partyResolver } from 'helpers/candidateHelper';
import { fetchCandidate } from './page';

export default async function Head({ params }) {
  const { slug } = params;
  if (!slug) {
    return <></>;
  }
  return <GpHead title="TBD" description="TBD" slug={`/candidate/${slug}`} />;

  // const { candidate } = await fetchCandidate(slug);

  // const shareImg = shareImageUrl(candidate);
  // const { firstName, lastName, party, otherParty, race, headline } = candidate;
  // const title = `${firstName} ${lastName} ${partyResolver(party, otherParty)} ${
  //   party !== 'I' ? 'Party ' : ''
  // }candidate for ${race}`;

  // const description = `Join the crowd-voting campaign for ${firstName} ${lastName}, ${partyResolver(
  //   party,
  //   otherParty,
  // ).toLowerCase()} for ${race} | ${
  //   headline ? ` ${headline} | ` : ' '
  // }Crowd-voting on GOOD PARTY`;
  // return (
  //   <GpHead
  //     title={title}
  //     description={description}
  //     slug={`/candidate/${slug}`}
  //     image={shareImg}
  //   />
  // );
}

const shareImageUrl = (candidate) => {
  const { firstName, lastName, id } = candidate;
  return `https://s3-us-west-2.amazonaws.com/assets.goodparty.org/share-image/${firstName
    ?.trim()
    ?.toLowerCase()
    .replace(' ', '-')}-${lastName
    ?.trim()
    ?.toLowerCase()
    .replace(' ', '-')}-${id}-share.jpeg`;
};
