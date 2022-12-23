import { numberFormatter } from 'helpers/numberHelper';
import { FaLongArrowAltUp, FaLongArrowAltDown } from 'react-icons/fa';
import CampaignChart from './CampaignChart';
import { Suspense } from 'react';
import PortalPanel from '@shared/layouts/PortalPanel';

export default function CampaignPanel({ stats, chart }) {
  if (!stats) {
    return null;
  }
  const { visitors, shares, followers } = stats;
  const fields = [
    { label: 'VIEWS', data: visitors || {} },
    { label: 'SHARES', data: shares || {} },
    { label: 'FOLLOWERS', data: followers || {} },
  ];
  return (
    <PortalPanel color="#2CCDB0">
      <div className="row">
        <h3 className="text-2xl font-black mb-8" data-cy="campaign-panel-title">
          Campaign Page
        </h3>
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="grid grid-cols-12">
            {fields.map((field) => (
              <div
                className="col-span-12 lg:col-span-4"
                key={field.label}
                data-cy="campaign-stat-field"
              >
                <div className="font-bold mb-3" data-cy="stat-label">
                  {field.label}
                </div>
                <div
                  className="inline-block mr-3 text-zinc-600"
                  data-cy="stat-total"
                >
                  {numberFormatter(field.data.total)}
                </div>
                <div
                  className="inline-block mr-3 text-zinc-600"
                  data-cy="stat-perc"
                >
                  {progressPerc(field.data.total, field.data.lastPeriod)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <Suspense fallback="loading">
            <CampaignChart chart={chart} />
          </Suspense>
        </div>
      </div>
    </PortalPanel>
  );
}

const progressPerc = (thisTotal, lastTotal) => {
  if (thisTotal === 0 && lastTotal === 0) {
    return (
      <>
        <div className="inline-block  text-emerald-400 mr-1">
          <FaLongArrowAltUp />
        </div>
        0%
      </>
    );
  }
  if (lastTotal === 0) {
    return (
      <>
        <div className="inline-block  text-emerald-400 mr-1">
          <FaLongArrowAltUp />
        </div>
        100%
      </>
    );
  }
  const perc = (thisTotal * 100) / lastTotal;
  const sign =
    thisTotal > lastTotal ? <FaLongArrowAltUp /> : <FaLongArrowAltDown />;
  return (
    <>
      <div className="inline-block  text-emerald-400 mr-1">{sign}</div>
      {numberFormatter(parseInt(perc, 10))}%
    </>
  );
};
