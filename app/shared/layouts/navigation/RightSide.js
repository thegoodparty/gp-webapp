import { getServerUser } from 'helpers/userServerHelper';
import RightSideClient from './RightSideClient';

export default function RightSide() {
  const user = getServerUser();
  return <RightSideClient user={user} />;
}
