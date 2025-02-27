'use client';
import { Drawer } from '@mui/material';
import Button from '@shared/buttons/Button';
import H2 from '@shared/typography/H2';
import Subtitle1 from '@shared/typography/Subtitle1';
import { useEffect, useState } from 'react';
import { MdMenu } from 'react-icons/md';
import useChat from 'app/(candidate)/dashboard/campaign-assistant/components/useChat';
import { ChatHistoryGroup } from 'app/(candidate)/dashboard/campaign-assistant/components/ChatHistoryGroup';
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper';

export default function ChatHistory() {
  const { chats } = useChat();
  const [open, setOpen] = useState(false);
  const [chatsByDate, setChatsByDate] = useState([]);
  // split chats to this week, this month and older

  useEffect(() => {
    const thisWeek = [];
    const thisMonth = [];
    const older = [];
    chats.forEach((chat) => {
      const updatedAt = new Date(chat.updatedAt);
      const now = new Date();
      const diff = now - updatedAt;
      const diffDays = diff / (1000 * 60 * 60 * 24);
      if (diffDays < 7) {
        thisWeek.push(chat);
      } else if (diffDays < 30) {
        thisMonth.push(chat);
      } else {
        older.push(chat);
      }
    });
    setChatsByDate([
      { title: 'This Week', chats: thisWeek },
      { title: 'This Month', chats: thisMonth },
      { title: 'Older', chats: older },
    ]);
  }, [chats]);

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        size="large"
        onClick={() => {
          trackEvent(EVENTS.AIAssistant.ClickViewChatHistory);
          setOpen(true);
        }}
        className="!px-3 md:!px-6"
      >
        <div className="flex items-center">
          <MdMenu size={24} />
          <div className="ml-2 hidden md:block">View Chat History</div>
        </div>
      </Button>

      <Drawer open={open} onClose={closeDrawer} anchor="right">
        <div className="bg-primary-dark min-w-[300px] h-full text-white">
          <div className="p-6 border-b border-slate-50">
            <H2>History</H2>
            <Subtitle1 className="mt-2">
              Explore all your past chats with GoodParty.org
            </Subtitle1>
          </div>
          {chatsByDate.map(({ title, chats }) => (
            <ChatHistoryGroup
              key={title}
              title={title}
              chats={chats}
              closeDrawer={closeDrawer}
            />
          ))}
        </div>
      </Drawer>
    </>
  );
}
