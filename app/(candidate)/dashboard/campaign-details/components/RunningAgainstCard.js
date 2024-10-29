import { useState } from 'react';
import IconButton from '@shared/buttons/IconButton';
import { DeleteRounded, EditRounded } from '@mui/icons-material';
import RunningAgainstForm from './RunningAgainstForm';

export default function RunningAgainstCard({
  name,
  party,
  description,
  onDelete,
  onUpdate,
}) {
  const [showEdit, setShowEdit] = useState(false);

  function handleSave(newValues) {
    setShowEdit(false);
    onUpdate(newValues);
  }

  return (
    <div className="my-6 border rounded-xl p-4 border-gray-300 flex justify-between">
      {!showEdit ? (
        <>
          <div>
            <div className="font-bold mb-2">{name}</div>
            <div>{party}</div>
            <div>{description}</div>
          </div>
          <div>
            <IconButton
              title="Delete"
              className="flex items-center"
              color="error"
              onClick={onDelete}
            >
              <DeleteRounded />
            </IconButton>
            <IconButton
              title="Edit"
              className="flex items-center"
              onClick={() => setShowEdit(true)}
            >
              <EditRounded />
            </IconButton>
          </div>
        </>
      ) : (
        <RunningAgainstForm
          name={name}
          party={party}
          description={description}
          onCancel={() => setShowEdit(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
