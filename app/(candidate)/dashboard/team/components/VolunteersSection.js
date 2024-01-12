import H2 from '@shared/typography/H2';
import { formatToPhone } from 'helpers/numberHelper';
import { Fragment } from 'react';

export default function VolunteersSection(props) {
  const { volunteers } = props;
  if (!volunteers || volunteers.length === 0) {
    return null;
  }
  return (
    <section className="bg-gray-50 border border-slate-300 mb-6 py-6 px-8 rounded-xl">
      <H2 className="mb-8">Campaign volunteers</H2>
      {!volunteers && (
        <div className="mt-3">You don&apos;t have any volunteers</div>
      )}

      {volunteers && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 bg-slate-300 px-2 py-2">Name</div>
          <div className="col-span-3 bg-slate-300 px-2 py-2">Email</div>
          <div className="col-span-3 bg-slate-300 px-2 py-2">Phone</div>
          <div className="col-span-3 bg-slate-300 px-2 py-2">Role</div>
          {volunteers.map((volunteer) => (
            <Fragment key={volunteer.id}>
              <div className="col-span-3 px-2 py-2">{volunteer.name}</div>
              <div className="col-span-3 px-2 py-2">
                <a href={`mailto:volunteer.email`}>{volunteer.email}</a>
              </div>
              <div className="col-span-3 px-2 py-2">
                {volunteer.phone ? (
                  <a href={`tel:${volunteer.phone}`}>
                    {formatToPhone(volunteer.phone)}
                  </a>
                ) : (
                  'n/a'
                )}
              </div>
              <div className="col-span-3 px-2 py-2">{volunteer.role}</div>
            </Fragment>
          ))}
        </div>
      )}
    </section>
  );
}
