import Body1 from '@shared/typography/Body1';
import H3 from '@shared/typography/H3';
import ImageSection from './ImageSection';

export default function HeaderSection() {
  return (
    <div className="flex justify-between pb-6 border-b border-slate-300">
      <div>
        <H3>Settings</H3>
        <Body1 className="text-gray-600">
          Select your notification preferences
        </Body1>
      </div>
      <ImageSection />
    </div>
  );
}
