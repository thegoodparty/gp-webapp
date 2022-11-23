/**
 *
 * ElectedOfficeSelector
 *
 */

import React, { useState, useEffect } from 'react';
import TextField from '@shared/inputs/TextField';
import Select from '@mui/material/Select';
import { FaTrash } from 'react-icons/fa';

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

function ElectedOfficeSelector({ application, updateApplicationCallback }) {
    const [state, setState] = useState([
        {
        fromYear: '',
        toYear: '',
        office: '',
        },
    ]);

    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (
            application?.candidate?.electedOffices &&
            application.candidate.electedOffices.length > 0
        ) {
            const existingOffices = [...application.candidate.electedOffices];
            existingOffices.push({
                fromYear: '',
                toYear: '',
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
            lastRow.fromYear === '' &&
            lastRow.toYear === '' &&
            lastRow.office === ''
        ) {
            newState.push({
            fromYear: '',
            toYear: '',
            office: '',
            });
        }
        }
        newState[index] = {
            ...newState[index],
            [key]: e.target.value,
        };
        setState(newState);

        if (
            newState[index].fromYear !== '' &&
            newState[index].toYear !== '' &&
            newState[index].fromYear > newState[index].toYear
        ) {
            setShowError(index);
        } else {
            setShowError(false);
        }
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
        if (showError === false) {
        updateApplicationCallback(application.id, {
            ...application,
            candidate: {
                ...application.candidate,
                electedOffices: newState,
            },
        });
        }
    };
    return (
        <>
        {state.map((row, index) => (
            <div className="bg-neutral-100 p-3 rounded-lg mb-2" key={index}>
                <div className='grid grid-cols-12 gap-2 items-center'>
                    <div className="col-span-6 md:col-span-3">
                        <Select
                            className="bg-white"
                            native
                            value={row.fromYear}
                            fullWidth
                            variant="outlined"
                            onChange={e => {
                                onChangeField('fromYear', e, index);
                            }}
                            onBlur={save}
                        >
                            <option value="">From Year...</option>
                            {years.map(op => (
                            <option value={op} key={op}>
                                {op}
                            </option>
                            ))}
                        </Select>
                    </div>
                    <div className="col-span-6 md:col-span-4">
                        <Select
                            className="bg-white"
                            native
                            value={row.toYear}
                            fullWidth
                            variant="outlined"
                            onChange={e => {
                            onChangeField('toYear', e, index);
                            }}
                            onBlur={save}
                        >
                            <option value="">To Year...</option>
                            {years.map(op => (
                            <option value={op} key={op}>
                                {op}
                            </option>
                            ))}
                        </Select>
                    </div>
                    <div className="col-span-11 md:col-span-4">
                        <TextField
                            className="bg-white"
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
                </div>{' '}
                {index === showError && (
                    <div className="text-red-600 mt-2">&quot;To Year&quot; can&apos;t be smaller than &quot;From Year&quot;</div>
                )}
            </div>
        ))}
        </>
    );
}


export default ElectedOfficeSelector;
