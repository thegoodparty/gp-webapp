'use client';
import Pill from '@shared/buttons/Pill';

import Modal from '@shared/utils/Modal';
import Image from 'next/image';

import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import styles from './CampaignPlan.module.scss';
import UserAvatar from '@shared/user/UserAvatar';
import { getUserCookie } from 'helpers/cookieHelper';
import TextField from '@shared/inputs/TextField';

export default function AiModal({ initialText }) {
  const [showModal, setShowModal] = useState(true);
  const [text, setText] = useState(initialText);
  const [state, setState] = useState({
    improveQuery: '',
  });

  const user = getUserCookie(true);

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  return (
    <>
      <div onClick={() => setShowModal(true)}>
        <Pill>
          <div className="flex items-center">
            <FaEdit />
            <div className="ml-2">Edit</div>
          </div>
        </Pill>
      </div>
      <Modal closeCallback={() => setShowModal(false)} open={showModal}>
        <div className="p-4" style={{ maxWidth: '960px', minWidth: '300px' }}>
          <h3 className="text-3xl font-black mb-9 text-center">
            Edit your campaign plan
          </h3>
          <div className="mt-3 flex">
            <div className="w-10 h-10 shrink-0 mr-3 ">
              <Image
                src="/images/campaign/ai-icon.svg"
                alt="GP-AI"
                width={40}
                height={40}
              />
            </div>
            <div
              className={`px-5 py-1 border border-zinc-200 rounded-t-lg rounded-br-lg ${styles.plan}`}
            >
              <div dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          </div>
          <div className="flex mt-10">
            <div className="w-10 h-10 shrink-0 mr-3 ">
              <UserAvatar user={user} />
            </div>
            <div className="w-full">
              <TextField
                label="Ask the Good Party AI to add, remove, or change something"
                onChange={(e) => onChangeField('improveQuery', e.target.value)}
                value={state.improveQuery}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
