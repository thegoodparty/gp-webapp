import './globals.css';
import HomePage from './components/index';
import JsonLdSchema from '@shared/layouts/JsonLdSchema';

export default function Page() {
  return (
    <>
      <JsonLdSchema />
      <HomePage />
    </>
  );
}
