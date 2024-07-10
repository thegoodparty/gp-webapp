import Chip from '@shared/utils/Chip';
import { dateUsHelper } from 'helpers/dateHelper';

const date = dateUsHelper(new Date());
const defaultFileTypes = [
  {
    key: 'full',
    name: `Full Voter File - ${date}`,
    fields: [
      'Full voter file',
      'Full voter file',
      'All',
      <Chip
        key="all"
        className="bg-gray-700 text-white"
        label="ALL AVAILABLE VOTERS"
      />,
    ],
  },
  {
    key: 'doorKnocking',
    name: `Door Knocking - ${date}`,
    fields: [
      'Door Knocking',
      'Door Knocking (Default)',
      'All',
      <Chip
        key="all"
        className="bg-gray-700 text-white"
        label="ALL AVAILABLE ADDRESSES"
      />,
    ],
  },
  {
    key: 'sms',
    name: `SMS Texting - ${date}`,
    fields: [
      'SMS Texting',
      'SMS Texting (Default)',
      'All',
      <Chip
        key="all"
        className="bg-gray-700 text-white"
        label="ALL AVAILABLE PHONES"
      />,
    ],
  },
  {
    key: 'directMail',
    name: `Direct Mail - ${date}`,
    fields: [
      'Direct Mail',
      'Direct Mail (Default)',
      'All',
      <Chip
        key="all"
        className="bg-gray-700 text-white"
        label="ALL AVAILABLE ADDRESSES"
      />,
    ],
  },
  {
    key: 'telemarketing',
    name: `Telemarketing - ${date}`,
    fields: [
      'Telemarketing',
      'Telemarketing (Default)',
      'All',
      <Chip
        key="all"
        className="bg-gray-700 text-white"
        label="ALL AVAILABLE LANDLINES"
      />,
    ],
  },
];

export default defaultFileTypes;
