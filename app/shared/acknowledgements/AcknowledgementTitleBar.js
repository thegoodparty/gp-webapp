export const AcknowledgementTitleBar = ({ emoticon, title }) => (
  <div className="bg-gray-200 p-4 font-bold rounded mb-6 flex items-center">
    {emoticon || <></>}
    <div>{title}</div>
  </div>
);
