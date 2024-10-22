'use client';
import DashboardLayout from '../../shared/DashboardLayout';
import ChatHistory from './ChatHistory';
import Chat from './Chat';
import ChatInput from './ChatInput';
import CreateNewChat from './CreateNewChat';
import { ChatProvider } from 'app/(candidate)/dashboard/campaign-assistant/components/ChatProvider';

const CampaignAssistantPage = (props) => (
  <DashboardLayout {...props} showAlert={false}>
    <ChatProvider>
      <div className="p-4 max-w-[960px] mx-auto h-full pb-16 overflow-auto">
        <div className="md:flex md:flex-row-reverse">
          <div className="md:w-[170px] md:flex md:flex-col md:items-end">
            <CreateNewChat />
            <ChatHistory />
          </div>
          <div className=" md:flex-1 md:pr-6">
            <Chat />
          </div>
        </div>
        <ChatInput />
      </div>
    </ChatProvider>
  </DashboardLayout>
);

export default CampaignAssistantPage;
