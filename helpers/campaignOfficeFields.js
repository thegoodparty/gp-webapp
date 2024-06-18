export const OFFICE_INPUT_FIELDS = [
  {
    key: 'office',
    label: 'Office',
    type: 'text',
  },

  {
    key: 'state',
    label: 'State',
    type: 'text',
  },

  {
    key: 'electionDate',
    label: 'Date of Election',
    type: 'date',
  },
  {
    key: 'primaryElectionDate',
    label: 'Date of Primary Election',
    type: 'date',
  },
  {
    key: 'officeTermLength',
    label: 'Term Length',
    type: 'text',
  },
];

export const campaignOfficeFields = (campaignDetails = {}) => {
  const fieldsAsMap = OFFICE_INPUT_FIELDS.reduce(
    (accumulator, field) => ({
      ...accumulator,
      [field.key]: campaignDetails[field.key] || '',
    }),
    {},
  );
  fieldsAsMap.office =
    campaignDetails.otherOffice || campaignDetails.office || '';
  return fieldsAsMap;
};
