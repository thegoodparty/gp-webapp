import styles from './Hero.module.scss';
export default function Hero() {
  return (
    <div>
      <h1 className="text-4xl font-black mt-8 mb-5 lg:text-6xl lg:mt-12 lg:mb-7">
        Flexible plans to help{' '}
        <span className="relative">
          <span className="relative z-10">grow</span>{' '}
          <span className={styles.yellow} />
        </span>
        and{' '}
        <span className="relative">
          <span className="relative z-10">scale</span>{' '}
          <span className={styles.yellow} />
        </span>
        civic engagement campaigns
      </h1>
      <h2 className="text-xl mb-12 max-w-3xl lg:mb-14">
        Whether you&apos;re starting up a local grassroots effort or building a
        national movement, we have customizable plans to help you get engaged
        and make an impact.
      </h2>
    </div>
  );
}
