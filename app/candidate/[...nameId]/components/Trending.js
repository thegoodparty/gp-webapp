'use client';
import React, { useContext } from 'react';
import { candidateHash } from '/helpers/candidateHelper';
import { IoMdShareAlt } from 'react-icons/io';

import styles from './Trending.module.scss';
import PinkButtonClient from '@shared/buttons/PinkButtonClient';
// import Row from '../shared/Row';

export default function Trending({ candidate }) {
  // const { showShareModalCallback } = useContext(CandidateWrapperContext);
  const showShareModalCallback = () => {};

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.h3}>Get ‘em trending, tag posts with</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className={styles.hash}>#{candidateHash(candidate)}</div>
        <div>
          <div className={styles.row}>
            <PinkButtonClient onClick={showShareModalCallback}>
              <div className="flex items-center font-black">
                <div className="mr-6">POST</div> <IoMdShareAlt size={24} />
              </div>
            </PinkButtonClient>
          </div>
        </div>
      </div>
    </div>
  );
}
