'use client';

import React, { useState, useEffect } from 'react';
// import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@shared/inputs/TextField';
import { useRouter, usePathname } from 'next/navigation';
import { slugify } from 'helpers/articleHelper';

export default function FiltersSection({
  positions,
  states,
  routePosition,
  routeState,
  showOnlyGood,
}) {
  console.log('showOnlyGood', showOnlyGood);
  const pathname = usePathname();
  const [state, setState] = useState({
    position: '',
    state: routeState || '',
  });

  const router = useRouter();

  const [positionsById, setPositionsById] = useState({});
  const [showVoteModal, setShowVoteModal] = useState(false);

  useEffect(() => {
    const byId = {};
    positions.forEach((position) => {
      byId[position.id] = position;
    });
    setPositionsById(byId);
  }, [positions]);

  useEffect(() => {
    let position = '';
    let state = '';
    if (Object.keys(positionsById).length > 0) {
      if (routePosition && routePosition !== 'all') {
        position = parseInt(routePosition.split('|')[1], 10);
      }
    }
    if (routeState) {
      state = states.findIndex((item) => item === routeState);
    }

    setState({
      position,
      state,
    });
  }, [routePosition, routeState, positionsById]);

  const onChangeField = (key, val) => {
    const newState = {
      ...state,
      [key]: val,
    };
    setState(newState);
    setNewRoute(positionsById[newState.position], states[newState.state]);
  };

  const setNewRoute = (position, state) => {
    let positionRoute = 'all';
    if (position && position !== '') {
      positionRoute = `${slugify(position.name)}|${position.id}`;
    }
    let stateRoute = '';
    if (state && state !== '') {
      stateRoute = slugify(state);
    }
    if (positionRoute === 'all' && stateRoute === '') {
      router.push('/candidates');
    } else {
      router.push(`/candidates/${positionRoute}/${stateRoute}`);
    }
  };

  const setGoodQuery = (checked) => {
    console.log('setGood', checked);
    if (checked) {
      router.push(`${pathname}?certified=true`);
    } else {
      router.push(pathname);
    }
  };

  const handlePillClick = (id) => {
    if (id === state.position) {
      onChangeField('position', '');
    } else {
      onChangeField('position', id);
    }
  };
  return (
    <section>
      <h2
        className="text-xl font-black mt-7 lg:mt-0 lg:mb-7"
        data-cy="filter-section-title"
      >
        Filter by Top Issues
      </h2>
      <div className="h-11 overflow-hidden mb-4 lg:mb-6">
        {positions.map((position) => (
          <div
            key={position.id}
            onClick={() => {
              handlePillClick(position.id);
            }}
            className="inline-block py-2 px-4 bg-zinc-100 mr-4 mb-4 cursor-pointer rounded-md transition hover:bg-zinc-300"
            style={
              position.id === state.position
                ? { backgroundColor: '#000', color: '#fff' }
                : {}
            }
            data-cy="position-pill"
          >
            {position.name} ({position.candidates?.length})
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 lg:grid-cols-4 items-center">
        <div className="col-span-2 lg:col-span-1">
          <Autocomplete
            options={positions}
            groupBy={(option) => {
              return option.topIssue?.name;
            }}
            getOptionLabel={(option) => option.name}
            fullWidth
            value={positionsById[state.position] || null}
            variant="outlined"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search all Issues"
                // value={state.position}
              />
            )}
            onChange={(event, item) => {
              onChangeField('position', item?.id);
            }}
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <Autocomplete
            options={states}
            value={states[state.state] || null}
            fullWidth
            variant="outlined"
            autoSelect
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by state"
                variant="outlined"
                // value={states[state.state]}
                // value="tomer"
              />
            )}
            onChange={(event, item) => {
              onChangeField('state', states.indexOf(item));
            }}
          />
        </div>
        <div className="col-span-3 lg:col-span-2">
          <Checkbox
            color="primary"
            checked={!!showOnlyGood}
            onChange={(e) => setGoodQuery(e.target.checked)}
          />
          Show only Good Party Certified Candidates
        </div>
      </div>
    </section>
  );
}
