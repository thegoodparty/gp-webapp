'use client';
import { useEffect, useState } from 'react';

export default function Test500() {
  const [state, setState] = useState(false);
  useEffect(() => {
    setState(true);
  }, []);
  return <div>testing {state ? 'loading' : tomer}</div>;
}
