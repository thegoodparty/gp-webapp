import H2 from '@shared/typography/H2';
import { dateUsHelper } from 'helpers/dateHelper';
import { FaCalendarAlt, FaCheck, FaMoneyBill } from 'react-icons/fa';

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
  const { id, name, salary, staggeredTerm } = position;
  // const { electionDay, name, originalElectionDate, state } = election || {};
  // let sections = [];
  // if (election) {
  //   sections.push({
  //     title: 'Election',
  //     fields: [
  //       { label: 'Name', value: name },
  //       { label: 'Org. Election Date', value: originalElectionDate },
  //       { label: 'Election Day', value: electionDay },
  //       { label: 'State', value: state },
  //     ],
  //   });
  // }
  // if (position) {
  //   const {
  //     appointed,
  //     description,
  //     eligibilityRequirements,
  //     employmentType,
  //     filingAddress,
  //     filingPhone,
  //     filingRequirements,
  //     geoId,
  //     hasMajorityVotePrimary,
  //     hasPrimary,
  //     hasRankedChoiceGeneral,
  //     hasRankedChoicePrimary,
  //     hasUnknownBoundaries,
  //     judicial,
  //     level,
  //     maximumFilingFee,
  //     minimumAge,
  //     mtfcc,
  //     mustBeRegisteredVoter,
  //     mustBeResident,
  //     mustHaveProfessionalExperience,
  //     name,
  //     paperworkInstructions,
  //     partisanType,
  //     rankedChoiceMaxVotesGeneral,
  //     rankedChoiceMaxVotesPrimary,
  //     retention,
  //     rowOrder,
  //     runningMateStyle,
  //     salary,
  //     seats,
  //     selectionsAllowed,
  //     staggeredTerm,
  //     state,
  //     subAreaName,
  //     subAreaValue,
  //     tier,
  //     updatedAt,
  //   } = position;

  //   sections.push({
  //     title: 'Position',
  //     fields: [
  //       { label: 'appointed', value: appointed },
  //       { label: 'description', value: description },
  //       { label: 'eligibilityRequirements', value: eligibilityRequirements },
  //       { label: 'employmentType', value: employmentType },
  //       { label: 'filingAddress', value: filingAddress },
  //       { label: 'filingPhone', value: filingPhone },
  //       { label: 'filingRequirements', value: filingRequirements },
  //       { label: 'geoId', value: geoId },
  //       { label: 'hasMajorityVotePrimary', value: hasMajorityVotePrimary },
  //       { label: 'hasPrimary', value: hasPrimary },
  //       { label: 'hasRankedChoiceGeneral', value: hasRankedChoiceGeneral },
  //       { label: 'hasRankedChoicePrimary', value: hasRankedChoicePrimary },
  //       { label: 'hasUnknownBoundaries', value: hasUnknownBoundaries },
  //       { label: 'judicial', value: judicial },
  //       { label: 'level', value: level },
  //       { label: 'maximumFilingFee', value: maximumFilingFee },
  //       { label: 'minimumAge', value: minimumAge },
  //       { label: 'mtfcc', value: mtfcc },
  //       { label: 'mustBeRegisteredVoter', value: mustBeRegisteredVoter },
  //       { label: 'mustBeResident', value: mustBeResident },
  //       {
  //         label: 'mustHaveProfessionalExperience',
  //         value: mustHaveProfessionalExperience,
  //       },
  //       { label: 'name', value: name },
  //       { label: 'paperworkInstructions', value: paperworkInstructions },
  //       { label: 'partisanType', value: partisanType },
  //       {
  //         label: 'rankedChoiceMaxVotesGeneral',
  //         value: rankedChoiceMaxVotesGeneral,
  //       },
  //       {
  //         label: 'rankedChoiceMaxVotesPrimary',
  //         value: rankedChoiceMaxVotesPrimary,
  //       },
  //       { label: 'retention', value: retention },
  //       { label: 'rowOrder', value: rowOrder },
  //       { label: 'runningMateStyle', value: runningMateStyle },
  //       { label: 'salary', value: salary },
  //       { label: 'seats', value: seats },
  //       { label: 'selectionsAllowed', value: selectionsAllowed },
  //       { label: 'staggeredTerm', value: staggeredTerm },
  //       { label: 'state', value: state },
  //       { label: 'subAreaName', value: subAreaName },
  //       { label: 'subAreaValue', value: subAreaValue },
  //       { label: 'tier', value: tier },
  //       { label: 'updatedAt', value: updatedAt },
  //     ],
  //   });
  // }
  const card = [
    {
      label: 'Election date',
      value: dateUsHelper(election?.originalElectionDate),
      icon: <FaCalendarAlt />,
    },
    {
      label: 'Salary',
      value: salary,
      icon: <FaMoneyBill />,
    },
    {
      label: 'Term',
      value: staggeredTerm,
      icon: <FaMoneyBill />,
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
