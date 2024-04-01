import H5 from '@shared/typography/H5';
import { FaChevronLeft } from 'react-icons/fa';

export default function TitleSection(props) {
  const { voter, dkSlug, routeId } = props;

  return (
    <section className="pb-3 pt-4  px-2 bg-white flex justify-between">
      <a href={`/volunteer-dashboard/door-knocking/${dkSlug}/route/${routeId}`}>
        <FaChevronLeft />
      </a>
      <H5>{voter.address}</H5>
      <div>
        <FaChevronLeft className="text-white" />
      </div>
    </section>
  );
}
