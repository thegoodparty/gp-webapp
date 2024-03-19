'use client';

import H1 from '@shared/typography/H1';
import H3 from '@shared/typography/H3';
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';

export default function DkCampaignPage(props) {
  const { dkCampaign, routes } = props;
  console.log('dkCampaign', dkCampaign);
  console.log('routes', routes);
  return (
    <DashboardLayout {...props}>
      <div className="bg-gray-50 border border-slate-300 py-6 px-8 rounded-xl">
        <H1>{dkCampaign?.name}</H1>
        <div className="grid grid-cols-12 gap-3 mt-12">
          {routes.map((route) => (
            <div
              key={route.id}
              className=" col-span-12 md:col-span-6 lg:col-span-4"
            >
              <div className="p-4 rounded-md shadow border border-slate-300 h-full">
                <H3 className="mb-6">Status: {route.status}</H3>
                <H3 className="mb-6">Volunteer: {route.volunteer || 'none'}</H3>
                <div>
                  {' '}
                  <i>optimized route:</i>
                  <br />
                  <ol className=" list-decimal ml-6">
                    {(route.data.optimizedAddresses || []).map((add, index) => (
                      <li className="mt-2" key={add.voterId}>
                        {add.address}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
