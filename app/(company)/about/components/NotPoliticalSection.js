import Image from 'next/image';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Link from 'next/link';

const PartyLogo = ({ logoFileName, name }) => <Image
  className="inline-block mr-4 max-h-[48px] object-contain"
  height={48}
  width={48}
  alt={name}
  src={logoFileName}
/>

const LearnAboutOurTeamButton = props => <Link href="/team" {...props}>
  <PrimaryButton className="w-full md:w-auto">Learn about our
    team</PrimaryButton>
</Link>

const PARTIES = [
  { name: 'Forward Party', logoFileName: 'fwd-logo.png' },
  { name: 'Alliance Party', logoFileName: 'alliance-logo.png' },
  { name: 'Libertarian Party', logoFileName: 'libertarian-torch-logo.png' },
  { name: 'Green Party', logoFileName: 'green-logo.png' },
  { name: 'Reform Party', logoFileName: 'reform-logo.png' },
  { name: 'Working Families Party', logoFileName: 'wfp-logo.png' },
]

const IncludedPartiesList = () => <div className="bg-white
  p-6
  rounded-2xl">
  <h2 className="text-xl leading-7">Included in our movement</h2>
  <hr className="border-2 border-tertiary-main w-12 mt-2 mb-8" />
  {
    PARTIES.map(
      ({
        name,
        logoFileName
      }) => <div
        key={name}
        className="mb-4 flex items-center">
        <PartyLogo
          name={name}
          logoFileName={`/images/parties-logos/${logoFileName}`} />
        <span
          className="text-sm md:text-base font-sfpro font-medium">{name}</span>
      </div>
    )
  }
</div>

const NotPoliticalSection = () => <section className="relative
  px-4
  mb-12
  md:px-24
  md:mb-24
  xl:px-0
  xl:mx-auto">
  <div
    className="max-w-screen-xl mx-auto bg-secondary-light p-6 md:p-16 rounded-3xl xl:grid grid-cols-12 gap-16">
    <div className="col-span-7 relative">
      <h2
        className="text-2xl md:text-6xl font-medium leading-8 mb-4 md:leading-snug">We’re
        not<br/>a political party.</h2>
      <p
        className="font-sfpro text-gray-600 font-normal leading-6 mb-6 md:mb-16">Good
        Party is not a political party. We provide the structure, grassroots
        support, and tools to make it possible to run a winning campaign without
        the baggage and habits of the two major parties. We’re organizing the 135
        million of us without a political home to reject big money in politics and
        support candidates pledging to serve their community, not big money
        interests.</p>
      <LearnAboutOurTeamButton className="hidden absolute bottom-0 xl:block" />
    </div>
    <div className="col-span-5">
      <IncludedPartiesList />
      <LearnAboutOurTeamButton className="block mt-6 xl:hidden" />
    </div>
  </div>
</section>

export default NotPoliticalSection;
