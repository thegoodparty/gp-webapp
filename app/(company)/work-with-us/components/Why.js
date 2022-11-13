/**
 *
 * Why
 *
 */

import React from 'react';
import styles from './Why.module.scss';

const points = [
  'Be part of a mission to solve the biggest problem of our time – fixing our democracy, so all other problems can be solved.',

  'We’re a Public Benefit Corporation that prioritizes social impact over profit.',

  'Fully funded for our mission. No stressing over whether the next round of funding will come through. Focus on making an impact. That’s what matters here.',

  'Work where and how you like, on a fully remote team spread across the country.',

  'Join a diverse group of people with views across the political spectrum.',

  '100% coverage of health, dental, and vision benefits for you and your dependents.',

  'We encourage you to take time off to recharge and have an unlimited PTO (sick and vacation) policy. This is a marathon, not a sprint. We believe a work-life balance is needed to get there.',
];

function Why() {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.h2}>Why apply?</h2>
      {points.map((point, index) => (
        <div className={styles.point} key={point}>
          <div className={styles.number}>{index + 1}</div>
          <div>{point}</div>
        </div>
      ))}
    </section>
  );
}

export default Why;
