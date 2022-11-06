import './globals.css';
import HomePage from '/Components/shared/HomePage';
import TgpHelmet from '/Components/shared/TgpHelmet';

export default function Page() {
  return (
    <>
      <TgpHelmet
        title="GOOD PARTY | Free tools to change the rules and disrupt the corrupt."
        description="Not a political party, we’re building tools to change the rules, empowering creatives to mobilize community & disrupt the corrupt two-party system. Join us!"
      />
      <HomePage />
    </>
  );
}
