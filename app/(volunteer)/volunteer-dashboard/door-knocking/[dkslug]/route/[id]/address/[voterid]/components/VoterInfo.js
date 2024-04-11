import H2 from '@shared/typography/H2';
import { FaRegSmile } from 'react-icons/fa';
import { IoPersonSharp } from 'react-icons/io5';
import { MdOutlineFemale } from 'react-icons/md';
import TitleButtons from './TitleButtons';

const voterName = (voter) => {
  if (!voter || !voter.data) return '';
  const {
    Voters_FirstName,
    Voters_LastName,
    Voters_MiddleName,
    Voters_NameSuffix,
  } = voter.data;
  return `${Voters_FirstName} ${
    Voters_MiddleName ? ` ${Voters_MiddleName} ` : ' '
  }${Voters_LastName || ''} ${Voters_NameSuffix || ''}`.trim();
};

const voterGender = (voter) => {
  const gender = voter.data?.Voters_Gender;
  let genderFull;
  if (gender === 'M') {
    genderFull = 'MALE';
  } else if (gender === 'F') {
    genderFull = 'FEMALE';
  }
  return genderFull;
};
export default function VoterInfo(props) {
  const { voter } = props;
  const name = voterName(voter);
  const gender = voterGender(voter);
  const age = voter.data?.Voters_Age;
  const party = voter.data?.Parties_Description;
  return (
    <div className="p-4 border-y border-slate-300">
      <H2 className="mb-4">{name}</H2>
      <div className="flex items-center mb-4">
        {gender && (
          <div className="text-xs font-medium text-indigo-300 flex items-center bg-indigo-50 rounded py-1 px-2 mr-2">
            <MdOutlineFemale />
            <div className="ml-1">{gender}</div>
          </div>
        )}
        {age && age !== '' && (
          <div className="text-xs font-medium text-indigo-300 flex items-center bg-indigo-50 rounded py-1 px-2 mr-2">
            <FaRegSmile />
            <div className="ml-1">{age} YEARS</div>
          </div>
        )}
        {party && party !== '' && (
          <div className="text-xs font-medium text-indigo-300 flex items-center bg-indigo-50 rounded py-1 px-2 mr-2 uppercase">
            <IoPersonSharp />
            <div className="ml-1">{party}</div>
          </div>
        )}
      </div>
      <TitleButtons {...props} />
    </div>
  );
}
