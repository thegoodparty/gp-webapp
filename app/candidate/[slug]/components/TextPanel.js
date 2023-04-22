import TextEditPanel from './TextEditPanel';

export default function TextPanel(props) {
  const { text, editMode } = props;

  return (
    <>
      {editMode ? (
        <TextEditPanel {...props} />
      ) : (
        <div className="relative break-words">
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      )}
    </>
  );
}
