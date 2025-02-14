'use client';
import RaceCard from './RaceCard';
import Sticky from 'react-stickynode';
import { useEffect, useState } from 'react';
import ZipChanger from './ZipChanger';
import { CircularProgress } from '@mui/material';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import H3 from '@shared/typography/H3';
import Modal from '@shared/utils/Modal';
import CustomOfficeModal from './CustomOfficeModal';
import { useRouter } from 'next/navigation';
import H4 from '@shared/typography/H4';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { OfficeSelectionFilters } from 'app/(candidate)/onboarding/[slug]/[step]/components/ballotOffices/OfficeSelectionFilters';
import Button from '@shared/buttons/Button';

const fetchRaces = async (zip) => {
  const api = gpApi.ballotData.races;
  let cleanLevel = level;
  if (level === 'Local/Township/City') {
    cleanLevel = 'Local';
  }
  if (level === 'County/Regional') {
    cleanLevel = 'County';
  }
  const payload = { zip, level: cleanLevel, electionDate };
  return await gpFetch(api, payload, 3600);
};

export default function BallotRaces(props) {
  const {
    campaign,
    selectedOfficeCallback,
    selectedOffice,
    step,
    updateCallback,
    zip,
    level,
    electionDate,
    adminMode,
  } = props;
  const [zip, setZip] = useState(campaign.details?.zip);
  const [races, setRaces] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [level, setLevel] = useState('');
  const [yearFilter, setYearFilter] = useState(null);
  const [selected, setSelected] = useState(selectedOffice || false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [electionYears, setElectionYears] = useState([]);
  const [collapsedYears, setCollapsedYears] = useState({});
  const raceCountStart = 0;
  const numOfRaces = electionYears?.reduce((raceCount, year) => {
    const nextRaceCount = raceCount + ((races && races[year]?.length) || 0);
    return nextRaceCount;
  }, raceCountStart);
  const router = useRouter();

  useEffect(() => {
    loadRaces(campaign.details?.zip);
  }, []);

  useEffect(() => {
    setCollapsedYears(
      electionYears.reduce((aggregate, year) => {
        const nextAggregate = {
          ...aggregate,
          [year]: false,
        };
        return nextAggregate;
      }, {}),
    );
  }, [electionYears]);

  const loadRaces = async (zip) => {
    if (zip) {
      setLoading(true);
      const initRaces = await fetchRaces(zip || campaign.details.zip);
      if (!initRaces) {
        throw new Error(`Couldn't fetch races for zip ${zip}`);
      }
      setElectionYears(Object.keys(initRaces).sort());
      setRaces(initRaces);
      setLoading(false);
    }
  };

  if (!zip) {
    return <div>No valid zip</div>;
  }

  const handleKeyDown = (e, electionYear) => {
    if (e.key === 'Enter') {
      handleYearClick(electionYear);
    }
  };

  const handleYearClick = (electionYear) =>
    setCollapsedYears({
      ...collapsedYears,
      [electionYear]: !collapsedYears[electionYear],
    });

  const handleSelect = (race) => {
    if (race?.id === selected?.id) {
      setSelected(false);
      selectedOfficeCallback(false);
    } else {
      setSelected(race);
      selectedOfficeCallback(race);
    }
  };

  const clearState = () => {
    setSelected(false);
    setInputValue('');
    setLevel('');
    setYearFilter(null);
  };

  const handleZipChange = async (newZip) => {
    if (newZip !== zip) {
      setZip(newZip);
      clearState();
      await loadRaces(newZip);
      await updateCampaign([{ key: 'details.zip', value: newZip }]);
    }
  };

  const filterRace = (race) => {
    let positionLevel = race.position.level;

    // TODO: move this kind of data-rewrite closer to "source of truth", preferably
    //  whatever entry point the data is being ingested into our database
    if (positionLevel === 'CITY') {
      positionLevel = 'LOCAL';
    }
    const raceYear = new Date(race.election.electionDay).getFullYear();

    const isTextFiltered = inputValue
      ? race.position.name.toLowerCase().includes(inputValue.toLowerCase())
      : true;

    const isLevelFiltered = level
      ? level && positionLevel === level.toUpperCase()
      : true;

    const isYearFiltered = yearFilter
      ? parseInt(yearFilter) === raceYear
      : true;

    return isTextFiltered && isLevelFiltered && isYearFiltered;
  };

  const areFiltersEmpty = !level && !inputValue && !yearFilter;
  const filtered = areFiltersEmpty
    ? races
    : electionYears.reduce(
        (racesGroupedByYear, year) => ({
          ...racesGroupedByYear,
          [year]: races[year]?.filter(filterRace),
        }),
        {},
      );
  const showCustomModal = () => {
    setShowModal(true);
  };

  const saveCustomOffice = async (updated) => {
    updated.details.positionId = null;
    updated.details.electionId = null;
    if (step) {
      updated.currentStep = campaign.currentStep
        ? Math.max(campaign.currentStep, step)
        : step;

      const attr = [
        { key: 'data.currentStep', value: updated.currentStep },
        { key: 'details.otherOffice', value: '' },
        { key: 'details.positionId', value: null },
        { key: 'details.electionId', value: null },
        { key: 'details.office', value: updated.details.office },
        { key: 'details.city', value: updated.details.city },
        { key: 'details.district', value: updated.details.district },
        {
          key: 'details.electionDate',
          value: updated.details.electionDate,
        },
        {
          key: 'details.officeTermLength',
          value: updated.details.officeTermLength,
        },
        { key: 'details.state', value: updated.details.state },
      ];
      await updateCampaign(attr);
      router.push(`/onboarding/${campaign.slug}/${step + 1}`);
    } else {
      const attr = [
        { key: 'details.otherOffice', value: '' },
        { key: 'details.positionId', value: null },
        { key: 'details.electionId', value: null },
        { key: 'details.office', value: updated.details.office },
        { key: 'details.city', value: updated.details.city },
        { key: 'details.district', value: updated.details.district },
        {
          key: 'details.electionDate',
          value: updated.details.electionDate,
        },
        {
          key: 'details.officeTermLength',
          value: updated.details.officeTermLength,
        },
        { key: 'details.state', value: updated.details.state },
      ];
      if (adminMode) {
        await updateCampaign(attr, campaign.slug);
      } else {
        await updateCampaign(attr);
      }
      if (updateCallback) {
        updateCallback();
      }
    }
  };

  return (
    <section className="mb-2">
      <ZipChanger
        zip={zip}
        updateZipCallback={handleZipChange}
        count={numOfRaces || 0}
      />
      <Sticky top={56} innerZ={10}>
        <OfficeSelectionFilters
          electionYears={electionYears}
          onChange={({ inputValue, level, yearFilter }) => {
            setInputValue(inputValue);
            setLevel(level);
            setYearFilter(yearFilter);
          }}
        />
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
          {races &&
            races.map((race, index) => (
              <RaceCard
                key={index}
                race={race}
                selected={race?.id === selected.id}
                selectCallback={handleSelect}
                inputValue={inputValue}
              />
            ))}
          {!loading && (
            <Button
              onClick={showCustomModal}
              color="neutral"
              variant="text"
              size="large"
              className="w-full"
            >
              I can&apos;t see my position
            </Button>
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
