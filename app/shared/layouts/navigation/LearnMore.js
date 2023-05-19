import { getServerCandidateCookie } from 'helpers/userServerHelper';
import LearnMoreClient from './LearnMoreClient';

export default function LearnMore() {
  const candidateCookie = getServerCandidateCookie();

  return <LearnMoreClient candidateCookie={candidateCookie} />;
}
