import DashboardLayout from '../../shared/DashboardLayout';
import ChatHistory from './ChatHistory';
import Chat from './Chat';
import ChatInput from './ChatInput';
import CreateNewChat from './CreateNewChat';
import { ChatProvider } from 'app/(candidate)/dashboard/campaign-assistant/components/ChatProvider';

const CampaignAssistantPage = (props) => (
  <DashboardLayout {...props} showAlert={false}>
    <ChatProvider>
      <div className="px-4 max-w-[960px] mx-auto">
        <div className="flex flex-col md:flex-row-reverse">
          <div className="">
            <CreateNewChat />
            <ChatHistory />
          </div>
          <div className="flex flex-col w-full h-[calc(100vh-156px)] md:h-[calc(100vh-64px)] overscroll-none">
            <Chat />
            <ChatInput />
          </div>
        </div>
      </div>
    </ChatProvider>
  </DashboardLayout>
);

export default CampaignAssistantPage;
