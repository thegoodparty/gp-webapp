/**
 *
 * Hero
 *
 */

import React from 'react'

import styles from './Hero.module.scss'

function Hero(): React.JSX.Element {
  return (
    <section className={styles.wrapper}>
      <h1 className={styles.h1}>
        Work{' '}
        <span className="relative">
          <span className={styles.up}>with us!</span>
          <span className={styles.yellow} />
        </span>
      </h1>
      <div className={styles.content}>
        GoodParty.org is <strong>not a political party</strong>. We build tools
        to change the rules, and are mobilizing a movement of people to disrupt
        the corrupt two-party system.
        <br />
        <br />
        Our team is 100% remote, with diverse backgrounds and political beliefs.
        We work hard on our mission but care about each other, and our own well
        being too.
        <br />
        <br />
        If creatively disrupting politics for good sounds like a challenge
        you&apos;re up for, check out the roles we&apos;re looking to fill right
        now!
      </div>
    </section>
  )
}

export default Hero
