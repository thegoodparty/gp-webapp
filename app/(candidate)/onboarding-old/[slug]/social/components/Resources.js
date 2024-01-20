import BlackResourceCard from 'app/(candidate)/onboarding-old/shared/BlackResourceCard';

export default function Resources({ cards }) {
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
