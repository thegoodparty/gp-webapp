import WhatsNext from '../../components/WhatsNext';
import MaxWidth from '@shared/layouts/MaxWidth';

export default function Page() {
  return (
    <div className="mt-14 text-2xl">
      <MaxWidth>
        <h1
          className="mb-4 text-3xl font-black lg:text-4xl"
          data-cy="manifesto-title"
        >
          The #goodparty Manifesto
        </h1>
        <h2
          className="italic font-black text-2xl lg:text-3xl text-stone-500"
          data-cy="manifesto-subtitle"
        >
          for the love of us over <u>It</u>!
        </h2>
        <br />
        <br />
        <strong>
          What is{' '}
          <u>
            <i>It</i>
          </u>
          ?
        </strong>
        <ul>
          <li data-cy="manifesto-item-01">
            <i>It</i> is the system that tears away our hopes.
          </li>
          <li data-cy="manifesto-item-02">
            <i>It</i> is the money that corrupts our government.
          </li>
          <li data-cy="manifesto-item-03">
            <i>It</i> is the media that degrades our minds.
          </li>
          <li data-cy="manifesto-item-04">
            <i>It</i> is the doom loop that darkens our souls.
          </li>
          <li data-cy="manifesto-item-05">
            <i>It</i> is{' '}
            <a
              href="https://mindlevelup.wordpress.com/2016/10/23/canaanite-gods-explained/"
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="underline"
              data-cy="molock-link"
            >
              Moloch
            </a>
            , the dark force of downward spirals.
          </li>
          <li data-cy="manifesto-item-06">
            <i>It</i> is what wants us divided and hopeless.
          </li>
        </ul>

        <br />
        <br />
        <strong>
          Don&apos;t let{' '}
          <u>
            <i>It</i>
          </u>{' '}
          define us!
        </strong>
        <ul>
          <li data-cy="manifesto-item-11">
            <i>It</i> doesn&apos;t live.
          </li>
          <li data-cy="manifesto-item-12">
            <i>It</i> doesn&apos;t love.
          </li>
          <li data-cy="manifesto-item-13">
            <i>It</i> has no friends.
          </li>
          <li data-cy="manifesto-item-14">
            <i>It</i> has no family.
          </li>
          <li data-cy="manifesto-item-15">
            <i>It</i> has no dreams.
          </li>
          <li data-cy="manifesto-item-16">
            <i>It</i> has no consciousness.
          </li>
        </ul>

        <br />
        <br />
        <strong>
          Let&apos;s do it, to{' '}
          <u>
            <i>It</i>
          </u>
          ! (with a #goodparty)
        </strong>
        <ul>
          <li data-cy="manifesto-item-21">We party to have fun.</li>
          <li data-cy="manifesto-item-22">
            We party to get together with friends.
          </li>
          <li data-cy="manifesto-item-23">We party to lighten our minds.</li>
          <li data-cy="manifesto-item-24">We party to brighten our souls.</li>
          <li data-cy="manifesto-item-25">We party to lift each other up.</li>
          <li data-cy="manifesto-item-26">We party to be human.</li>
        </ul>
        <br />
        <br />
        <p className="mb-12">
          Humans need community. A #goodparty is the simplest form of community.
          When we get together for a #goodparty, we&apos;re exercising our basic
          right of assembly in the most fun and human way possible. A #goodparty
          is our fundamental right to life, liberty and the pursuit of
          happiness. At a #goodparty, we eat, we drink, we dance. We laugh, we
          love, we talk. We share our ideas, our values and our culture. We
          create a space for all to feel good, welcome and empowered. At a
          #goodparty together, we find that we are all we really need. And, we
          find that we have more in common among us than{' '}
          <u>
            <i>It</i>
          </u>{' '}
          wants us to believe.
          <br />
          <br />
          Most importantly, in a democracy, when enough of us come together we
          gain real power, because we can coordinate together and inspire each
          other. We can create hope. We realize that if we can party together,
          then we can unite together to do much more. Soon, because time flies
          when we&apos;re having fun, we&apos;ll notice that we have enough
          #goodparty people to vote{' '}
          <u>
            <i>It</i>
          </u>{' '}
          out, and the good among us, in!
          <br />
          <br />
          It&apos;s time to get this #goodparty started!
        </p>
      </MaxWidth>{' '}
      <WhatsNext />
    </div>
  );
}
