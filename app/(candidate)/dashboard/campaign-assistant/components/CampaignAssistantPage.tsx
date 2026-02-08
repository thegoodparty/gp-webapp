import DashboardLayout from '../../shared/DashboardLayout'
import ChatHistory from './ChatHistory'
import Chat from './Chat'
import ChatInput from './ChatInput'
import CreateNewChat from './CreateNewChat'
import { ChatProvider } from 'app/(candidate)/dashboard/campaign-assistant/components/ChatProvider'
import H2 from '@shared/typography/H2'
import Paper from '@shared/utils/Paper'
import { Campaign } from 'helpers/types'

interface CampaignAssistantPageProps {
  pathname?: string
  campaign: Campaign
}

const CampaignAssistantPage = (props: CampaignAssistantPageProps): React.JSX.Element => (
  <DashboardLayout {...props} wrapperClassName="w-full" showAlert={false}>
    <ChatProvider>
      <Paper className="h-[calc(100vh-72px)] flex flex-col">
        <header className="flex items-center gap-4 mb-6">
          <H2 className="grow">AI Assistant</H2>
          <ChatHistory />
          <CreateNewChat />
        </header>

        <div className="grow overflow-hidden rounded-md bg-indigo-100 border border-black/[0.12] flex flex-col relative">
          <Chat />
          <ChatInput />
        </div>
      </Paper>
    </ChatProvider>
  </DashboardLayout>
)

export default CampaignAssistantPage
