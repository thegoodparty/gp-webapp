'use client';
import AlertDialog from '@shared/utils/AlertDialog';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { deleteThread } from './ajaxActions';
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper';

export default function DeleteThread({ chat }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const toggleShow = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const { name, threadId } = chat;

  const showDelete = (e) => {
    e.stopPropagation();
    trackEvent(EVENTS.AIAssistant.ChatHistory.ClickMenu);
    setShowAlert(true);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    trackEvent(EVENTS.AIAssistant.ChatHistory.ClickDelete);
    await deleteThread(threadId);
    window.location.reload();
  };
  return (
    <div className="relative">
      <BsThreeDotsVertical
        onClick={toggleShow}
        className=" text-xl cursor-pointer"
      />
      {showMenu && (
        <>
          <div
            className="fixed h-screen w-screen top-14 left-0"
            onClick={toggleShow}
          />
          <div className="absolute bg-primary-main p-2 rounded-xl shadow-lg z-10 right-2 top-2 min-w-[240px]">
            <div
              className="p-2 hover:bg-white hover:bg-opacity-10 hover:rounded transition-colors"
              onClick={showDelete}
            >
              Delete
            </div>
          </div>
        </>
      )}
      <AlertDialog
        open={showAlert}
        handleClose={() => {
          setShowAlert(false);
        }}
        redButton={false}
        title="Delete Chat"
        description={`Are you sure you want to delete "${name}"`}
        handleProceed={handleDelete}
        proceedLabel="Delete"
      />
    </div>
  );
}
