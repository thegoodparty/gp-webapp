'use client';
/**
 *
 * TopIssueRow
 *
 */

import React, { useState, useEffect, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@shared/inputs/TextField';
import { FaTrash } from 'react-icons/fa';

const initialState = {
    selectedTopic: null,
    selectedPosition: null,
    description: '',
};
function TopIssueRow({ index, issues, updateCallback, row }) {
    const [state, setState] = useState(row);
    useEffect(() => {
        setState(row);
    }, [row]);

    const topicAuto = useRef(null);
    const positionAuto = useRef(null);

    if (!issues) {
        return <></>;
    }

    const onChangeField = (item, key) => {
        const newState = {
            ...state,
            [key]: item,
        };
        if (key === 'selectedTopic') {
            newState.selectedPosition = null;
        }
        setState(newState);
        if (key !== 'description') {
            updateCallback(newState, index);
        }
    };

    const onBlurField = (val, key) => {
        onChangeField(val, key);
        const newState = {
            ...state,
            [key]: val,
        };

        updateCallback(newState, index);
    };

    const clearRow = () => {
        setState(initialState);
        const ele = topicAuto.current.getElementsByClassName(
            'MuiAutocomplete-clearIndicator',
        )[0];
        if (ele) ele.click();

        const ele2 = positionAuto.current.getElementsByClassName(
            'MuiAutocomplete-clearIndicator',
        )[0];
        if (ele2) ele2.click();
        updateCallback(initialState, index);
    };

    return (
        <div className="mb-8 md:mb-4" key={index}>
            <div className='grid grid-cols-12 gap-3 items-center'>
                <div className="col-span-1">
                    {index + 1}.
                </div>
                <div className="col-span-11 md:col-span-3">
                    <Autocomplete
                        size="small"
                        options={issues}
                        getOptionLabel={(item) => item?.name}
                        fullWidth
                        ref={topicAuto}
                        value={state.selectedTopic}
                        renderInput={(params) => (
                            <TextField {...params} label="Topic" variant="outlined" />
                        )}
                        onChange={(e, item) => onChangeField(item, 'selectedTopic')}
                    />
                </div>
                <div className="col-span-6 md:col-span-3">
                    <Autocomplete
                        size="small"
                        options={state.selectedTopic?.positions || []}
                        getOptionLabel={(item) => item?.name}
                        fullWidth
                        ref={positionAuto}
                        value={state.selectedPosition}
                        renderInput={(params) => (
                        <TextField {...params} label="Position" variant="outlined" />
                        )}
                        onChange={(e, item) => onChangeField(item, 'selectedPosition')}
                        disabled={!state.selectedTopic}
                    />
                </div>
                <div className="col-span-65 md:col-span-4">
                    <TextField
                        size="small"
                        fullWidth
                        multiline
                        inputProps={{ maxLength: 300 }}
                        value={state.description}
                        label="Description"
                        variant="outlined"
                        onChange={(e) => onChangeField(e.target.value, 'description')}
                        onBlur={(e) => onBlurField(e.target.value, 'description')}
                    />
                </div>
                <div className="col-span-1">
                    <FaTrash size={18} onClick={clearRow} />
                </div>
            </div>
        </div>
    );
}

export default TopIssueRow;
