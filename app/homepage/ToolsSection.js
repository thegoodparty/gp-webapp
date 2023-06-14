import Image from 'next/image';
import Link from 'next/link';
import teamImg from '/public/images/homepage-jan23/team.png';
import volunteerImg from '/public/images/homepage-jan23/volunteer.png';

export default function ToolsSection() {
  return (
    <section className="mt-14">
      <div className="grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-12 lg:col-span-6 h-full">
          <div className="bg-zinc-100 rounded-2xl p-5 lg:py-8 lg:px-11 h-full relative">
            <div className="lg:absolute lg:top-6 lg:right-6">
              <Image src={teamImg} width={126} height={36} alt="team" />
            </div>
            <h4 className="text-lg font-black">
              <Link href="/team" className="underline">
                Meet the Team
              </Link>{' '}
              behind Good Party
            </h4>
            <div className="font-light text-lg  mt-5">
              Good Party&apos;s core team are the people working full-time,
              part-time, or as dedicated volunteers on a mission to make people
              matter more than money in our democracy.
            </div>
            <div className="text-lg mt-6 underline">
              <Link href="/work-with-us">See full-time positions</Link>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 h-full">
          <div className="bg-zinc-100 rounded-2xl pt-5 px-5 md:py-8 md:px-11 h-full relative min-h-[230px]">
            <div className="md:w-[70%]">
              <h4 className="text-lg font-black">
                Volunteer &amp; Get Involved
              </h4>
              <div className="font-light text-lg mt-5">
                If you agree that a functioning democracy that serves people,
                not money, is the problem that must be solved, please consider
                joining us!
              </div>
              <div className="text-lg mt-6 underline">
                <Link href="/contact">Contact Us</Link>
              </div>
            </div>
            <div className="text-right md:absolute md:bottom-0 md:right-6">
              <Image
                src={volunteerImg}
                width={173}
                height={211}
                alt="team"
                className="inline-block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
