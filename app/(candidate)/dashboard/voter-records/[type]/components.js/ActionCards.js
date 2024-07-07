import ReadMoreCard from './ReadMoreCard';
import ScheduleCard from './ScheduleCard';
import ScriptCard from './ScriptCard';

export default function ActionCards(props) {
  const { type } = props;
  if (type.startsWith('custom-')) return null;

  return (
    <div className="mt-4 grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-4 h-full">
        <ScriptCard {...props} />
      </div>
      <div className="col-span-12 md:col-span-4 h-full">
        <ScheduleCard {...props} />
      </div>
      <div className="col-span-12 md:col-span-4 h-full">
        <ReadMoreCard {...props} />
      </div>
    </div>
  );
}
