import H3 from '@shared/typography/H3';
import { Fragment } from 'react';

export default function Race({ race }) {
  return (
    <div className="border-2 border-slate-400 bg-slate-50 rounded-2xl text-left mb-6 cursor-pointer">
      <div className="p-6">
        <H3 className="mt-2 mb-6">{race.data?.position_name}</H3>
        {Object.keys(race.data).map((key) => (
          <Fragment key={key}>
            <div className=" font-semibold">{key}</div>
            <div className="mt-2 mb-6">{race.data[key]}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
