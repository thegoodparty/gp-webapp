import { Drawer } from '@mui/material';
import Button from '@shared/buttons/Button';
import H2 from '@shared/typography/H2';
import Subtitle1 from '@shared/typography/Subtitle1';
import { useContext, useState } from 'react';
import { MdMenu } from 'react-icons/md';
import { ChatContext } from './CampaignManagerPage';
import { dateUsHelper } from 'helpers/dateHelper';
import ChatHistoryThread from './ChatHistoryThread';

export default function ChatHistory() {
  const { chats } = useContext(ChatContext);
  const [open, setOpen] = useState(false);
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

      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        anchor="right"
      >
        <div className="bg-primary-dark min-w-[300px] h-full text-white">
          <div className="p-6 border-b border-slate-50">
            <H2>History</H2>
            <Subtitle1 className="mt-2">
              Explore all your past chats with GoodParty.org
            </Subtitle1>
          </div>
          <div className="p-6">
            {(chats || []).map((chat) => (
              <ChatHistoryThread key={chat.threadId} chat={chat} />
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}
