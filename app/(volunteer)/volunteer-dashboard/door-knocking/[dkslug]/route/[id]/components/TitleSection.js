import H5 from '@shared/typography/H5';
import { FaChevronLeft } from 'react-icons/fa';

export default function TitleSection(props) {
  const { route } = props;
  const res = route.data?.response?.routes[0];
  const { summary } = res;

  return (
    <section className="py-4 bg-white flex items-center justify-between">
      <a href="/volunteer-dashboard/door-knocking">
        <FaChevronLeft />
      </a>
      <H5>{summary || ''}</H5>
      <div>
        <FaChevronLeft className="text-white" />
      </div>
    </section>
  );
}
