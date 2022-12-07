/**
 *
 * Update
 *
 */

import React, { useState } from 'react';
import Image from 'next/image';
import NewEndorsementForm from './NewEndorsementForm';

// import NewEndorsementForm from './NewEndorsementForm';

export default function Endorsement({
  endorsement,
  last,
  deleteCallback,
  updateEndorsements,
  candidate,
}) {
  const [showEdit, setShowEdit] = useState(false);
  const { summary, id, image, link, title } = endorsement;

  const handleUpdate = (updated) => {
    setShowEdit(false);
  };

  return (
    <div
      key={id}
      className="break-word py-8 border-b border-b-gray-200 "
      style={last ? { borderBottom: 'none' } : {}}
      data-cy="endorsement-item"
    >
      <div className="text-right">
        {showEdit ? (
          <div
            className="inline-block text-zinc-600 underline cursor-pointer py-3 px-2"
            onClick={() => setShowEdit(false)}
            data-cy="endorsement-edit-cancel"
          >
            Cancel
          </div>
        ) : (
          <>
            <div
              className="inline-block text-zinc-600 underline cursor-pointer py-3 px-2"
              onClick={() => deleteCallback(endorsement)}
              data-cy="endorsement-edit-delete"
            >
              Delete
            </div>
            <div
              className="inline-block text-zinc-600 underline cursor-pointer py-3 px-2"
              onClick={() => setShowEdit(true)}
              data-cy="endorsement-edit"
            >
              Edit
            </div>
          </>
        )}
      </div>
      <div className="grid grid-cols-12 gap-6">
        {image && (
          <div className="col-span-12 lg:col-span-4">
            <div className="relative h-[200px]">
              <Image
                src={image}
                layout="fill"
                className="object-cover"
                alt=""
              />
            </div>
          </div>
        )}
        <div
          className={`col-span-12 ${
            image ? 'lg:col-span-8' : 'lg:col-span-12'
          }`}
          data-cy="endorsement-info"
        >
          <div className="font-black mb-4 color-black">{title}</div>
          {summary}
          <br />
          {link}
        </div>
      </div>
      {showEdit && (
        <NewEndorsementForm
          existingEndorsement={endorsement}
          updateEndorsementCallback={handleUpdate}
          updateEndorsements={updateEndorsements}
          candidate={candidate}
        />
      )}
    </div>
  );
}
