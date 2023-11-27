import H3 from '@shared/typography/H3';

export default function RaceCard({ race }) {
  const { node } = race;
  if (!node) {
    return null;
  }
  const { election, position } = node;
  const { electionDay, name, originalElectionDate, state } = election || {};
  let sections = [];
  if (election) {
    sections.push({
      title: 'Election',
      fields: [
        { label: 'Name', value: name },
        { label: 'Org. Election Date', value: originalElectionDate },
        { label: 'Election Day', value: electionDay },
        { label: 'State', value: state },
      ],
    });
  }
  if (position) {
    const {
      appointed,
      description,
      eligibilityRequirements,
      employmentType,
      filingAddress,
      filingPhone,
      filingRequirements,
      geoId,
      hasMajorityVotePrimary,
      hasPrimary,
      hasRankedChoiceGeneral,
      hasRankedChoicePrimary,
      hasUnknownBoundaries,
      judicial,
      level,
      maximumFilingFee,
      minimumAge,
      mtfcc,
      mustBeRegisteredVoter,
      mustBeResident,
      mustHaveProfessionalExperience,
      name,
      paperworkInstructions,
      partisanType,
      rankedChoiceMaxVotesGeneral,
      rankedChoiceMaxVotesPrimary,
      retention,
      rowOrder,
      runningMateStyle,
      salary,
      seats,
      selectionsAllowed,
      staggeredTerm,
      state,
      subAreaName,
      subAreaValue,
      tier,
      updatedAt,
    } = position;

    sections.push({
      title: 'Position',
      fields: [
        { label: 'appointed', value: appointed },
        { label: 'description', value: description },
        { label: 'eligibilityRequirements', value: eligibilityRequirements },
        { label: 'employmentType', value: employmentType },
        { label: 'filingAddress', value: filingAddress },
        { label: 'filingPhone', value: filingPhone },
        { label: 'filingRequirements', value: filingRequirements },
        { label: 'geoId', value: geoId },
        { label: 'hasMajorityVotePrimary', value: hasMajorityVotePrimary },
        { label: 'hasPrimary', value: hasPrimary },
        { label: 'hasRankedChoiceGeneral', value: hasRankedChoiceGeneral },
        { label: 'hasRankedChoicePrimary', value: hasRankedChoicePrimary },
        { label: 'hasUnknownBoundaries', value: hasUnknownBoundaries },
        { label: 'judicial', value: judicial },
        { label: 'level', value: level },
        { label: 'maximumFilingFee', value: maximumFilingFee },
        { label: 'minimumAge', value: minimumAge },
        { label: 'mtfcc', value: mtfcc },
        { label: 'mustBeRegisteredVoter', value: mustBeRegisteredVoter },
        { label: 'mustBeResident', value: mustBeResident },
        {
          label: 'mustHaveProfessionalExperience',
          value: mustHaveProfessionalExperience,
        },
        { label: 'name', value: name },
        { label: 'paperworkInstructions', value: paperworkInstructions },
        { label: 'partisanType', value: partisanType },
        {
          label: 'rankedChoiceMaxVotesGeneral',
          value: rankedChoiceMaxVotesGeneral,
        },
        {
          label: 'rankedChoiceMaxVotesPrimary',
          value: rankedChoiceMaxVotesPrimary,
        },
        { label: 'retention', value: retention },
        { label: 'rowOrder', value: rowOrder },
        { label: 'runningMateStyle', value: runningMateStyle },
        { label: 'salary', value: salary },
        { label: 'seats', value: seats },
        { label: 'selectionsAllowed', value: selectionsAllowed },
        { label: 'staggeredTerm', value: staggeredTerm },
        { label: 'state', value: state },
        { label: 'subAreaName', value: subAreaName },
        { label: 'subAreaValue', value: subAreaValue },
        { label: 'tier', value: tier },
        { label: 'updatedAt', value: updatedAt },
      ],
    });
  }
  return (
    <div className=" rounded-xl bg-slate-50 shadow p-4 text-left">
      {sections.map((section) => (
        <div key={section.title}>
          <H3 className="mt-2">{section.title}</H3>
          <ul>
            {section.fields.map((field) => (
              <li key={`${section.title}-${field.label}`} className=" mb-2">
                <span className=" font-medium underline">{field.label}</span> -{' '}
                {field.value || 'n/a'}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
