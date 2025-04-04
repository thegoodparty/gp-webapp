'use client'
import React, { useState } from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import MaxWidth from '@shared/layouts/MaxWidth'

import styles from './Values.module.scss'

const cards = [
  {
    title: 'We Are',
    front: 'Honest, Open and Mission-driven',
    back: 'We are good people on a noble mission. We are a home for all who share our vision and passion to disrupt the corruption in our political system.',
    color: '#5C11C2',
  },
  {
    title: 'We Believe',
    front: 'People are Good',
    back: 'Embracing diverse perspectives and identities is our strength. When people come together to focus on our shared humanity, we can transform the system that is pulling us apart.',
    color: '#FE0F6E',
  },
  {
    title: 'We Create',
    front: 'Results that inspire and grow our movement',
    back: 'Creativity and iterative growth are the backbone of our mission. Our ultimate measure of success is a more hopeful society, achieved by mobilizing our movement through a credible plan and actions towards change.',
    color: '#093D74',
  },
  {
    title: 'We Love',
    front: 'Freedom and owning responsibility for all that we do',
    back: 'Self-sovereignty, independent thinking and accountability are necessary for creating something good. Our movement is built by free-thinkers who challenge the status quo to make a positive impact.',
    color: '#62BB47',
  },
  {
    title: 'We Party',
    front: 'Together with a purpose',
    back: 'Fun and joy is what makes life worth living. We celebrate each other, take pride in ourselves and what we are building, and commit to spreading GoodParty.org every which way possible.',
    color: '#F8593F',
  },
]

function Values() {
  const [selected, setSelected] = useState({})
  const handleSelected = (index) => {
    setSelected({
      ...selected,
      [index]: !selected[index],
    })
  }
  return (
    <div className={styles.wrapper}>
      <MaxWidth>
        <h2 className={styles.h2}>Team values</h2>
        <div className={styles.cardsWrapper}>
          {cards.map((card, index) => (
            <div
              key={card.title}
              className={
                selected[index]
                  ? `${styles.card} ${styles.selected}`
                  : styles.card
              }
              onClick={() => handleSelected(index)}
            >
              <div
                className={`${styles.inner} inner`}
                style={{ backgroundColor: card.color }}
              >
                <div className={styles.front}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <div className={styles.cardContent}>{card.front}</div>
                  <div className={styles.arrow}>
                    <HiArrowNarrowRight />
                  </div>
                </div>
                <div className={styles.back}>{card.back}</div>
              </div>
            </div>
          ))}
        </div>
      </MaxWidth>
    </div>
  )
}

export default Values
