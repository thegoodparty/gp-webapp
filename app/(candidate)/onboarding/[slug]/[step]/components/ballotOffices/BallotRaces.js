'use client';
import RaceCard from './RaceCard';
import Sticky from 'react-stickynode';
import { useEffect, useState } from 'react';
import ZipChanger from './ZipChanger';
import { CircularProgress, Select } from '@mui/material';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import H3 from '@shared/typography/H3';
import TextField from '@shared/inputs/TextField';
import Modal from '@shared/utils/Modal';
import CustomOfficeModal from './CustomOfficeModal';
import { useRouter } from 'next/navigation';

const fetchRaces = async (zip) => {
  const api = gpApi.ballotData.races;
  const payload = { zip };
  return await gpFetch(api, payload, 3600);
};

export default function BallotRaces(props) {
  const { campaign, selectedOfficeCallback, selectedOffice } = props;
  const [zip, setZip] = useState(campaign.details.zip);
  const [races, setRaces] = useState(false);
  const [filteredRaces, setFilteredRaces] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [level, setLevel] = useState('');
  const [selected, setSelected] = useState(selectedOffice || false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadRaces();
  }, []);

  const loadRaces = async () => {
    setLoading(true);
    const initRaces = await fetchRaces(campaign.details.zip);
    setRaces(initRaces.races);
    setFilteredRaces(initRaces.races);
    setLoading(false);
  };

  const handleSelect = (race) => {
    if (race?.position?.id === selected?.position?.id) {
      setSelected(false);
      selectedOfficeCallback(false);
    } else {
      setSelected(race);
      selectedOfficeCallback(race);
    }
  };

  const handleZipChange = async (newZip) => {
    if (newZip !== zip) {
      setLoading(true);
      const newRaces = await fetchRaces(newZip);
      setRaces(newRaces.races);
      setFilteredRaces(newRaces.races);
      setZip(newZip);
      setSelected(false);
      setLoading(false);
      setFilters('');
      const updatedCampaign = {
        ...campaign,
        details: {
          ...campaign.details,
          zip: newZip,
        },
      };
      await updateCampaign(updatedCampaign);
    }
  };

  const filterRaces = (value, updatedLevel) => {
    if (!value && updatedLevel === '') {
      setFilteredRaces(races);
      return;
    }
    if (races && typeof races.filter === 'function') {
      const filtered = races.filter((option) => {
        let positionLevel = option.position.level;
        if (positionLevel === 'CITY') {
          positionLevel = 'LOCAL';
        }

        if (value && (!updatedLevel || updatedLevel === '')) {
          return option.position.name
            .toLowerCase()
            .includes(value.toLowerCase());
        }
        if (value && updatedLevel && updatedLevel !== '') {
          return (
            option.position.name.toLowerCase().includes(value.toLowerCase()) &&
            positionLevel === updatedLevel.toUpperCase()
          );
        }

        return positionLevel === updatedLevel.toUpperCase();
      });
      setFilteredRaces(filtered);
    }
  };

  const showCustomModal = () => {
    setShowModal(true);
  };

  const saveCustomOffice = async (updated) => {
    await updateCampaign(updated);
    updated.currentStep = campaign.currentStep
      ? Math.max(campaign.currentStep, step)
      : step;
    await updateCampaign(updated);
    router.push(`/onboarding/${campaign.slug}/${step + 1}`);
  };

  return (
    <section className="mb-10">
      <ZipChanger
        zip={zip}
        updateZipCallback={handleZipChange}
        count={races?.length || 0}
      />
      <Sticky top={56} innerZ={10}>
        <div className="bg-white pt-4 pb-2">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8 pt-1">
              <TextField
                label="Search for offices"
                value={inputValue}
                fullWidth
                onChange={(e) => {
                  setInputValue(e.target.value);
                  filterRaces(e.target.value, level);
                }}
              />
            </div>
            <div className="hidden md:block md:col-span-4">
              <div>
                <Select
                  native
                  required
                  variant="outlined"
                  fullWidth
                  value={level}
                  onChange={(e) => {
                    setLevel(e.target.value);
                    filterRaces(inputValue, e.target.value);
                  }}
                  sx={{ padding: '2px' }}
                >
                  <option value="">Election Level</option>
                  {['local', 'county', 'state', 'federal'].map((value) => (
                    <option value={value} key={value}>
                      {value} office
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
      </Sticky>
      {loading ? (
        <div className="mt-6 text-center">
          <CircularProgress />
          <br />
          <br />
          <H3>Loading Races</H3>
        </div>
      ) : (
        <div className="mt-6">
          {filteredRaces &&
            filteredRaces.map((race, index) => (
              <RaceCard
                key={index}
                race={race}
                // modalCallback={(race) => {
                //   setShowModal(race);
                // }}
                selected={race?.position?.id === selected.position?.id}
                selectCallback={handleSelect}
                inputValue={inputValue}
              />
            ))}
          {!loading && (
            <div
              className="px-4 py-4 cursor-pointer rounded-md transition-colors hover:bg-slate-100"
              onClick={showCustomModal}
            >
              I can&apos;t see my position
            </div>
          )}
        </div>
      )}
      {showModal && (
        <Modal
          open
          closeCallback={() => {
            setShowModal(false);
          }}
        >
          <CustomOfficeModal
            campaign={campaign}
            nextCallback={saveCustomOffice}
          />
        </Modal>
      )}
    </section>
  );
}
