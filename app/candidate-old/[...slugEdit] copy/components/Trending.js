'use client';
import React from 'react';
import { candidateHash } from '/helpers/candidateHelper';
import { IoMdShareAlt } from 'react-icons/io';

import styles from './Trending.module.scss';
import ShareCandidate from './Header/ShareCandidate';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { candidateColor } from 'helpers/candidateHelper';

export default function Trending({ candidate }) {
  const brightColor = candidateColor(candidate);
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.h3}>Get ‘em trending, tag posts with</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className={styles.hash}>#{candidateHash(candidate)}</div>
        <div>
          <div className={styles.row}>
            <ShareCandidate candidate={candidate}>
              <BlackButtonClient
                style={{
                  backgroundColor: brightColor,
                  borderColor: brightColor,
                }}
              >
                <div className="flex items-center font-black">
                  <div className="mr-6">POST</div> <IoMdShareAlt size={24} />
                </div>
              </BlackButtonClient>
            </ShareCandidate>
          </div>
        </div>
      </div>
    </div>
  );
}
