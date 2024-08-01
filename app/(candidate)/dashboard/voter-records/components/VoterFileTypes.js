import Chip from '@shared/utils/Chip';
import { dateUsHelper } from 'helpers/dateHelper';

const date = dateUsHelper(new Date());
const defaultFileTypes = [
  {
    key: 'full',
    name: `Voter File - ${date}`,
    fields: [
      'Voter file (All Fields)',
      'Voter file',
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
      'Door Knocking (Default)',
      'Door Knocking',
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
      'Texting (Default)',
      'Texting',
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
      'Direct Mail (Default)',
      'Direct Mail',
      'All',
      <Chip
        key="all"
        className="bg-gray-700 text-white"
        label="ALL AVAILABLE ADDRESSES"
      />,
    ],
  },
  {
    key: 'digitalAds',
    name: `Digital Advertising - ${date}`,
    fields: [
      'Digital Advertising (Default)',
      'Facebook',
      'All',
      <Chip
        key="all"
        className="bg-gray-700 text-white"
        label="ALL AVAILABLE SOCIAL"
      />,
    ],
  },
  {
    key: 'telemarketing',
    name: `Telemarketing - ${date}`,
    fields: [
      'Phone Banking (Default)',
      'Phone Banking',
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
