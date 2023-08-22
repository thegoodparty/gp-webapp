'use client';
import { useState } from 'react';
import { BsThreeDotsVertical, BsThreeDots } from 'react-icons/bs';
import { Button } from '@mui/material';
import { FaPencilAlt, FaTrashAlt, FaCopy } from 'react-icons/fa';
import DeleteAction from './DeleteAction';
// import DuplicateAction from './DuplicateAction';
import RenameAction from './RenameAction';
import { kebabToCamel } from '/helpers/stringHelper';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import CircularProgress from '@mui/material/CircularProgress';

export default function Actions(props) {
  let { name, slug, tableVersion, setDocumentName, documentKey, updatedAt } =
    props;

  const [showMenu, setShowMenu] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  if (tableVersion === false) {
    documentKey = kebabToCamel(slug);
  }

  return (
    <>
      <div className="flex justify-center relative">
        {tableVersion === true &&
        updatedAt !== undefined &&
        updatedAt != 'Invalid Date' ? (
          <div>
            <BsThreeDots
              onClick={() => {
                setShowMenu(!showMenu);
              }}
              className="text-xl cursor-pointer mr-10"
            />
          </div>
        ) : // otherwise if tableVersion === true and updatedAt === undefined, then it's a new document
        tableVersion === true &&
          (updatedAt === undefined || updatedAt == 'Invalid Date') ? (
          <div
            onClick={() => {
              setShowMenu(!showMenu);
            }}
            className="mr-10 hidden md:block"
          >
            <CircularProgress size={20} />
          </div>
        ) : (
          // otherwise if tableVersion === false, then it's a documentMode
          <>
            <div
              className="ml-3 md:hidden"
              onClick={() => {
                setShowMenu(!showMenu);
              }}
            >
              <SecondaryButton size="medium">
                <div className="flex items-center whitespace-nowrap p-1">
                  <BsThreeDots className="text-sm" />
                  &nbsp;
                </div>
              </SecondaryButton>
            </div>

            <div
              onClick={() => {
                setShowMenu(!showMenu);
              }}
              div
              className="ml-5 hidden md:block"
            >
              <SecondaryButton size="medium">
                <div className="flex items-center whitespace-nowrap p-1">
                  <BsThreeDots className="text-sm" />
                  &nbsp;
                </div>
              </SecondaryButton>
            </div>
          </>
        )}
        {showMenu && (
          <>
            <div
              className="fixed h-screen w-screen top-14 left-0"
              onClick={() => {
                setShowMenu(false);
              }}
            />

            <div className="absolute flex flex-col z-50 right-0 min-w-[270px] h-auto bg-primary text-gray-800 rounded-xl shadow-md transition">
              <Button
                onClick={() => {
                  setShowRename(true);
                  setShowMenu(false);
                }}
              >
                <span className="text-gray-800 hover:text-slate-50 no-underline font-normal normal-case hover:bg-indigo-700 w-full rounded-xl p-3">
                  <div className="whitespace-nowrap text-lg flex items-center w-full">
                    <FaPencilAlt className="text-[14px]" />
                    <div className="ml-3 font-sfpro text-[17px]">Rename</div>
                  </div>
                </span>
              </Button>

              {/* <Button
                onClick={() => {
                  setShowDuplicate(true);
                  setShowMenu(false);
                }}
              >
                <span className="text-gray-800 hover:text-slate-50 no-underline font-normal normal-case hover:bg-indigo-700 w-full rounded-xl p-3">
                  <div className="whitespace-nowrap text-lg flex items-center w-full">
                    <FaCopy className="text-[14px]" />
                    <div className="ml-3 font-sfpro text-[17px]">Duplicate</div>
                  </div>
                </span>
              </Button> */}

              <span className="w-full height-1 border-b border-indigo-500 ml-3 mr-3"></span>

              <Button
                onClick={() => {
                  setShowDelete(true);
                  setShowMenu(false);
                }}
              >
                <span className="text-red-400 no-underline font-normal normal-case hover:bg-indigo-700 w-full rounded-xl p-3">
                  <div className="whitespace-nowrap text-lg flex items-center w-full">
                    <FaTrashAlt className="text-[14px]" />
                    <div className="ml-3 font-sfpro text-[17px]">Delete</div>
                  </div>
                </span>
              </Button>
            </div>
          </>
        )}
      </div>

      <RenameAction
        documentKey={documentKey}
        showRename={showRename}
        setShowRename={setShowRename}
        setDocumentName={setDocumentName}
        tableVersion={tableVersion}
        documentName={name}
      />

      {/* <DuplicateAction
        documentKey={documentKey}
        showDuplicate={showDuplicate}
        setShowDuplicate={setShowDuplicate}
      /> */}

      <DeleteAction
        documentKey={documentKey}
        showDelete={showDelete}
        setShowDelete={setShowDelete}
      />
    </>
  );
}
