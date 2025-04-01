'use client';

import { InfoOutlined } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import DashboardLayout from '../../shared/DashboardLayout';
import TaskItem from './TaskItem';
import H1 from '@shared/typography/H1';
import H2 from '@shared/typography/H2';
import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import { dateUsHelper, daysTill, weeksTill } from 'helpers/dateHelper';

export default function TasksPage({ pathname, campaign, tasks }) {
  const electionDate = campaign.details.electionDate;

  const weeksUntilElection = weeksTill(electionDate);
  const daysUntilElection = daysTill(electionDate);

  console.log('daysUntilElection', daysUntilElection);
  console.log('weeksUntilElection', weeksUntilElection);
  // TODO: what if no election date?
  // TODO: what if no p2v?
  // TODO: what if no tasks? when do tasks get created?

  // TODO: make sure the weeksUntil and task filter logic is correct (might be off by 1)
  const weeklyTasks = tasks.filter(
    (task) => task.week === weeksUntilElection.weeks,
  );

  return (
    <DashboardLayout pathname={pathname} campaign={campaign}>
      <H1 className="!text-3xl">
        {weeksUntilElection.weeks} weeks and {weeksUntilElection.days} days
        until election
      </H1>

      <div className="mx-auto bg-white rounded-xl p-6 mt-8">
        <H2>
          Tasks for this week
          <Tooltip title="Tooltip">
            <InfoOutlined className="text-base ml-1" />
          </Tooltip>
        </H2>
        <Body2 className="!font-outfit mt-1">
          Election day: {dateUsHelper(campaign.details.electionDate)}
        </Body2>

        <ul className="p-0 mt-4">
          {weeklyTasks.length > 0 ? (
            weeklyTasks.map((task, idx) => (
              <TaskItem
                key={task.id}
                task={task}
                isPro={campaign.isPro}
                daysUntilElection={daysUntilElection}
                isCompleted={idx === 2}
              />
            ))
          ) : (
            <li className="block text-center p-4 mt-4 bg-white rounded-lg border border-black/[0.12]">
              <H4 className="mt-1">No tasks for this week</H4>
            </li>
          )}
        </ul>
      </div>
    </DashboardLayout>
  );
}
