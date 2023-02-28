import Help from './Help';
import Hero from './Hero';
import Steps from './Steps';

export default function Dashboard(props) {
  return (
    <div className="bg-slate-100  pt-8">
      <Hero {...props} />
      <Steps {...props} />
      <Help />
    </div>
  );
}
