import H4 from '@shared/typography/H4';
import EditEndorsements from '../EditEndorsements';
import EndorsementList from '../EndorsementList';

export default function EndorsementsTab(props) {
  const { editMode } = props;
  return (
    <div>
      {editMode ? (
        <EditEndorsements {...props} />
      ) : (
        <EndorsementList {...props} />
      )}
    </div>
  );
}
