import { dateUsHelper } from 'helpers/dateHelper'

const date = dateUsHelper(new Date())
const defaultFileTypes = [
  {
    key: 'full',
    name: `Voter File - ${date}`,
    fields: [
      'Voter file (All Fields)',
      'Voter file',
      'All',
      'All Available Voters',
    ],
  },
  {
    key: 'doorKnocking',
    name: `Door Knocking - ${date}`,
    fields: [
      'Door Knocking (Default)',
      'Door Knocking',
      'All',
      'All Available Addresses',
    ],
  },
  {
    key: 'sms',
    name: `SMS Texting - ${date}`,
    fields: ['Texting (Default)', 'Texting', 'All', 'All Available Phones'],
  },
  {
    key: 'directMail',
    name: `Direct Mail - ${date}`,
    fields: [
      'Direct Mail (Default)',
      'Direct Mail',
      'All',
      'All Available Addresses',
    ],
  },
  {
    key: 'digitalAds',
    name: `Digital Advertising - ${date}`,
    fields: [
      'Digital Advertising (Default)',
      'Facebook',
      'All',
      'All Available Social',
    ],
  },
  {
    key: 'telemarketing',
    name: `Phone Banking - ${date}`,
    fields: [
      'Phone Banking (Default)',
      'Phone Banking',
      'All',
      'All Available Landlines',
    ],
  },
]

export const getDefaultVoterFileName = (type) =>
  defaultFileTypes.find((file) => file.key.toLowerCase() === type.toLowerCase())
    ?.fields?.[0]

export default defaultFileTypes
