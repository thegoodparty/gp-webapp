'use client';
import DashboardLayout from '../../shared/DashboardLayout';
import InteractionsSummary from './InteractionsSummary';
import { apiRoutes } from 'gpApi/routes';
import InteractionsSummaryPie from './InteractionsSummaryPie';
import InteractionsByDay from './InteractionsByDay';
import RatingSummary from './RatingSummary';
import H1 from '@shared/typography/H1';
import { dateWithTime } from 'helpers/dateHelper';
import Button from '@shared/buttons/Button';
import { syncEcanvasser } from 'app/admin/ecanvasser/components/EcanvasserCard';
import { clientFetch } from 'gpApi/clientFetch';
import { useEffect, useState } from 'react';
import Body2 from '@shared/typography/Body2';

async function fetchEcanvasserSummary() {
  const response = await clientFetch(apiRoutes.ecanvasser.mySummary);
  return response.data;
}

export default function DoorKnockingPage(props) {
  const [summary, setSummary] = useState(null);
  const [isSynching, setIsSynching] = useState(false);
  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const data = await fetchEcanvasserSummary();
    setSummary(data);
  };

  const childProps = {
    ...props,
    summary,
  };

  const handleSync = async () => {
    setIsSynching(true);
    await syncEcanvasser(props.campaign.id, true);
    fetchSummary();
    setIsSynching(false);
  };

  return (
    <DashboardLayout {...props} showAlert={false}>
      <div className="flex justify-between items-center pr-2">
        <div>
          <H1>Interactions</H1>
          <Body2 className="text-gray-500 mb-4">
            Last updated: {dateWithTime(summary?.lastSync || '')}
          </Body2>
        </div>

        <Button
          size="small"
          onClick={handleSync}
          loading={isSynching}
          disabled={isSynching}
        >
          Sync Now
        </Button>
      </div>
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
