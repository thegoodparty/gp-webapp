import { FaChevronDown, FaLock } from 'react-icons/fa';

export default function LockedCampaignPlanSection({ section }) {
  return (
    <section className="my-3 rounded-2xl bg-white">
      <div className="flex justify-between items-center p-6 cursor-not-allowed">
        <h3 className="font-bold text-2xl flex items-center">
          <span className="inline-block mr-6">{section.title}</span>
        </h3>
        <div>
          <FaLock size={24} />
        </div>
      </div>
    </section>
  );
}
