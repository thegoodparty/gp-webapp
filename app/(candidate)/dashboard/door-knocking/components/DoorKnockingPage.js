import { serverFetch } from 'gpApi/serverFetch';
import DashboardLayout from '../../shared/DashboardLayout';
import InteractionsSummary from './InteractionsSummary';
import { apiRoutes } from 'gpApi/routes';
import InteractionsSummaryPie from './InteractionsSummaryPie';
import InteractionsByDay from './InteractionsByDay';
import RatingSummary from './RatingSummary';

async function fetchEcanvasserSummary() {
  const response = await serverFetch(apiRoutes.ecanvasser.mySummary);
  return response.data;
}

export default async function DoorKnockingPage(props) {
  const summary = await fetchEcanvasserSummary();
  const childProps = {
    ...props,
    summary,
  };

  return (
    <DashboardLayout {...props} showAlert={false}>
      <div className="grid grid-cols-12 gap-4 lg:pr-2">
        <div className="col-span-12 xl:col-span-7">
          <InteractionsSummary {...childProps} />
          <InteractionsByDay {...childProps} />
          <RatingSummary {...childProps} />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <InteractionsSummaryPie {...childProps} />
        </div>
      </div>
    </DashboardLayout>
  );
}
