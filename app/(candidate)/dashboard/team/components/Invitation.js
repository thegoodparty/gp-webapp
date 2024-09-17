import { dateUsHelper } from 'helpers/dateHelper';
import Actions from './Actions';
import Body2 from '@shared/typography/Body2';

export default function Invitation(props) {
  const { invitation } = props;
  return (
    <div
      className="col-span-12 md:col-span-12 lg:col-span-6"
      key={invitation.id}
    >
      <div className="py-6 px-4 border border-slate-300 rounded-lg flex justify-between">
        <div>
          <div>
            <a
              href={`mailto:${invitation.email}`}
              className="underline text-blue-700 mb-2 block"
            >
              {invitation.email}
            </a>
          </div>
          <Body2>Sent at: {dateUsHelper(invitation.createdAt)}</Body2>
        </div>
        <div>
          <Actions {...props} />
        </div>
      </div>
    </div>
  );
}
