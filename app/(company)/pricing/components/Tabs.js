'use client';
import { useState } from 'react';

export default function Tabs({ plans }) {
  const [active, setActive] = useState(plans[0].name);
  const handleClick = (name) => {
    setActive(name);
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
    </>
  );
}
