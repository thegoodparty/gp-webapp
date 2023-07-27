import H3 from '@shared/typography/H3';

export default function MapSection({ map }) {
  return (
    <section className="my-16">
      <H3>Door knocking map</H3>
      <div className="h-96 rounded-2xl overflow-hidden mt-4">
        <iframe src={map} width="100%" height="384px" />
      </div>
    </section>
  );
}
