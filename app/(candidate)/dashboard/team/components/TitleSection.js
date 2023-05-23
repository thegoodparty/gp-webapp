import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import Image from 'next/image';

export default function TitleSection() {
  return (
    <div className="flex justify-between mb-3">
      <div>
        <H1>Campaign Team</H1>
        <Body1 className="mt-3">
          Good Party AI can help you create high quality content for your
          campaign
        </Body1>
      </div>
      <div>
        <Image
          src="/images/dashboard/plan.svg"
          width={132}
          height={120}
          alt="Planning"
          className="mr-16"
        />
      </div>
    </div>
  );
}
