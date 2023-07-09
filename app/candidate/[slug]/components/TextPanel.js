import TextEditPanel from './TextEditPanel';

export default function TextPanel(props) {
  const { text, editMode } = props;

  if (!text && !editMode) {
    return null;
  }

  return (
    <>
      {editMode ? (
        <TextEditPanel {...props} />
      ) : (
        <div className="break-words">
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      )}
    </>
  );
}
