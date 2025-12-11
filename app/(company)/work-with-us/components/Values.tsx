'use client'
import React, { useState } from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import MaxWidth from '@shared/layouts/MaxWidth'

import styles from './Values.module.scss'

interface Card {
  title: string
  front: string
  back: string
  color: string
}

const cards: Card[] = [
  {
    title: 'People First',
    front: '',
    back: 'Our priority is to make systems serve people, not the other way around. We center on our shared humanity and integrate diverse perspectives in pursuit of the greater good.',
    color: '#5C11C2',
  },
  {
    title: 'Direct, Open and Honest',
    front: '',
    back: 'Anti-political in all the right ways: we operate with integrity, engage in direct civil discourse and openly give and receive honest feedback.',
    color: '#FE0F6E',
  },
  {
    title: 'Empowered Ownership',
    front: '',
    back: 'We are high-agency problem solvers – independent thinkers, empowered with freedom to act, and responsibility to deliver results that advance our mission.',
    color: '#093D74',
  },
  {
    title: 'Iterate for Impact',
    front: '',
    back: 'We work with urgency and purpose. We rapidly ideate, test, learn and improve everything we do to maximize positive impact.',
    color: '#62BB47',
  },
  {
    title: 'Fun Is Fuel',
    front: '',
    back: "Our work is hard. That's why having fun, celebrating each other and our successes is important. It fuels our humanity, keeping us optimistic and connected. Besides, everybody loves a good party!",
    color: '#F8593F',
  },
]

function Values(): React.JSX.Element {
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const handleSelected = (index: number) => {
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
