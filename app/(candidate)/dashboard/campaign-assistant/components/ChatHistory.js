import { Drawer } from '@mui/material';
import Button from '@shared/buttons/Button';
import H2 from '@shared/typography/H2';
import Subtitle1 from '@shared/typography/Subtitle1';
import { useContext, useEffect, useState } from 'react';
import { MdMenu } from 'react-icons/md';
import { ChatContext } from './CampaignAssistantPage';
import ChatHistoryThread from './ChatHistoryThread';
import Overline from '@shared/typography/Overline';

export default function ChatHistory() {
  const { chats } = useContext(ChatContext);
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
        onClick={() => {
          setOpen(true);
        }}
        color="neutral"
        className="bg-white text-black w-full mt-4"
      >
        <div className="flex items-center">
          <MdMenu />
          <div className="ml-2">View Chat History</div>
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
            <>
              {chats.length > 0 && (
                <div className="p-6 mt-3">
                  <Overline className="mb-2 text-gray-400">{title}</Overline>
                  <div className="">
                    {chats.map((chat) => (
                      <ChatHistoryThread
                        key={chat.threadId}
                        chat={chat}
                        closeDrawer={closeDrawer}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </Drawer>
    </>
  );
}
