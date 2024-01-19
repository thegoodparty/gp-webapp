import H2 from '@shared/typography/H2';
import { dateUsHelper } from 'helpers/dateHelper';
import { toTitleCase } from 'helpers/stringHelper';
import { FaCalendarAlt, FaCheck, FaMoneyBill } from 'react-icons/fa';
import { RiGovernmentFill } from 'react-icons/ri';

export default function RaceCard({
  race,
  modalCallback,
  selected,
  selectCallback,
}) {
  const { election, position } = race;
  if (!position) {
    return null;
  }
  const { name, salary, level } = position;

  const card = [
    {
      label: 'Election date',
      value: dateUsHelper(election?.electionDay),
      icon: <FaCalendarAlt />,
    },
    {
      label: 'Salary',
      value: salary,
      icon: <FaMoneyBill />,
    },
    {
      label: 'Level',
      value: toTitleCase(level),
      icon: <RiGovernmentFill />,
    },
  ];

  const handleReadMore = (e) => {
    e.stopPropagation();
    modalCallback(race);
  };

  // console.log('sections', sections);
  return (
    <div
      className={`border-2 ${
        selected ? 'bg-primary text-white' : 'border-slate-400 bg-slate-50'
      }  rounded-2xl text-left mb-6 cursor-pointer transition-colors hover:border-primary group`}
      onClick={() => selectCallback(race)}
    >
      <div className="p-6">
        <H2 className="mt-2 mb-6">{name}</H2>
        {card.map((item) => (
          <>
            {item.value && (
              <div key={item.label} className="flex mb-2 items-baseline">
                <div>{item.icon}</div>
                <div className="ml-3 mr-2 font-medium">{item.label}</div>
                <div className=" text-indigo-800">{item.value}</div>
              </div>
            )}
          </>
        ))}
        <div
          className="my-6 text-blue-400 underline text-sm inline-block"
          onClick={handleReadMore}
        >
          Learn more...
        </div>
      </div>
      <div
        className={`relative ${
          selected
            ? 'bg-primary text-white'
            : 'bg-slate-100 border-slate-400 text-indigo-400'
        }  py-4 px-6 rounded-b-2xl border-t  group-hover:bg-primary transition-colors group-hover:text-white`}
      >
        I want to run for this office...
        <div
          className={`h-16 w-16 ${
            selected
              ? 'bg-lime-400 text-primary'
              : 'bg-slate-50 text-slate-500 group-hover:bg-primary group-hover:text-white'
          }  border-2 border-slate-200 absolute rounded-2xl -top-8 right-6  flex items-center transition-colors justify-center text-2xl `}
        >
          <FaCheck />
        </div>
      </div>
    </div>
  );
}
