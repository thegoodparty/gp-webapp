import { ImQuotesLeft, ImQuotesRight } from 'react-icons/im';
import TextPanel from './TextPanel';

export default function AboutSection(props) {
  const { candidate, color, editMode } = props;
  let { headline, slogan, about } = candidate;
  slogan = slogan || headline || '';
  return (
    <section className="bg-white p-6 my-3  rounded-2xl">
      <div className="flex items-center font-black text-3xl">
        <div className="w-8 text-right">
          <ImQuotesLeft size={30} style={{ color }} />
        </div>
        <TextPanel
          text={slogan}
          {...props}
          section="campaignPlan"
          sectionKey="slogan"
        />
        <div className="w-8 text-left">
          <ImQuotesRight size={30} style={{ color }} />
        </div>
      </div>
      <div>
        <h3 className="font-bold mt-5 mb-3 text-xl">About the candidate</h3>
        <TextPanel
          text={about}
          {...props}
          section="campaignPlan"
          sectionKey="aboutMe"
        />
      </div>
    </section>
  );
}
