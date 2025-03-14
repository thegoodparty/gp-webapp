'use client';

import Button from '@shared/buttons/Button';
import { FaPlus } from 'react-icons/fa';
import { useState } from 'react';
import Modal from '@shared/utils/Modal';
import RenderInputField from '@shared/inputs/RenderInputField';
import H2 from '@shared/typography/H2';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';
const createSurvey = async (payload) => {
  const resp = await clientFetch(apiRoutes.ecanvasser.surveys.create, payload);
  return resp.data;
};
export default function CreateSurvey({ teams = [], createCallback }) {
  const teamOptions = teams.map((team) => team.name);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fields = [
    {
      label: 'Name',
      key: 'name',
      type: 'text',
      required: true,
    },
    {
      label: 'Description',
      key: 'description',
      type: 'text',
      required: true,
      rows: 6,
    },
    { label: 'Team', key: 'team', type: 'select', options: teamOptions },
    {
      label: 'Status',
      key: 'status',
      type: 'select',
      options: ['Published', 'Unpublished'],
    },
    {
      label: 'Require a signature when contact completes this survey',
      key: 'requiresSignature',
      type: 'checkbox',
    },
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    team: '',
    status: 'Unpublished',
    requiresSignature: false,
  });

  const handleSubmit = async () => {
    setIsLoading(true);

    let team;
    if (formData.team && formData.team !== '') {
      team = teams.find((t) => t.name === formData.team);
    }
    let payload = {
      name: formData.name,
      description: formData.description,
      teamId: team?.id,
      status: formData.status === 'Published' ? 'Live' : 'Not Live',
      requiresSignature: formData.requiresSignature,
    };
    await createSurvey(payload);
    createCallback();
    setFormData({
      name: '',
      description: '',
      team: '',
      status: 'Unpublished',
      requiresSignature: false,
    });

    setIsLoading(false);
    setIsOpen(false);
  };
  const canSubmit = !isLoading && formData.name && formData.description;

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <div className="flex items-center">
          <FaPlus className="mr-2" />
          <div>Create a Survey</div>
        </div>
      </Button>
      <Modal open={isOpen} closeCallback={() => setIsOpen(false)}>
        <div className="w-[80vw] max-w-[640px]">
          <H2 className="mb-6">Create a Survey</H2>
          <form>
            {fields.map((field) => (
              <div key={field.name}>
                <RenderInputField
                  field={field}
                  value={formData[field.key]}
                  onChangeCallback={(key, value) =>
                    setFormData({ ...formData, [key]: value })
                  }
                />
              </div>
            ))}
            <div className="flex justify-end mt-6 items-center">
              <Button color="neutral" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleSubmit}
                className="ml-4"
                disabled={!canSubmit}
                loading={isLoading}
              >
                Create Survey
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
