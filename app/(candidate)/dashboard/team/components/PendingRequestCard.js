'use client';
import { PendingRequestActions } from 'app/(candidate)/dashboard/team/components/PendingRequestActions';

export const PendingRequestCard = ({
  request,
  onAction = (action, request) => {},
}) => {
  const { user, role } = request;
  const { email } = user;
  const name =
    user?.firstName || user.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : '';

  return (
    <div className="col-span-6 md:col-span-6 lg:col-span-4">
      <div className="p-2 md:p-6 border border-slate-300 rounded-lg flex justify-between">
        <div className="block">
          {name && <div className="font-bold">{name}</div>}
          {email && (
            <a
              href={`mailto:${email}`}
              className="underline text-blue-700 mb-2 block"
            >
              {email}
            </a>
          )}
          {role && (
            <div className="text-slate-500 capitalize">Role: {role}</div>
          )}
        </div>
        <div>
          <PendingRequestActions
            onSelect={(action) => onAction(action, request)}
          />
        </div>
      </div>
    </div>
  );
};
