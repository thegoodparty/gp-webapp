import YouTubeLazyPlayer from '@shared/utils/YouTubeLazyPlayer';
import { youtubeParser } from 'helpers/videoHelper';

export default function BioSection({ candidate }) {
  const { headline, youtube, about, color, website } = candidate;
  const youtubeId = youtubeParser(youtube);

  return (
    <section>
      <h3 className="text-xl font-black mb-7 lg:text-2xl" data-cy="bio-title">
        {headline}
      </h3>
      {youtubeId && <YouTubeLazyPlayer id={youtubeId} />}
      <h3
        className="text-xl font-black mt-9 mb-3 lg:text-2xl"
        data-cy="bio-about"
      >
        About the candidate
      </h3>
      <div dangerouslySetInnerHTML={{ __html: about }} />
      <br />
      {website && (
        <>
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="underline"
            id="candidate-website"
            data-cy="bio-website"
          >
            Visit Candidate Website
          </a>
          <br />
          <br />
          &nbsp;
        </>
      )}
    </section>
  );
}
