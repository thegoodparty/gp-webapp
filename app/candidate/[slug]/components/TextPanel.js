import TextEditPanel from './TextEditPanel';

export default function TextPanel(props) {
  const { text, editMode } = props;

  return (
    <>
      {editMode ? (
        <TextEditPanel {...props} />
      ) : (
        <div
          className="break-words"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
    </>
  );
}
