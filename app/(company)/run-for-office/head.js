import GpHead from '@shared/layouts/GpHead';
import Script from 'next/script';

export default function Head({ params }) {
  return (
    <>
      <GpHead
        title="Empowering people to change politics for good."
        description="We help independent-minded people who want to get things done run for office. Chat with an expert to learn how."
        slug="/run-for-office"
        image="https://assets.goodparty.org/dashboard.jpg"
      />
    </>
  );
}
