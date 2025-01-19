'use client';
import Button from '@shared/buttons/Button';
import Body2 from '@shared/typography/Body2';
import { BsStars } from 'react-icons/bs';
import useChat from 'app/(candidate)/dashboard/campaign-assistant/components/useChat';

const prompts = [
  {
    label: 'Campaign Strategy',
    prompt: 'Can you help me with my campaign strategy?',
  },
  {
    label: 'Crafting a why statement',
    prompt:
      'Help me craft a why statement for my campaign. Ask me questions and keep a running draft going.',
  },
  {
    label: 'Voter Data',
    prompt: 'I need help with voter data.',
  },
  {
    label: 'Writing Content',
    prompt: 'I need help writing content.',
  },
];

export default function EmptyChat() {
  const { handleNewInput } = useChat();

  const handleClick = (prompt) => {
    handleNewInput(prompt.prompt);
  };
  return (
    <div className="text-center w-full h-full flex items-center justify-center">
      <div>
        <div className="flex justify-center text-indigo-500 mb-6">
          <BsStars size={48} />
        </div>
        <Body2>
          Ask me anything related to your campaign. Or click a topic below:
        </Body2>
        <div className="flex mt-4">
          {prompts.map((prompt) => (
            <Button
              key={prompt.label}
              color="neutral"
              size="small"
              className="mr-2"
              onClick={() => handleClick(prompt)}
            >
              {prompt.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
