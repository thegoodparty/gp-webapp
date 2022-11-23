import './globals.css';
import HomePage from './components/index';
import { Suspense } from 'react';
import RegisterModal from '@shared/layouts/RegisterModal';

export default function Page({ searchParams }) {
  const registerRoute = searchParams.register;
  return (
    <>
      <HomePage />
      {registerRoute === 'true' && (
        <Suspense>
          <RegisterModal />
        </Suspense>
      )}
    </>
  );
}
