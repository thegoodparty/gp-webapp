import Body2 from '@shared/typography/Body2';
import { marked } from 'marked';
import { BsStars } from 'react-icons/bs';
import Typewriter from 'typewriter-effect';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy } from 'react-icons/fa';
import { useContext, useState } from 'react';
import Subtitle2 from '@shared/typography/Subtitle2';
import { IoMdCheckmark } from 'react-icons/io';
import { MdOutlineRefresh } from 'react-icons/md';
import { ChatContext } from './CampaignManagerPage';
import ChatFeedback from './ChatFeedback';

export default function ChatMessage({
  message,
  type,
  setShouldType,
  scrollCallback,
  isLastMessage,
}) {
  const [copied, setCopied] = useState(false);
  const { handleRegenerate } = useContext(ChatContext);
  let { content, role } = message;
  try {
    if (role === 'assistant') {
      content = marked(content);
    }
  } catch (e) {
    console.log('error converting marked', e);
  }
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={`flex p-4 ${role === 'user' ? 'justify-end' : ''}`}>
      {role === 'assistant' ? (
        <div className="p-4 flex">
          <BsStars size={16} />
          <Body2 className="ml-2 prose">
            {type ? (
              <Typewriter
                options={{
                  delay: 1,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString(content)
                    .callFunction(() => {
                      setShouldType(false);
                      scrollCallback();
                    })
                    .start();
                }}
              />
            ) : (
              <>
                <div dangerouslySetInnerHTML={{ __html: content }} />
                <div className="flex items-center border-b border-black/[0.12] w-[250px] pb-4 mb-4">
                  {isLastMessage && (
                    <>
                      <ChatFeedback />
                      <MdOutlineRefresh
                        className="mr-4 cursor-pointer"
                        size={20}
                        onClick={handleRegenerate}
                      />
                    </>
                  )}
                  <>
                    {copied ? (
                      <div className="px-2 py-1 bg-primary/[0.08] flex items-center rounded-full">
                        <IoMdCheckmark size={16} className="mr-2" />
                        <Subtitle2>Copied</Subtitle2>
                      </div>
                    ) : (
                      <div className="py-1">
                        <CopyToClipboard
                          text={content.replace(/<[^>]*>/g, '')}
                          onCopy={handleCopy}
                        >
                          <FaRegCopy className="cursor-pointer" size={16} />
                        </CopyToClipboard>
                      </div>
                    )}
                  </>
                </div>
              </>
            )}
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
