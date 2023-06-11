import Tabs from '@shared/utils/Tabs';
import { AiOutlineFlag } from 'react-icons/ai';

const labels = [
  <div key="overview" className="flex items-center">
    <AiOutlineFlag />
    <div className="ml-2 font-medium">Overview</div>
  </div>,
  'Overview2',
];

export default function TabsSection() {
  const panels = [<div key="1">1</div>, <div key="2">2</div>];
  return (
    <section>
      <Tabs tabLabels={labels} tabPanels={panels} />
    </section>
  );
}
