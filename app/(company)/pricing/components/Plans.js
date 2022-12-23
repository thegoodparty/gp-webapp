'use client';

import Link from 'next/link';
import Pill from '@shared/buttons/Pill';
import BlackButton from '@shared/buttons/BlackButton';
import { useState } from 'react';

import styles from './Plans.module.scss';

const basicFeatures = [
  { title: 'Campaign Page', description: 'Introduce yourself to users' },
  {
    title: 'Milestone Tracker',
    description: 'To help you track your progress',
  },
  {
    title: 'Viability Meter',
    description: 'Give supporters hope by showing your campaign can win',
  },
  {
    title: 'The Feed',
    description:
      'Aggregate your social content in one convenient, easy to share place',
  },
  {
    title: 'Issues / Endorsers',
    description: 'Let people know where you stand and who stands with you',
  },
  {
    title: 'Campaign Updates & Notifications',
    description: 'Let followers know how they can get involved',
  },
  {
    title: 'Analytics',
    description: 'See how your page and content are performing',
  },
];

const plans = [
  {
    name: 'Starter',
    price: 'Free Trial*',
    link: '/run',
    subtitle: (
      <div>
        <i>*$5.99/mo. starting in 2024</i>
        <br />
        <br />
        Free tools to grow awareness and show viability
      </div>
    ),
    features: basicFeatures,
    buttonLabel: 'GET STARTED',
  },
  {
    name: 'Pro',
    price: '$19.99/mo',
    link: '/run',
    subtitle: 'Helping you stay connected and serve supporters while you serve',
    buttonLabel: 'COMING SOON',
    features: [
      ...basicFeatures,
      {
        title: 'Transparency Toolkit',
        description: 'Shared public calendar, meetings, documents and media',
      },
      {
        title: 'Crowd-voting',
        description:
          'Meaningful connection with constituents on issues that matter',
      },
      {
        title: 'Follower Follow-up',
        description:
          'Citizen relationship management tools for continued engagement',
      },
      {
        title: 'Data Insights',
        description: 'Deeper dive into your district and diverse constituency',
      },
    ],
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    link: '/contact',
    subtitle:
      'All-inclusive tools and built to scale national, grassroots movements for large organizations doing Good! Includes strategy and consulting services.',
    features: [],
    buttonLabel: 'CONTACT US',
  },
];

export default function Plans() {
  const [active, setActive] = useState(plans[0].name);

  const planStyle = (plan) => {
    let style = {};
    if (active === plan.name) {
      style.display = 'block';
    }
    return style;
  };

  return (
    <>
      <div className="lg:hidden">
        <div className="bg-neutral-300 mb-10 rounded-3xl flex items-center justify-between">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="py-3 px-5 rounded-3xl uppercase cursor-pointer"
              style={
                active === plan.name
                  ? {
                      color: '#fff',
                      backgroundColor: '#000',
                      cursor: 'initial',
                    }
                  : {}
              }
              onClick={() => setActive(plan.name)}
            >
              {plan.name}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 mb-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-8 rounded-3xl hidden lg:block lg:p-11 my-3 ${
              plan.name === 'Starter' && 'starter'
            } ${styles.plan}`}
            style={planStyle(plan)}
          >
            <div className="hidden lg:block">
              <Pill outlined={plan.name !== 'Starter'}>
                <div className="text-lg">{plan.name.toUpperCase()}</div>
              </Pill>
            </div>
            <div className={styles.price}>
              <h3 className="font-black text-5xl mb-10 lg:mt-14">
                {plan.price}
              </h3>
              <div className="mb-8">{plan.subtitle}</div>
            </div>
            <Link
              href={plan.link}
              passHref
              id={`pricing-get-started-${plan.name}`}
            >
              {plan.name === 'Starter' ? (
                <BlackButton style={{ width: '100%' }}>
                  <strong>{plan.buttonLabel}</strong>
                </BlackButton>
              ) : (
                <BlackButton
                  style={{ width: '100%', backgroundColor: '#d3d3d3' }}
                >
                  <strong>{plan.buttonLabel}</strong>
                </BlackButton>
              )}
            </Link>
            <br />
            <br />
            {plan.features.map((feature, index) => (
              <div key={feature.title} className="mt-6 text-zinc-600">
                <div className="font-black text-black mb-2">
                  {feature.title}
                </div>
                {feature.description}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
