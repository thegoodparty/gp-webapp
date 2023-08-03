'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { Button } from '@mui/material';
import { FaPencilAlt, FaTrashAlt, FaCopy } from 'react-icons/fa';
import DeleteAction from './DeleteAction';
import DuplicateAction from './DuplicateAction';
import RenameAction from './RenameAction';

export default function Actions({ name, updatedAt, slug }) {
  const [showMenu, setShowMenu] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  console.log('sluggy', slug);

  return (
    <div className="flex justify-center relative">
      <BsThreeDotsVertical
        onClick={() => {
          setShowMenu(!showMenu);
        }}
        className=" text-xl cursor-pointer"
      />
      {showMenu && (
        <>
          <div
            className="fixed h-screen w-screen top-14 left-0"
            onClick={() => {
              setShowMenu(false);
            }}
          />

          <div className="absolute flex flex-col z-50 right-0 min-w-[270px] h-auto bg-primary text-gray-800 rounded-xl shadow-md transition">
            <RenameAction key={slug} />

            <DuplicateAction key={slug} />

            <span className="w-full height-1 border-b border-indigo-500 ml-3 mr-3"></span>

            {/* todo: add key to table as hidden field. use key to delete */}
            <DeleteAction key={slug} />
          </div>
        </>
      )}
    </div>
  );
}
