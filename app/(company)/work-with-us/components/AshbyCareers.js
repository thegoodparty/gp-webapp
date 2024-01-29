'use client';
import React, { useEffect } from 'react';
import styles from './AshbyCareers.module.scss';

function AshbyCareers() {
  useEffect(() => {
    if (!window.ashbyJobsOptions) {
      const script = document.createElement('script');
      script.src = 'https://jobs.ashbyhq.com/goodparty/embed';
      document.body.appendChild(script);
    }
  }, []);
  return (
    <section className={styles.wrapper}>
      <h2 data-cy="opening-title" className={styles.h2}>
        Current Openings
      </h2>
      <div id="ashby_embed" className="max-w-lg" />
    </section>
  );
}

AshbyCareers.propTypes = {};

export default AshbyCareers;
