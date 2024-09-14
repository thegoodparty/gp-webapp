import Body1 from '@shared/typography/Body1';
import H4 from '@shared/typography/H4';
import Image from 'next/image';
import { IoPersonSharp } from 'react-icons/io5';

export default function WinnerSnippet({ campaign }) {
  const { firstName, lastName, office, state, avatar } = campaign;
  return (
    <div className="border border-slate-300 rounded-2xl p-6 flex">
      {avatar ? (
        <Image
          src={avatar}
          alt={`${firstName} ${lastName}`}
          width={64}
          height={64}
          className="rounded-xl"
        />
      ) : (
        <div className="w-12 h-12 bg-slate-300 rounded-xl flex items-center justify-center text-2xl text-slate-600">
          <IoPersonSharp />
        </div>
      )}
      <div className="ml-4">
        <H4>
          {firstName} {lastName}
        </H4>
        <Body1 className="text-gray-600">
          Winner of {office}, {state}
        </Body1>
      </div>
    </div>
  );
}
