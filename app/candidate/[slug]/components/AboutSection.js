import { ImQuotesLeft, ImQuotesRight } from 'react-icons/im';

export default function AboutSection({ candidate, color }) {
  const { headline, slogan, about } = candidate;
  return (
    <section className="bg-white p-6 my-3  rounded-2xl">
      <div className="flex items-center font-black text-3xl">
        <div className="w-8 text-right">
          <ImQuotesLeft size={30} style={{ color }} />
        </div>
        <>
          {slogan ? (
            <div
              className="px-2"
              dangerouslySetInnerHTML={{ __html: slogan }}
            />
          ) : (
            <div className="px-2">{headline || ''}</div>
          )}
        </>
        <div className="w-8 text-left">
          <ImQuotesRight size={30} style={{ color }} />
        </div>
      </div>
      <div>
        <h3 className="font-bold mt-5 mb-3 text-xl">About the candidate</h3>
        <div dangerouslySetInnerHTML={{ __html: about }} />
      </div>
    </section>
  );
}
