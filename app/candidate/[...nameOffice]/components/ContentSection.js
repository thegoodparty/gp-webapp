import P2vCard from './P2vCard';
import TargetCard from './TargetCard';

export default function ContentSection(props) {
  return (
    <div className="grid grid-cols-12  gap-4">
      <div className=" col-span-12 md:col-span-6">
        <P2vCard {...props} />
      </div>
      <div className=" col-span-12 md:col-span-6">
        <TargetCard {...props} />
      </div>
    </div>
  );
}
