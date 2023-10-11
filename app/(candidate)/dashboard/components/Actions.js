import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import DeleteAction from './DeleteAction';

export default function Actions({ id }) {
  const [showMenu, setShowMenu] = useState(false);

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
          <div className="absolute bg-white px-4 py-3 rounded-xl shadow-lg z-10 left-24 top-3">
            <DeleteAction id={id} />
          </div>
        </>
      )}
    </div>
  );
}
