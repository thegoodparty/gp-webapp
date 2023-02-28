import Help from './Help';
import Hero from './Hero';
import Steps from './Steps';

export default function Dashboard(props) {
  return (
    <div className="bg-slate-100 min-h-[calc(100vh-80px)] pt-8">
      <Hero {...props} />
      <Steps {...props} />
      <Help />
    </div>
  );
}
