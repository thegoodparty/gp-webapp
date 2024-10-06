import Body2 from '@shared/typography/Body2';
import { marked } from 'marked';
import { BsStars } from 'react-icons/bs';
import Typewriter from 'typewriter-effect';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy } from 'react-icons/fa';
import { useState } from 'react';

export default function ChatMessage({
  message,
  type,
  setShouldType,
  scrollCallback,
}) {
  const [copied, setCopied] = useState(false);
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
                <div className="flex items-center border-b border-black/[0.12] w-[250px] pb-1 mb-4">
                  <div>
                    <CopyToClipboard
                      text={content.replace(/<[^>]*>/g, '')}
                      onCopy={handleCopy}
                    >
                      <FaRegCopy className="cursor-pointer" size={16} />
                    </CopyToClipboard>
                    <div className={`mt-2 ${copied ? '' : 'opacity-0'}`}>
                      Copied!
                    </div>
                  </div>
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
