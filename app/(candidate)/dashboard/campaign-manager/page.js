import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import CampaignManagerPage from './components/CampaignManagerPage';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';

export async function fetchChatHistory() {
  try {
    const api = gpApi.campaign.chat.list;
    const token = getServerToken();
    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function createInitialChat() {
  try {
    const api = gpApi.campaign.chat.create;
    const token = getServerToken();
    const payload = { message: ' ' };
    return await gpFetch(api, payload, false, token);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function getChatThread({ threadId }) {
  try {
    const api = gpApi.campaign.chat.get;
    const token = getServerToken();
    const payload = { threadId };
    return await gpFetch(api, payload, false, token);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

const meta = pageMetaData({
  title: 'Campaign Manager | GoodParty.org',
  description: 'Campaign Manager',
  slug: '/dashboard/campaign-manager',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  // await candidateAccess();
  adminAccessOnly();

  const user = getServerUser(); // can be removed when door knocking app is not for admins only
  const { campaign } = await fetchUserCampaign();
  const { chats } = await fetchChatHistory();
  let currentChat;
  let threadId;
  if (!chats || chats.length === 0) {
    const res = await createInitialChat();
    threadId = res.threadId;
    currentChat = res.chat;
  } else {
    //get the last chat
    threadId = chats[0].threadId;
    currentChat = await getChatThread({ threadId });
  }
  const childProps = {
    pathname: '/dashboard/campaign-manager',
    user,
    campaign,
    chats,
    chat: currentChat?.chat,
    threadId,
  };

  return <CampaignManagerPage {...childProps} />;
}