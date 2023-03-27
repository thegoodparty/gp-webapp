import GpHead from '@shared/layouts/GpHead';
import Script from 'next/script';

export default function Head({ params }) {
  return (
    <>
      <GpHead
        title="Good Party Academy | GOOD PARTY"
        description="Learn how to run for office in our new master class. We'll teach you how to run a winning independent campaign from launch to election day."
        slug="/academy"
        image="https://assets.goodparty.org/academy.jpg"
      />
    </>
  );
}
