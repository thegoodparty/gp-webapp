import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './Hero';
import LaunchChecklist from './LaunchChecklist';

export default function LaunchPage({ campaign }) {
  const { slug } = campaign;

  return (
    <div className="bg-slate-100 py-2">
      <MaxWidth>
        <Hero />

        <LaunchChecklist campaign={campaign} />
      </MaxWidth>
    </div>
  );
}
