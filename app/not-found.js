import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center">
      <h2>Not Found</h2>
      <p className="mb-20 mt-3">Could not find requested resource</p>
      <Image
        src="/images/logo-hologram.svg"
        data-cy="logo"
        width={145}
        height={32}
        alt="GOOD PARTY"
        priority
      />
    </div>
  );
}
