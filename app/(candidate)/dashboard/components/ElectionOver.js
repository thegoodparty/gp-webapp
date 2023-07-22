import H2 from '@shared/typography/H2';
import Image from 'next/image';

export default function ElectionOver() {
  return (
    <section className="py-10">
      <H2 className="mb-4">
        Congratulations! You made it through your election!
      </H2>
      <Image
        src="/images/dashboard/election-over.svg"
        width={280}
        height={280}
        alt="election over"
      />
    </section>
  );
}
