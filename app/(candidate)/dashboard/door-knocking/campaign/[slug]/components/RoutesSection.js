'use client';
import H2 from '@shared/typography/H2';
import Body2 from '@shared/typography/Body2';
import Body1 from '@shared/typography/Body1';
import { MdOutlineInfo } from 'react-icons/md';
import RoutePreview from './RoutePreview';
import { useState } from 'react';
import { Select } from '@mui/material';
import Caption from '@shared/typography/Caption';

export default function RoutesSection(props) {
  const { dkCampaign } = props;
  const { name } = dkCampaign;
  const [routes, setRoutes] = useState(props.routes || []);
  const [filter, setFilter] = useState('all');

  const handleFilter = (option) => {
    setFilter(option);
    if (option === 'all') {
      setRoutes(props.routes);
    } else {
      const filteredRoutes = props.routes.filter((route) => {
        return route.status === option;
      });
      setRoutes(filteredRoutes);
    }
  };

  return (
    <div className="bg-white border border-slate-300 p-3 md:py-6 md:px-8 rounded-xl mt-6">
      <div className="flex justify-between items-start">
        <div>
          <H2>{name} Routes</H2>
          <Body2 className="mt-2">Optimized routes for your campaign.</Body2>
        </div>
        <div>
          <Caption>Status</Caption>
          <Select
            native
            value={filter}
            outlined
            variant="outlined"
            onChange={(e) => {
              handleFilter(e.target.value);
            }}
            style={{ paddingTop: '4px', minWidth: '180px' }}
          >
            <option value="all">All</option>
            <option value="not-claimed">Unclaimed</option>
            <option value="claimed">Claimed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
      </div>
      <div className="my-6 bg-[#E5F6FD] rounded-lg px-4 py-2 flex">
        <div className="mr-3 text-cyan-700 mt-1">
          <MdOutlineInfo />
        </div>
        <div>
          <Body1 className="font-semibold text-cyan-900">
            We generate 10 routes at a time.
          </Body1>
          <Body2 className="text-cyan-900 mt-1">
            Good Party purchases route data so you don&apos;t have to. Route
            information is provided in increments to limit our upfront spending.
          </Body2>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-12">
        {routes.map((route) => (
          <div
            key={route.id}
            className=" col-span-12 md:col-span-6 lg:col-span-4"
          >
            <RoutePreview route={route} />
          </div>
        ))}
      </div>
    </div>
  );
}
