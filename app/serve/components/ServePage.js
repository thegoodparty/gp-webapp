import ServeLayout from '../shared/ServeLayout';

export default function ServePage({ pathname }) {
  return (
    <ServeLayout pathname={pathname}>
      <div>ServePage</div>
    </ServeLayout>
  );
}
