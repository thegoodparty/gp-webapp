import MaxWidth from '@shared/layouts/MaxWidth';
import Header from './Header';

export default function CandidatePage(props) {
  return (
    <MaxWidth>
      <Header {...props} />
    </MaxWidth>
  );
}
