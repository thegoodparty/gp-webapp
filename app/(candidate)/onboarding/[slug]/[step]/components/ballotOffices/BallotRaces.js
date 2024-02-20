'use client';
import RaceCard from './RaceCard';
import Body1 from '@shared/typography/Body1';
import Sticky from 'react-stickynode';
import { useEffect, useState } from 'react';
import Modal from '@shared/utils/Modal';
import RaceModal from './RaceModal';
import ZipChanger from './ZipChanger';
import { Autocomplete, CircularProgress } from '@mui/material';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import H3 from '@shared/typography/H3';
import TextField from '@shared/inputs/TextField';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const values = ['local', 'state', 'federal'];

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
  const [value, setValue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(selectedOffice || false);
  const [loading, setLoading] = useState(false);

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

  const filterRaces = (value) => {
    if (races && typeof races.filter === 'function') {
      const filtered = races.filter((option) =>
        option.position.name.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredRaces(filtered);
    }
  };

  const filterOptions = (options, { inputValue }) => {
    if (options && typeof options.filter === 'function') {
      return options.filter((option) =>
        option.position.name.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }
  };
  const renderOption = (props, option, { inputValue }) => {
    const matches = match(option.position.name, inputValue, {
      insideWords: true,
    });
    const parts = parse(option.position.name, matches);

    return (
      <li {...props}>
        <div>
          {(parts || []).map((part, index) => (
            <span
              key={index}
              style={{
                fontWeight: part.highlight ? 700 : 400,
              }}
            >
              {part.text}
            </span>
          ))}
        </div>
      </li>
    );
  };

  return (
    <section className="mb-10">
      <ZipChanger zip={zip} updateZipCallback={handleZipChange} />
      <Sticky top={56} innerZ={10}>
        <div className="bg-white pt-4 pb-2">
          <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
              filterRaces(newInputValue);
            }}
            className="office-autocomplete"
            options={races || []}
            clearOnBlur={false}
            renderInput={(params) => (
              <TextField {...params} label="Search for offices" />
            )}
            getOptionLabel={(option) => option.position.name}
            filterOptions={filterOptions}
            renderOption={renderOption}
          />
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
                modalCallback={(race) => {
                  setShowModal(race);
                }}
                selected={race?.position?.id === selected.position?.id}
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
