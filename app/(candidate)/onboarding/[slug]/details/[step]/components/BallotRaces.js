'use client';
import RaceCard from './RaceCard';
import Body1 from '@shared/typography/Body1';
import Sticky from 'react-stickynode';
import { useEffect, useState } from 'react';
import Modal from '@shared/utils/Modal';
import RaceModal from './RaceModal';
import ZipChanger from './ZipChanger';
import { CircularProgress } from '@mui/material';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const values = ['local', 'state', 'federal'];

const fetchRaces = async (zip) => {
  const api = gpApi.ballotData.races;
  const payload = { zip };
  return await gpFetch(api, payload, 3600);
};

export default function BallotRaces(props) {
  const { campaign } = props;
  const [tab, setTab] = useState(0);
  const [zip, setZip] = useState(campaign.details.zip);
  const [races, setRaces] = useState(props.races);
  const [groupedRaces, setGroupedRaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGroupedRaces(races[values[tab]]);
    // setGroupedRaces(races.federal);
  }, [races, tab]);

  if (!races || !races.local) {
    return null;
  }
  const changeTabCallback = (index) => {
    setTab(index);
  };
  const labels = [
    `Local (${loading ? '0' : races?.local.length})`,
    `State (${loading ? '0' : races?.state.length})`,
    `Federal (${loading ? '0' : races?.federal.length})`,
  ];

  const handleSelect = (race) => {
    if (race?.position?.id === selected?.position?.id) {
      setSelected(false);
    } else {
      setSelected(race);
    }
  };

  const handleZipChange = async (newZip) => {
    if (newZip !== zip) {
      setLoading(true);
      const newRaces = await fetchRaces(newZip);
      setRaces(newRaces.races);
      setZip(newZip);
      setSelected(false);
      setLoading(false);
    }
  };

  return (
    <section className="mb-10">
      <Body1>
        With over 500,000 local, state, and federal offices available, it can be
        overwhelming, but we&apos;ve narrowed it down based on your residency.
      </Body1>
      <ZipChanger zip={zip} updateZipCallback={handleZipChange} />
      <Body1 className="font-semibold mt-16  mb-4">
        Where do you want to run?
      </Body1>
      <Sticky top={56} innerZ={10}>
        <div className="bg-white pt-10 pb-2">
          <div className="grid grid-cols-12">
            {labels.map((label, index) => (
              <div className=" col-span-4" key={label}>
                <div
                  className={`${
                    index === tab ? 'bg-primary text-white' : 'text-indigo-50'
                  } text-center py-4 rounded-xl cursor-pointer`}
                  onClick={() => {
                    changeTabCallback(index);
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sticky>
      {loading ? (
        <div className="mt-6 text-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="mt-6">
          {groupedRaces.map((race, index) => (
            <RaceCard
              key={index}
              race={race}
              modalCallback={(race) => {
                setShowModal(race);
              }}
              selected={race.position?.id === selected.position?.id}
              selectCallback={handleSelect}
            />
          ))}
        </div>
      )}
      {showModal && (
        <Modal
          open
          closeCallback={() => {
            setShowModal(false);
          }}
        >
          <RaceModal race={showModal} />
        </Modal>
      )}
    </section>
  );
}
