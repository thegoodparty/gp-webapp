import Chip from '@shared/utils/Chip';
import { dateUsHelper } from 'helpers/dateHelper';

const date = dateUsHelper(new Date());
const defaultFileTypes = [
  {
    key: 'full',
    name: `Voter File - ${date}`,
    fields: [
      'Voter file (All Fields)',
      'Voter file (All Fields)',
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
      'Texting',
      'Texting (Default)',
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
      'Phone Banking',
      'Phone Banking (Default)',
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
