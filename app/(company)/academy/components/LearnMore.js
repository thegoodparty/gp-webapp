import RedPurpleSection from '@shared/landing-pages/RedPurpleSection';

export default function LearnMore({ openModalCallback }) {
  return (
    <RedPurpleSection withPadding>
      <h3 className="text-3xl">Want to learn more?</h3>
      <p className="text-lg mt-6">
        Find a time to meet with our team to get your questions answered and
        spot reserved.
      </p>
      <div
        className="mt-9 bg-white px-10 py-4 font-bold text-black rounded text-2xl cursor-pointer relative z-20"
        id="academy-learn-more-get-started"
        onClick={openModalCallback}
      >
        GET STARTED
      </div>
    </RedPurpleSection>
  );
}
