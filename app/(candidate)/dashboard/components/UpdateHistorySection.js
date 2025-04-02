'use client';
import UserAvatar from '@shared/user/UserAvatar';
import { dateUsHelper } from 'helpers/dateHelper';
import { Fragment, memo, useState } from 'react';
import Actions from './Actions';
import Paper from '@shared/utils/Paper';
import H2 from '@shared/typography/H2';
import Body2 from '@shared/typography/Body2';
import Overline from '@shared/typography/Overline';
import H5 from '@shared/typography/H5';
import { numberFormatter } from 'helpers/numberHelper';
import H3 from '@shared/typography/H3';
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper';
import { useVoterContacts } from '@shared/hooks/useVoterContacts';

const fields = {
  doorKnocking: { title: 'Doors knocked' },
  text: { title: 'Texts sent' },
  calls: { title: 'Calls made' },
  yardSigns: { title: 'Yard signs' },
  digital: { title: 'Digital Ads' },
  directMail: { title: 'Direct mail sent' },
  digitalAds: { title: 'Digital ads' },
  events: { title: 'Events Attendance' },
};

const UpdateHistorySection = memo(function UpdateHistorySection({
  deleteHistoryCallBack,
  updateHistory,
}) {
  const [_, setReportedVoterGoals] = useVoterContacts();
  const [showMenu, setShowMenu] = useState(0);

  const historyItems = !updateHistory
    ? []
    : updateHistory.map((update) => {
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
          return fields;
        }
      });

  function handleShowMenu(id) {
    trackEvent(EVENTS.Dashboard.ActionHistory.ClickMenu, { id });
    setShowMenu(id);
  }

  function handleDelete(id) {
    trackEvent(EVENTS.Dashboard.ActionHistory.ClickDelete, { id });
    const { type, quantity } = historyItems.find((item) => item.id === id);
    setReportedVoterGoals((prev) => ({
      ...prev,
      [type]: Math.max((prev[type] || 0) - quantity, 0),
    }));
    deleteHistoryCallBack();
  }

  return (
    <Paper className="mt-12">
      <div className="">
        <H2>Campaign Action History</H2>
        <Body2 className="mb-4 text-gray-600">
          View all recorded progress entries for your campaign below.
        </Body2>
        {historyItems.length === 0 ? (
          <Paper>
            <div className="flex flex-col justify-center items-center py-4">
              <div className="text-4xl">
                <span role="img" aria-label="Frowning Face">
                  ☹️
                </span>
              </div>
              <H3 className="mt-4">
                You do not have any campaign history yet.
              </H3>
            </div>
          </Paper>
        ) : (
          <>
            <div className="grid grid-cols-12  bg-black text-white rounded-t-lg">
              <div className="col-span-8 md:col-span-4 lg:col-span-3">
                <Overline className="p-4 pl-10">Method</Overline>
              </div>

              <div className="hidden lg:block lg:col-span-3">
                <Overline className=" p-4">User</Overline>
              </div>

              <div className="col-span-4 md:col-span-4 lg:col-span-3">
                <Overline className=" p-4"># Records</Overline>
              </div>

              <div className="hidden md:block md:col-span-4 lg:col-span-3">
                <Overline className=" p-4">Date Added</Overline>
              </div>
            </div>
            <div className="grid grid-cols-12 rounded-b-lg">
              {historyItems.map((data, index) => (
                <Fragment key={data.id}>
                  <div
                    className={`col-span-8 md:col-span-4 lg:col-span-3 flex items-center p-2 border-b border-gray-200 ${
                      index % 2 === 0 ? '' : 'bg-gray-50'
                    } border-l`}
                  >
                    <Actions
                      {...data}
                      actionName={`${numberFormatter(data.quantity)} ${
                        fields[data.type]?.title
                      }`}
                      showMenu={showMenu}
                      setShowMenu={handleShowMenu}
                      deleteHistoryCallBack={handleDelete}
                    />
                    <H5 className="ml-3">{fields[data.type]?.title}</H5>
                  </div>

                  <div
                    className={`hidden lg:flex lg:col-span-3 p-2 border-b  items-center  border-gray-200 ${
                      index % 2 === 0 ? '' : 'bg-gray-50'
                    }`}
                  >
                    <UserAvatar user={data.user} size="small" /> &nbsp;{' '}
                    {data.name}
                  </div>

                  <div
                    className={`col-span-4 md:col-span-4 lg:col-span-3 p-2 border-b border-gray-200 flex items-center  border-r md:border-r-0 ${
                      index % 2 === 0 ? '' : 'bg-gray-50'
                    }`}
                  >
                    <H5>{numberFormatter(data.quantity)}</H5>
                  </div>

                  <div
                    className={`hidden md:flex items-center md:col-span-4 lg:col-span-3 p-2 border-b border-gray-200 md:border-r ${
                      index % 2 === 0 ? '' : 'bg-gray-50'
                    }`}
                  >
                    <H5>{dateUsHelper(data.createdAt)}</H5>
                  </div>
                </Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </Paper>
  );
});

export default UpdateHistorySection;
