'use client';
import H5 from '@shared/typography/H5';
import { useRouter } from 'next/navigation';
import { FaCaretLeft, FaChevronLeft } from 'react-icons/fa';

export default function TitleSection(props) {
  const { route } = props;
  const res = route.data?.response?.routes[0];
  const { summary } = res;

  const router = useRouter();

  return (
    <section className="py-4 bg-white flex justify-between">
      <div onClick={() => router.back()}>
        <FaChevronLeft />
      </div>
      <H5>{summary || ''}</H5>
      <div>
        <FaChevronLeft className="text-white" />
      </div>
    </section>
  );
}
