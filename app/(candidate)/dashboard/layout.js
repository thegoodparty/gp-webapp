import { redirect } from 'next/navigation';
import { getServerUser } from 'helpers/userServerHelper';
const getCampaignRequest = async (userId) => {};

const DashboardLayout = ({ children }) => {
  const user = getServerUser();
  console.log(`user =>`, user);
  return <>{children}</>;
};

export default DashboardLayout;
