'use client';
import React, { useEffect } from 'react';
import styles from './AshbyCareers.module.scss';
import Link from 'next/link';
import H2 from '@shared/typography/H2';

function AshbyCareers({ jobs }) {
  return (
    <section className={styles.wrapper}>
      <H2 data-cy="opening-title">Current Openings</H2>

      {jobs && jobs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Link href={`/work-with-us/${job.id}`} key={job.id}>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-violet-600">
                  {job.title}
                </h3>
                <p className="text-sm">
                  {job.departmentName} • {job.locationName} •{' '}
                  {job.employmentType}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

AshbyCareers.propTypes = {};

export default AshbyCareers;
