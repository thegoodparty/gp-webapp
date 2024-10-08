'use client';
import MarketingH2 from '@shared/typography/MarketingH2';
import MarketingH4 from '@shared/typography/MarketingH4';
import Image from 'next/image';
import WinnerFilters from './WinnerFilters';
import MaxWidth from '@shared/layouts/MaxWidth';
import { useEffect, useState } from 'react';
import FilteredWinnerList from './FilteredWinnerList';

// const tempCampaigns = [
//   {
//     slug: 'tomer-almog1',
//     didWin: true,
//     office: 'Flat Rock Village Mayor',
//     state: 'NC',
//     ballotLevel: 'CITY',
//     zip: '28739',
//     party: 'independent',
//     firstName: 'Tomer',
//     lastName: 'Almog',
//     avatar: false,
//     geoLocation: { lat: 35.4119, lng: -82.46711, geoHash: 'dnm2gkm6' },
//   },
//   {
//     slug: 'tomer-almog',
//     didWin: null,
//     office: 'Flat Rock Village Mayor',
//     state: 'NC',
//     ballotLevel: 'CITY',
//     zip: '28739',
//     party: 'independent',
//     firstName: 'Tomer',
//     lastName: 'Almog',
//     avatar: false,
//     geoLocation: { lat: 35.3119, lng: -82.46701, geoHash: 'dnm2gkm6' },
//   },
//   {
//     slug: 'tomer-almog2',
//     didWin: true,
//     office: 'Flat Rock Village Mayor2',
//     state: 'NC',
//     ballotLevel: 'CITY',
//     zip: '28739',
//     party: 'independent',
//     firstName: 'Tomer',
//     lastName: 'Almog',
//     avatar: false,
//     geoLocation: { lat: 35.3119, lng: -82.46701, geoHash: 'dnm2gkm6' },
//   },
//   {
//     slug: 'tomer-almog3',
//     didWin: true,
//     office: 'Flat Rock Village Mayor2',
//     state: 'NC',
//     ballotLevel: 'CITY',
//     zip: '28739',
//     party: 'independent',
//     firstName: 'Tomer3',
//     lastName: 'Almog',
//     avatar: false,
//     geoLocation: { lat: 35.3119, lng: -82.46721, geoHash: 'dnm2gkm6' },
//   },
//   {
//     slug: 'tomer-almog4',
//     didWin: true,
//     office: 'Flat Rock Village Mayor2',
//     state: 'NC',
//     ballotLevel: 'CITY',
//     zip: '28739',
//     party: 'independent',
//     firstName: 'Tomer4',
//     lastName: 'Almog',
//     avatar: false,
//     geoLocation: { lat: 35.3119, lng: -82.46721, geoHash: 'dnm2gkm6' },
//   },

//   {
//     slug: 'tomer-almog5',
//     didWin: true,
//     office: 'Flat Rock Village Mayor2',
//     state: 'NC',
//     ballotLevel: 'COUNTY',
//     zip: '28739',
//     party: 'independent',
//     firstName: 'Tomer4',
//     lastName: 'Almog',
//     avatar: false,
//     geoLocation: { lat: 35.3119, lng: -82.46721, geoHash: 'dnm2gkm6' },
//   },

//   {
//     slug: 'tomer-almog6',
//     didWin: true,
//     office: 'Flat Rock Village Mayor2',
//     state: 'NC',
//     ballotLevel: 'COUNTY',
//     zip: '28739',
//     party: 'independent',
//     firstName: 'Tomer4',
//     lastName: 'Almog',
//     avatar: false,
//     geoLocation: { lat: 35.3119, lng: -82.46721, geoHash: 'dnm2gkm6' },
//   },
//   {
//     slug: 'tomer-almog7',
//     didWin: true,
//     office: 'state Flat Rock Village Mayor2',
//     state: 'NC',
//     ballotLevel: 'STATE',
//     zip: '28739',
//     party: 'independent',
//     firstName: 'Tomer7',
//     lastName: 'Almog',
//     avatar: false,
//     geoLocation: { lat: 35.3119, lng: -82.46721, geoHash: 'dnm2gkm6' },
//   },
//   {
//     slug: 'tomer-almog8',
//     didWin: true,
//     office: 'state Flat Rock Village Mayor2',
//     state: 'NC',
//     ballotLevel: 'STATE',
//     zip: '28739',
//     party: 'independent',
//     firstName: 'Tomer8',
//     lastName: 'Almog',
//     avatar: false,
//     geoLocation: { lat: 35.3119, lng: -82.46721, geoHash: 'dnm2gkm6' },
//   },
//   {
//     slug: 'tomer-almog9',
//     didWin: true,
//     office: 'state Flat Rock Village Mayor2',
//     state: 'NC',
//     ballotLevel: 'STATE',
//     zip: '28739',
//     party: 'independent',
//     firstName: 'Tomer9',
//     lastName: 'Almog',
//     avatar: false,
//     geoLocation: { lat: 35.3119, lng: -82.46721, geoHash: 'dnm2gkm6' },
//   },
//   {
//     slug: 'tomer-almog10',
//     didWin: true,
//     office: 'state Flat Rock Village Mayor2',
//     state: 'NC',
//     ballotLevel: 'STATE',
//     zip: '28739',
//     party: 'independent',
//     firstName: 'Tomer10',
//     lastName: 'Almog',
//     avatar: false,
//     geoLocation: { lat: 35.3119, lng: -82.46721, geoHash: 'dnm2gkm6' },
//   },
// ];

export default function WinnerListSection({ allCampaigns = [] }) {
  const [campaigns, setCampaigns] = useState([]);
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    let winners = [];
    (allCampaigns || []).forEach((campaign) => {
      if (campaign.didWin === true) {
        winners.push(campaign);
      }
    });

    const allOffices = winners.map((campaign) => campaign.office);
    const offices = [...new Set(allOffices)]; // dedupe

    setCampaigns(winners);
    setOffices(offices);
  }, [allCampaigns]);

  const [filters, setFilters] = useState({
    state: '',
    office: '',
    level: '',
  });

  const onChangeFilters = (key, value) => {
    setFilters({ ...filters, [key]: value });

    const filteredCampaigns = allCampaigns.filter((campaign) => {
      return (
        campaign.didWin === true &&
        (key === 'state' ? campaign.state === value || value === '' : true) &&
        (key === 'office' ? campaign.office === value || value === '' : true) &&
        (key === 'level'
          ? campaign.ballotLevel === value || value === ''
          : true)
      );
    });
    setCampaigns(filteredCampaigns);
  };

  return (
    <div className="py-8 px-4 lg:p-16">
      <MaxWidth>
        <MarketingH2 className="text-center">
          <span className="">
            {campaigns.length > 0 ? campaigns.length : ''} independents won
            using
            <Image
              src="/images/heart.svg"
              width={60}
              height={60}
              alt="gp.org"
              className="mx-3 mt-3 static inline-block w-12 h-12 lg:w-16 lg:h-16"
              priority
            />{' '}
            tools
          </span>
        </MarketingH2>
        <MarketingH4 className="mt-8 text-center mb-12">
          Learn who is leading the charge for independents in local elections
        </MarketingH4>
        <WinnerFilters onChangeFilters={onChangeFilters} offices={offices} />
        <FilteredWinnerList campaigns={campaigns} />
      </MaxWidth>
    </div>
  );
}
