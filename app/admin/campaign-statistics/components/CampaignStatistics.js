'use client';
import Tabs from '@shared/utils/Tabs';
import AdminCandidatesTable from 'app/admin/candidates/components/AdminCandidatesTable';
import Link from 'next/link';
import { useState } from 'react';

export default function CampaignStatistics(props) {
  const [tab, setTab] = useState(0);
  return (
    <div>
      <Link href="/admin/campaign-statistics">Clear Search</Link>
      <Tabs
        centered
        tabLabels={['Visual', 'Table']}
        tabPanels={[
          <div key="visual">Visual</div>,
          <AdminCandidatesTable {...props} key="table" />,
        ]}
        activeTab={tab}
        changeCallback={(index) => setTab(index)}
      />
    </div>
  );
}
