import MaxWidth from '@shared/layouts/MaxWidth'
import TogglePanel from '@shared/utils/TogglePanel'

interface Faq {
  q: string
  a: string
}

const faqs: Faq[] = [
  {
    q: 'How much of a time commitment is this? ',
    a: "Whether you've 2 minutes or 2 years - we've got a way for you to make a difference that fits your busy schedule and lifestyle! By volunteering for a few minutes per week from the comfort of your own home, you can amplify our message and help us challenge the stale two-party narrative.",
  },
  {
    q: 'Is GoodParty.org a political party?',
    a: 'NO! Our cheeky name is a subtle jab at the two major parties and also captures the fun spirit of our organization. Think of us as the platform and the movement for all independents and alternative/third parties across the political spectrum. We value having fun together as a meaningful way to make a change. Come party with a purpose!',
  },
  {
    q: "There aren't currently any GoodParty.org Certified candidates running in my area. Can I still get involved?",
    a: 'Absolutely! While we have IRL activities and volunteer opportunities in some areas with elections coming up, most of our ways to get involved and support our mission are remote opportunities and virtual events, so there is no need to change out of your pajamas!',
  },
  {
    q: 'Who are the candidates that I would be supporting by getting involved?',
    a: "Whoever you want! GoodParty.org has a wide range of candidates, and while it's unlikely that you'll agree with all of them, there will certainly be those you are inspired by and will want to support. Occasionally, we also spotlight specific candidates who need your help. If you want to see more people-powered candidates who you agree with get elected, they need your help! The two parties have big money on their side, but we've got the party!",
  },
  {
    q: 'Is this experience useful for a resume? ',
    a: 'Absolutely! Taking civic action, whether in an official role in our community or not, provides a great experience that you can speak to when applying for future opportunities. Volunteering is a useful way to build new skills and leadership experience that can fast-track your career.',
  },
  {
    q: 'Does everyone in your community share the same political beliefs?',
    a: "Not at all, and that's what makes it so interesting! As long as you respect everyone else and their views, we believe people are good and embrace diverse perspectives as a strength.",
  },
  {
    q: 'Are there any swag/merch giveaway opportunities?',
    a: "Yes! Members of our community proudly wear GoodParty.org swag, and we've got some seriously cute items to add to your wardrobe. As you continue to deepen your involvement as a volunteer, there are more opportunities for free swag!",
  },
  {
    q: 'Do I need any relevant experience or skills to get involved?',
    a: "Not at all. We understand that getting involved in the political world can be intimidating and feel very gatekeep-y. GoodParty.org is actually the ideal place for someone tiptoeing into civic engagement for the first time, and we'll make you feel welcome.",
  },
  {
    q: "Isn't politics super boring and toxic?",
    a: "Not here! GoodParty.org was created exactly because politics is so messed up and unrewarding. We are all about bringing the party to politics and not just talking about things but actually creating results and growing our movement. We're here to change politics, for good and want to have fun doing it!",
  },
  {
    q: 'Can I do in-person actions like talking to voters at local concerts, trivia nights, and knocking on doors?',
    a: 'If GoodParty.org Certified candidates are running in your area, we will have IRL events and opportunities for you to get involved! Check out our list of candidates here to find out if any are running in your neck of the woods.',
  },
  {
    q: "I have more questions that aren't answered here! Who can answer them?",
    a: 'Grab a drink with us, and a full-time team member will get your questions answered! Sign up here to grab a virtual drink with one of our community leaders. These are full-time members of our team who know everything there is to know about GoodParty.org and the best ways to get you plugged in!',
  },
]

export default function FAQs(): React.JSX.Element {
  return (
    <section className=" bg-indigo-50 pb-12 pt-12 md:mt-0">
      <MaxWidth>
        <h3 className="font-semibold text-5xl text-center pb-6">FAQ</h3>
        {faqs.map((faq, index) => (
          <TogglePanel key={`faq${index}`} label={faq.q}>
            {faq.a}
          </TogglePanel>
        ))}
      </MaxWidth>
    </section>
  )
}
