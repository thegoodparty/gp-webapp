/**
 *
 * OfficeSelector
 *
 */

import React, { useState, useEffect } from 'react';
import TextField from '@shared/inputs/TextField';
import Select from '@mui/material/Select';
import { FaTrash } from 'react-icons/fa';
import { states } from 'helpers/statesHelper';

const generateYears = () => {
    let currentYear = new Date().getFullYear();
    const years = [];
    const startYear = 1980;
    while (currentYear >= startYear) {
        years.push(currentYear--);
    }
    return years;
};

const years = generateYears();

function OfficeSelector({ application, updateApplicationCallback }) {
    const [state, setState] = useState([
        {
        year: '',
        state: '',
        office: '',
        },
    ]);

    useEffect(() => {
        if (
            application?.candidate?.offices &&
            application.candidate.offices.length > 0
        ) {
            const existingOffices = [...application.candidate.offices];
            existingOffices.push({
                year: '',
                state: '',
                office: '',
            });
            setState(existingOffices);
        }
    }, []);

    const onChangeField = (key, e, index) => {
        const newState = [...state];

        if (index === state.length - 1) {
        // updating last row
            const lastRow = state[index];
            if (
                lastRow.year === '' &&
                lastRow.state === '' &&
                lastRow.office === ''
            ) {
                newState.push({
                    year: '',
                    state: '',
                    office: '',
                });
            }
        }
        newState[index] = {
          ...newState[index],
            [key]: e.target.value,
        };
        setState(newState);
    };

    const removeRow = index => {
        const newState = [...state];
        newState.splice(index, 1);
        setState(newState);
        save();
    };

    const save = () => {
        const newState = [...state];
        newState.splice(newState.length - 1, 1); // remove last empty row
        updateApplicationCallback(newState);
        updateApplicationCallback(application.id, {
            ...application,
            candidate: {
                ...application.candidate,
                offices: newState,
            },
        });
    };
    return (
        <>
        {state.map((row, index) => (
            <div className="bg-neutral-100 p-3 rounded-lg mb-2" key={index}>
                <div className='grid grid-cols-12 gap-2 items-center'>
                    <div className="col-span-6 md:col-span-3">
                        <Select
                            className={"!bg-white"}
                            native
                            value={row.year}
                            fullWidth
                            variant="outlined"
                            onChange={e => {
                            onChangeField('year', e, index);
                            }}
                            onBlur={save}
                        >
                            <option value="">Year...</option>
                            {years.map(op => (
                            <option value={op} key={op}>
                                {op}
                            </option>
                            ))}
                        </Select>
                    </div>
                    <div className="col-span-6 md:col-span-4">
                        <Select
                            className={"!bg-white"}
                            native
                            value={row.state}
                            fullWidth
                            variant="outlined"
                            onChange={e => {
                            onChangeField('state', e, index);
                            }}
                            onBlur={save}
                        >
                            <option value="">State...</option>
                            {states.map(stateItem => (
                            <option
                                value={stateItem.abbreviation}
                                key={stateItem.abbreviation}
                            >
                                {stateItem.name}
                            </option>
                            ))}
                        </Select>
                    </div>
                    <div className="col-span-11 md:col-span-4">
                        <TextField
                            className="!bg-white"
                            name="Office sought"
                            variant="outlined"
                            value={row.office}
                            fullWidth
                            label="Office sought"
                            onChange={e => {
                                onChangeField('office', e, index);
                            }}
                            onBlur={save}
                        />
                    </div>
                    <div className="col-span-1 text-center">
                        {index !== state.length - 1 && (
                            <div className="p-1 cursor-pointer hover:text-bloack">
                                <FaTrash
                                    onClick={() => {
                                    removeRow(index);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ))}
        </>
    );
}


export default OfficeSelector;
