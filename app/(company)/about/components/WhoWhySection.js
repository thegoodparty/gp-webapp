import PurpleButton from '@shared/buttons/PurpleButton';
import EmailForm from '@shared/inputs/EmailForm';
import Image from 'next/image';
import Link from 'next/link';
import aboutImg from 'public/images/landing-pages/about-gp.png';

export default function WhoWhySection() {
  return (
    <section className="pt-12 lg:my-20 relative border-t border-neutral-300 lg:border-0">
      <div className="lg:w-[60%]">
        <h2 className="font-black text-3xl mb-4">Who is Good Party?</h2>
        <div className="text-xl leading-relaxed mb-10">
          Good Party is a group of independent-minded citizens, technologists,
          creators and organizers on a mission to make people matter more than
          money in our democracy. We are self-funded, putting our own time and
          money to this important cause, and stay independent of any political
          parties or associations.{' '}
          <Link href="/team" className="underline">
            Meet our team here.
          </Link>
        </div>

        <h2 className="font-black text-3xl mb-4">Why Good Party?</h2>
        <div className="text-xl leading-relaxed mb-10">
          Our democracy has been{' '}
          <strong>corrupted by a two-party system</strong> that serves moneyed
          interests. It leaves people apathetic, or having to choose between the
          lesser of two evils, neither of which truly serve them. So, important
          issues continue to go unaddressed—for decades!
          <br />
          <br />
          Whether you're concerned about the climate, privacy, inequality, or
          our individual freedoms, all are{' '}
          <strong>
            hampered by the dark doom-loop of dysfunctional partisan politics.
          </strong>
          <br />
          <br />
          It's no wonder that a majority of eligible voters (over 130M
          Americans), including more than half of Millennials and Gen Z, say
          that{' '}
          <strong>neither Republicans, nor Democrats represent them</strong>.
          It's time to declare independence from the corrupt two-party system.
        </div>
      </div>
      <div className="hidden lg:block absolute top-0 lg:left-[60%] xl:left-[70%] w-[715px] min-h-[620px]">
        <Image
          src={aboutImg}
          blur
          fill
          className="object-contain object-left-top"
        />
      </div>
    </section>
  );
}
