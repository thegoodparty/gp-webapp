'use client';
import H3 from '@shared/typography/H3';
import UserAvatar from '@shared/user/UserAvatar';
import Table from '@shared/utils/Table';
import { dateUsHelper } from 'helpers/dateHelper';
import { useMemo } from 'react';
import { FaBullhorn } from 'react-icons/fa';
import { RiDoorOpenLine, RiPhoneLine } from 'react-icons/ri';

const fields = {
  doorKnocking: { icon: <RiDoorOpenLine />, title: 'Doors knocked' },
  calls: { icon: <RiPhoneLine />, title: 'Calls made' },
  digital: { icon: <FaBullhorn />, title: 'Online impressions' },
};

export default function UpdateHistorySection(props) {
  const updateHistory = props.updateHistory;
  const inputData = [];
  if (updateHistory) {
    updateHistory.map((update) => {
      if (update.type && update.type !== '') {
        const fields = {
          name: update.user?.name,
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

  const data = useMemo(() => inputData);

  const columns = useMemo(() => [
    {
      Header: 'Name',
      accessor: 'type',
      collapse: true,
      Cell: ({ row }) => {
        return (
          <div className="flex items-center pl-2">
            {fields[row.original.type].icon} &nbsp;{' '}
            {fields[row.original.type].title}
          </div>
        );
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
  ]);
  return (
    <section className="mt-12 mb-6">
      <H3>Update history</H3>

      <Table
        columns={columns}
        data={data}
        filterColumns={false}
        pagination={false}
      />
    </section>
  );
}
