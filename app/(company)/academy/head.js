import GpHead from '@shared/layouts/GpHead';
import Script from 'next/script';

export default function Head({ params }) {
  return (
    <>
      <GpHead
        title="Good Party Academy | GOOD PARTY"
        description="Learn how to run for office in our new master class for FREE.  We'll teach you how to run a winning indie or 3rd party campaign from launch through election day."
        slug="/academy"
        image="https://assets.goodparty.org/academy.jpg"
      />
    </>
  );
}
