import EditSocialSection from './EditSocialSection';
import SocialSection from './SocialSection';

export default function SocialSectionWithEdit(props) {
  const { editMode } = props;

  return (
    <>
      {editMode ? (
        <EditSocialSection {...props} />
      ) : (
        <SocialSection {...props} />
      )}
    </>
  );
}
