'use client';
import H3 from '@shared/typography/H3';
import UserAvatar from '@shared/user/UserAvatar';
import Table from '@shared/utils/Table';
import { dateUsHelper } from 'helpers/dateHelper';
import { memo, useState } from 'react';
import Actions from './Actions';
import Paper from '@shared/utils/Paper';

const fields = {
  doorKnocking: { title: 'Doors knocked' },
  calls: { title: 'Calls made' },
  digital: { title: 'Digital Ads' },
  directMail: { title: 'Direct mail sent' },
  digitalAds: { title: 'Digital ads' },
  text: { title: 'Texts sent' },
  events: { title: 'Events Attendance' },
  yardSigns: { title: 'Yard signs' },
};

const UpdateHistorySection = memo(function UpdateHistorySection(props) {
  const [showMenu, setShowMenu] = useState(0);

  const { deleteHistoryCallBack, updateHistory } = props;

  const inputData = [];
  if (updateHistory) {
    updateHistory.map((update) => {
      if (update.type && update.type !== '') {
        const fields = {
          id: update.id,
          name: update.user?.firstName
            ? `${update.user.firstName} ${update.user.lastName}`
            : '',
          user: update.user,
          type: update.type,
          quantity: update.quantity,
          createdAt: new Date(update.createdAt),
          updatedAt: new Date(update.updatedAt),
        };
        inputData.push(fields);
      }
    });
  }

  const columns = [
    {
      Header: 'Actions',
      Cell: ({ row }) => {
        return (
          <Actions
            {...row.original}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            deleteHistoryCallBack={deleteHistoryCallBack}
          />
        );
      },
    },
    {
      Header: 'Name',
      accessor: 'type',
      collapse: true,
      Cell: ({ row }) => {
        return <div className="">{fields[row.original.type]?.title}</div>;
      },
    },
    {
      Header: 'Qty',
      accessor: 'quantity',
      collapse: true,
    },
    {
      Header: 'User',
      accessor: 'user',
      collapse: true,
      Cell: ({ row }) => {
        return (
          <div className="flex items-center pl-2">
            <UserAvatar user={row.original.user} size="small" /> &nbsp;{' '}
            {row.original.name}
          </div>
        );
      },
    },
    {
      Header: 'Added',
      accessor: 'createdAt',
      collapse: true,
      sortType: 'datetime',
      Cell: ({ row }) => {
        return dateUsHelper(row.original.createdAt);
      },
    },
  ];
  return (
    <Paper className="mt-12">
      <div className="min-w-[600px] max-w-[90vw] overflow-x-auto">
        <H3>Update history</H3>

        <Table
          columns={columns}
          data={inputData}
          filterColumns={false}
          pagination={false}
        />
      </div>
    </Paper>
  );
});

export default UpdateHistorySection;
