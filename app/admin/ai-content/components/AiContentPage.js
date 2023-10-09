'use client';

import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { useMemo } from 'react';
import Table from '@shared/utils/Table';

export default function AiContentsPage(props) {
  const { campaigns } = props;

  const inputData = [];
  const contentCount = {};
  if (campaigns) {
    campaigns.map((campaignObj) => {
      const { data } = campaignObj;
      const { aiContent } = data;
      if (aiContent) {
        Object.keys(aiContent).forEach((key) => {
          const keyNoDigits = key.replace(/\d+$/, '');

          if (!contentCount[keyNoDigits]) {
            contentCount[keyNoDigits] = 0;
          }
          contentCount[keyNoDigits]++;
        });
      }
    });
  }
  Object.keys(contentCount).forEach((key) => {
    inputData.push({
      contentType: key,
      count: contentCount[key],
    });
  });
  const data = useMemo(() => inputData);

  const columns = useMemo(() => [
    {
      Header: 'Content Type',
      accessor: 'contentType',
    },
    {
      Header: 'Count',
      accessor: 'count',
    },
  ]);

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <Table columns={columns} data={data} />
      </PortalPanel>
    </AdminWrapper>
  );
}
