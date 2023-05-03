import BlackResourceCard from 'app/(candidate)/onboarding/shared/BlackResourceCard';
import { MdOutlineFileDownload } from 'react-icons/md';
const cards = [
  {
    title: 'Mastering Political Social Media',
    description:
      'How to create a social media plan, engage with followers, handle negative feedback, and measure success.',
    link: '/blog/article/mastering-social-media-content-for-your-campaign',
  },
  {
    title: 'Building a Strong Political Brand on...',
    description:
      'Practical advice on how to create a compelling and consistent political brand.',
    link: '/blog/article/getting-verified-to-run-political-ads-on-facebook',
  },
  {
    title: 'A Step-by-Step Guide to Getting...',
    description:
      'How you can request and obtain verification on social media platforms',
    link: '/blog/article/creating-content-to-generate-fundraising-and-volunteers',
  },
];
export default function Resources() {
  return (
    <div>
      <div className="font-black text-2xl mb-4 mt-16">RESOURCES</div>
      <div className="p-7 bg-white rounded-2xl grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5  gap-4">
        {cards.map((card) => (
          <BlackResourceCard key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
}
