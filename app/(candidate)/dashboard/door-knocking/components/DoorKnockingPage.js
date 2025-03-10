import { serverFetch } from 'gpApi/serverFetch';
import DashboardLayout from '../../shared/DashboardLayout';
import InteractionsSummary from './InteractionsSummary';
import { apiRoutes } from 'gpApi/routes';
import InteractionsSummaryPie from './InteractionsSummaryPie';
import InteractionsByDay from './InteractionsByDay';
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
      <div className="grid grid-cols-12 gap-4 pr-4">
        <div className="col-span-12 md:col-span-7">
          <InteractionsSummary {...childProps} />
          <InteractionsByDay {...childProps} />
        </div>
        <div className="col-span-12 md:col-span-5">
          <InteractionsSummaryPie {...childProps} />
        </div>
      </div>
    </DashboardLayout>
  );
}
