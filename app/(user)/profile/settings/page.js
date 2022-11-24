import Link from 'next/link';
import { cookies } from 'next/headers';

import ImageSection from './components/ImageSection';
import PersonalSection from './components/PersonalSection';
import PasswordSection from './components/PasswordSection';
import DeleteSection from './components/DeleteSection';

export default function Page() {
  return (
    <>
      <ImageSection />
      <PersonalSection />
      <PasswordSection />
      <DeleteSection />
    </>
  );
}
