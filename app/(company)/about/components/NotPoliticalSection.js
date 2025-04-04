import { IncludedPartiesList } from './IncludedPartiesList';
import Button from '@shared/buttons/Button';

const LearnAboutOurTeamButton = ({ className, ...restProps }) => (
  <Button
    href="/team"
    className={'w-full md:w-auto ' + className}
    size="large"
    {...restProps}
  >
    Learn about our team
  </Button>
);

const NotPoliticalSection = () => (
  <section
    className="relative
  px-4
  mb-12
  md:px-24
  md:mb-24
  xl:px-0
  xl:mx-auto"
  >
    <div className="max-w-screen-xl mx-auto bg-secondary-light p-6 md:p-16 rounded-3xl xl:grid grid-cols-12 gap-16">
      <div className="col-span-7 relative">
        <h2 className="text-2xl md:text-6xl font-medium leading-8 mb-4 md:leading-snug">
          We’re not
          <br />a political party.
        </h2>
        <p className="font-sfpro text-gray-600 font-normal leading-6 mb-6 md:mb-16">
          GoodParty.org is not a political party. We provide the structure,
          grassroots support, and tools to make it possible to run a winning
          campaign without the baggage and habits of the two major parties.
          We’re organizing the 135 million of us without a political home to
          reject big money in politics and support candidates pledging to serve
          their community, not big money interests.
        </p>
        <LearnAboutOurTeamButton className="hidden absolute bottom-0 xl:block" />
      </div>
      <div className="col-span-5">
        <IncludedPartiesList />
        <LearnAboutOurTeamButton className="block mt-6 xl:hidden" />
      </div>
    </div>
  </section>
);

export default NotPoliticalSection;
