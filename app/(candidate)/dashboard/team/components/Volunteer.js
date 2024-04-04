import H5 from '@shared/typography/H5';
import { formatToPhone } from 'helpers/numberHelper';

export default function Volunteer(props) {
  const { volunteer } = props;
  const { firstName, lastName, email, phone } = volunteer;
  return (
    <div className="col-span-6 md:col-span-6 lg:col-span-4 h-full">
      <div className="p-2 md:p-6 border border-slate-300 rounded-lg flex justify-between  h-full">
        <div>
          <div>
            <H5>
              {firstName} {lastName}
            </H5>
            <a
              href={`mailto:${email}`}
              className="underline text-blue-700 mb-2 block"
            >
              {email}
            </a>
            <a href={`tel:${phone}`} className="mb-2 block">
              {formatToPhone(phone)}
            </a>
          </div>
        </div>
        {/* <div>
          <Actions {...props} />
        </div> */}
      </div>
    </div>
  );
}
