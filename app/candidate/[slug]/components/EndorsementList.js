import H4 from '@shared/typography/H4';

export default function EndorsementList(props) {
  const { editMode } = props;
  return (
    <div>
      <H4 className="text-indigo-50">No endorsements available.</H4>
    </div>
  );
}
