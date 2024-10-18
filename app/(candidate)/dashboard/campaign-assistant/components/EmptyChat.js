'use client';
import Button from '@shared/buttons/Button';
import Body2 from '@shared/typography/Body2';
import { useContext } from 'react';
import { BsStars } from 'react-icons/bs';
import { ChatContext } from './CampaignAssistantPage';

const prompts = [
  {
    label: 'Campaign Strategy',
    prompt: 'Can you help me with my campaign strategy?',
  },
  {
    label: 'Campaign Messaging',
    prompt: 'Can you help me with my campaign messaging?',
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
  const { handleNewInput } = useContext(ChatContext);

  const handleClick = (prompt) => {
    handleNewInput(prompt.prompt);
  };
  return (
    <div className="text-center w-full min-h-[calc(100vh-56px-220px)] md:min-h-[calc(100vh-56px-120px)] flex items-center justify-center">
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
