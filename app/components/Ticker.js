'use client';
import React, { useState, useEffect } from 'react';
import styles from './Ticker.module.scss';

import { numberFormatter } from '/helpers/numberHelper';
import { getCookie, setCookie } from '/helpers/cookieHelper';

const randomNum = () => Math.random() * 15000 + 1500;
const randomIncrement = () => Math.floor(Math.random() * 3 + 1);

const REDUCED_COUNT = 100;

const Ticker = ({ cookieName = 'ticker' }) => {
  const totalFollowers = 1000; //TODO: fetch from server
  const initTotal = 89852 + totalFollowers;
  const [transition, setTransition] = useState(false);
  const [reduced, setReduced] = useState(REDUCED_COUNT);
  const [timeout1, setTimeout1] = useState(null);
  const [timeout2, setTimeout2] = useState(null);

  const [followers, setFollowers] = useState(initTotal - reduced);
  const [prevFollowers, setPrevFollowers] = useState(initTotal - reduced);
  useEffect(() => {
    let cookieValue = getCookie(cookieName);

    if (cookieValue) {
      cookieValue = parseInt(cookieValue, 10);
      setReduced(cookieValue);
      tick(cookieValue);
    } else {
      tick(reduced);
    }
  }, []);

  const tick = (tickReduce) => {
    if (tickReduce <= 0) {
      setFollowers(initTotal);
      return;
    }
    setTransition(true);
    clearTimeout(timeout1);
    const timeout1Id = setTimeout(() => {
      const rnd = randomNum();
      const increment = randomIncrement();
      setPrevFollowers(initTotal - tickReduce);
      setFollowers(initTotal - tickReduce - increment);
      setReduced(tickReduce - increment);
      setCookie(cookieName, tickReduce - increment, 0.03);
      clearTimeout(timeout2);
      const timeout2Id = setTimeout(() => {
        tick(tickReduce - increment);
      }, rnd);
      setTimeout2(timeout2Id);
      setTransition(false);
    }, 250);
    setTimeout1(timeout1Id);
  };
  const num = numberFormatter(followers);
  const digits = num ? num.split('') : [];

  const prev = numberFormatter(prevFollowers);
  const prevDigits = prev ? prev.split('') : [];
  return (
    <span>
      {digits.map((digit, index) => (
        <span
          key={index}
          className={`${
            transition && digit !== prevDigits[index] ? 'not-active' : 'active'
          } ${styles.digit}`}
        >
          {digit}
        </span>
      ))}
    </span>
  );
};

export default Ticker;
