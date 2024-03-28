'use client';
import H5 from '@shared/typography/H5';
import { useRouter } from 'next/navigation';
import { FaChevronLeft } from 'react-icons/fa';

export default function TitleSection(props) {
  const { voter } = props;
  const router = useRouter();

  return (
    <section className="pb-3 pt-4  px-2 bg-white flex justify-between">
      <div onClick={() => router.back()}>
        <FaChevronLeft />
      </div>
      <H5>{voter.address}</H5>
      <div>
        <FaChevronLeft className="text-white" />
      </div>
    </section>
  );
}
