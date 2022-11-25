/**
 *
 *Endorsements
 *
 */

import Image from 'next/image';
import React, { useContext } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

import styles from './Endorsements.module.scss';

export default function Endorsements({ candidate }) {
  const { endorsements } = candidate;
  if (endorsements?.length === 0) {
    return <></>;
  }

  return (
    <article className="mb-9">
      <div className="mb-4 lg:text-2xl lg:mb-6" data-cy="endorsement-title">
        Featured Endorsements
      </div>
      <div className="gap-2 " spacing={2}>
        {endorsements.map((item) => (
          <div className="flex" key={item.id} data-cy="endorsement-item">
            {item.image && (
              <div className=" mr-6">
                {
                  <Image
                    src={item.image}
                    height={80}
                    width={80}
                    style={{ objectFit: 'cover' }}
                    className="rounded-full mr-6"
                    data-cy="endorsement-item-img"
                    alt="Endorsement"
                  />
                }
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div
                data-cy="endorsement-item-title"
                className={`mb-3 break-word ${item.image && 'with-image'} ${
                  styles.summary
                }`}
              >
                <strong>{item.title}</strong>
              </div>
              <div
                data-cy="endorsement-item-summary"
                className={`break-word ${item.image && 'with-image'} ${
                  styles.summary
                }`}
              >
                {item.summary}
              </div>
              {item.link && (
                <div className="text-right mt-2">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    data-cy="endorsement-item-link"
                  >
                    Learn More <FaExternalLinkAlt size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
