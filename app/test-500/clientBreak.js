'use client';

import { useEffect, useState } from 'react';

export default function ClientBreak() {
  const [state, setState] = useState(false);
  useEffect(() => {
    setState(true);
  }, []);
  return <div>testing 500 {state ? thisShouldFail : 'should compile'}</div>;
}
