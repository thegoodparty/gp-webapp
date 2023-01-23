import PurpleButton from '@shared/buttons/PurpleButton';
import Link from 'next/link';

const faqs = [
  {
    title: 'What is Good Party?',
    content:
      "Good Party is not a political party. We're a group of full-time and volunteer technologists, politicos, content creators, and concerned citizens working together to empower alternatives to Democrats and Republicans.",
    buttonLabel: 'MORE ABOUT US',
    link: '/about',
  },
  {
    title: 'Who are Good Party candidates?',
    content:
      'All Good Party Certified candidates take the Good Party Pledge. This means that they are all independent or third-party, take a majority of their funds from real people not corporate interests, and run on ideas that serve the people, planet, peace, and prosperity.',
    buttonLabel: 'FIND CANDIDATES',
    link: '/candidates',
  },
];

export default function FaqsSection() {
  return (
    <section className="mt-14  border-b border-neutral-300">
      <h3 className="font-black text-4xl">FAQs</h3>
      {faqs.map((faq) => (
        <div className="my-14 lg:w-[75%]" key={faq.link}>
          <h4 className="font-black text-xl mb-3">{faq.title}</h4>
          <div className="text-2xl mb-10">{faq.content}</div>
          <Link href={faq.link}>
            <PurpleButton>{faq.buttonLabel}</PurpleButton>
          </Link>
        </div>
      ))}
    </section>
  );
}
