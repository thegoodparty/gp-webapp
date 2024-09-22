import Body2 from '@shared/typography/Body2';
import { BsStars } from 'react-icons/bs';

export default function ChatMessage({ message }) {
  const { content, role } = message;
  return (
    <div className={`flex p-4 ${role === 'user' ? 'justify-end' : ''}`}>
      {role === 'assistant' ? (
        <div className="p-4 flex">
          <BsStars size={16} />
          <Body2 className="ml-2 prose">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </Body2>
        </div>
      ) : (
        <div className=" bg-white p-4 rounded-lg">
          <Body2>{content}</Body2>
        </div>
      )}
    </div>
  );
}
