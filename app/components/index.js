import { createServerContext } from 'react';
import MaxWidth from '../shared/layouts/MaxWidth';
import Hero from './Hero';

export default function HomePage() {
  const childProps = { totalFollowers: 100 };
  return (
    <>
      <MaxWidth>
        <Hero totalFollowers={100} />
      </MaxWidth>
    </>
  );
}
