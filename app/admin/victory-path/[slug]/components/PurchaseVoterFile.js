'use client';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidatePage } from 'helpers/cacheHelper';
import SuccessButton from '@shared/buttons/SuccessButton';
import { useState } from 'react';
import WarningButton from '@shared/buttons/WarningButton';
import VoteAnimation from '@shared/animations/VoteAnimation';
import H3 from '@shared/typography/H3';
import H4 from '@shared/typography/H4';
import Checkbox from '@shared/inputs/Checkbox';
import H5 from '@shared/typography/H5';

async function purchaseFile(slug, filters) {
  try {
    const api = gpApi.voterData.purchaseVoterFile;
    const payload = { slug, filters };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

async function countFile(slug, filters) {
  try {
    const api = gpApi.voterData.count;
    const payload = { slug, filters };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

const filtersOptions = {
  performance: [
    'Not Eligible',
    '0%',
    '12%',
    '14%',
    '16%',
    '20%',
    '25%',
    '28%',
    '33%',
    '37%',
    '40%',
    '42%',
    '50%',
    '57%',
    '60%',
    '62%',
    '66%',
    '71%',
    '75%',
    '80%',
    '83%',
    '85%',
    '87%',
    '100%',
  ],
};

export default function PurchaseVoterFile(props) {
  const { campaign } = props;
  const [processing, setProcessing] = useState(false);
  const [count, setCount] = useState(false);
  const [filters, setFilters] = useState({});

  const snackbarState = useHookstate(globalSnackbarState);

  const handlePurchase = async () => {
    if (processing) return;
    setProcessing(true);
    const queryFilters = flatFilters();
    const response = await purchaseFile(campaign.slug, queryFilters);
    if (response) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Voter file purchased',
          isError: false,
        };
      });
      await revalidatePage('/admin/victory-path/[slug]');
      setProcessing(false);
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error purchasing voter file',
          isError: true,
        };
      });
      setProcessing(false);
    }
  };

  const handleCount = async () => {
    if (processing) return;
    setProcessing(true);
    const queryFilters = flatFilters();
    const response = await countFile(campaign.slug, queryFilters);
    if (response) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Counting Voters',
          isError: false,
        };
      });
      const { count } = response;
      setCount(count);
      setProcessing(false);
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error counting voters',
          isError: true,
        };
      });
      setCount(false);
      setProcessing(false);
    }
  };

  const flatFilters = () => {
    const keys = Object.keys(filters);
    if (keys.length === 0) return false;
    return {
      VotingPerformanceEvenYearGeneral: keys,
    };
  };

  const handleFilter = (key, value) => {
    if (value) {
      setFilters({ ...filters, [key]: true });
    } else {
      delete filters[key];
      setFilters(filters);
    }
  };

  return (
    <>
      <div>
        <H4 className="mt-5">Filters</H4>
        <div className="border rounded border-slate-300 p-4 my-3">
          <H5>Performance In Even Year Generals</H5>
          <div className="grid grid-cols-12 gap-4">
            {filtersOptions.performance.map((filter) => (
              <div
                key={filter}
                className="col-span-6 md:col-span-4 lg:col-span-3"
              >
                <Checkbox
                  value={filter}
                  onChange={(e) => handleFilter(filter, e.target.checked)}
                />{' '}
                {filter}
              </div>
            ))}
          </div>
        </div>
      </div>
      {count !== false ? (
        <div className="my-4 border border-slate-300 rounded p-3">
          <div className="text-lg">
            Voter count: <strong>{count}</strong>
          </div>
        </div>
      ) : null}
      <div className="items-center mt-4 flex">
        <SuccessButton disabled={processing} onClick={handlePurchase}>
          Purchase Voter File
        </SuccessButton>
        <div className="ml-4">
          <WarningButton disabled={processing} onClick={handleCount}>
            Count Voters (without purchasing)
          </WarningButton>
        </div>
        {processing ? (
          <div className="fixed top-0 left-0 w-screen h-screen z-[1201] flex items-center justify-center bg-black bg-opacity-25">
            <div className="w-64 h-64">
              <VoteAnimation loop />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
