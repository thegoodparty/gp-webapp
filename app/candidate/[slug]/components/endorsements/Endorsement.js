import Body1 from '@shared/typography/Body1';
import H4 from '@shared/typography/H4';
import Image from 'next/image';
import EditEndorsement from './EditEndorsement';

export default function Endorsement(props) {
  const { endorsement, editMode } = props;
  if (!endorsement) {
    return null;
  }
  const { name, content, image } = endorsement;

  return (
    <div className="px-6 py-5 bg-indigo-700 rounded-2xl flex mt-4 text-slate-50 relative">
      <div className="w-10 h-10  mr-5 shrink-0">
        <Image
          className="w-10 h-10 rounded-full object-cover object-center shadow-md"
          width={40}
          height={40}
          src={image}
          alt={name}
        />
      </div>
      <div>
        <H4>{name}</H4>
        <Body1 className="mt-3">&quot;{content}&quot;</Body1>
      </div>
      {editMode && <EditEndorsement {...props} />}
    </div>
  );
}
