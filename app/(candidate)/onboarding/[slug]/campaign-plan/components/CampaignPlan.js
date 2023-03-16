'use client';
import Pill from '@shared/buttons/Pill';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useEffect, useState } from 'react';
import styles from './CampaignPlan.module.scss';
import { FaSave } from 'react-icons/fa';
import AiModal from './AiModal';
import Typewriter from 'typewriter-effect';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import Link from 'next/link';

async function generateAI(subSectionKey, key) {
  try {
    const api = gpApi.campaign.onboarding.ai.create;
    return await gpFetch(api, { subSectionKey, key });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

async function regenerateAI(subSectionKey, key, prompt) {
  try {
    const api = gpApi.campaign.onboarding.ai.edit;
    return await gpFetch(api, { subSectionKey, key, chat: prompt });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function CampaignPlan({ campaign }) {
  const [plan, setPlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const { campaignPlan } = campaign;
  useEffect(() => {
    if (!campaignPlan || !campaignPlan.plan) {
      createInitialAI();
    } else {
      setPlan(campaignPlan.plan);
      setLoading(false);
    }
  }, [campaignPlan]);

  const createInitialAI = async () => {
    const { chatResponse } = await generateAI('campaignPlan', 'plan');
    setPlan(chatResponse);
    setLoading(false);
  };

  const handleSubmit = async (improveQuery) => {
    console.log('handling submit', improveQuery);
    setLoading(true);
    const chat = [
      { role: 'assistant', content: plan },
      { role: 'user', content: improveQuery },
    ];
    setPlan(false);
    const { chatResponse } = await regenerateAI('campaignPlan', 'plan', chat);
    setPlan(chatResponse);
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className={`bg-white p-6 my-6 rounded-xl ${styles.plan}`}>
          <Typewriter
            options={{
              delay: 1,
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString(plan)
                // .callFunction(() => {
                //   onChangeField('showButtons', true);
                // })

                .start();
            }}
          />
          {/* <div dangerouslySetInnerHTML={{ __html: plan }} /> */}
          <div className="flex items-center justify-center mt-6 border-t border-t-slate-300 pt-6">
            <AiModal submitCallback={handleSubmit} />
            <Link href={`/onboarding/${campaign.slug}/dashboard/1`}>
              <Pill>
                <div className="flex items-center">
                  <FaSave className="mr-2" /> Save and Continue
                </div>
              </Pill>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

/*
Original

Why I'm Running

Tomer Almog is running for US Senate as an Independent because he believes that the politics of division and partisanship are fundamentally undermining our democracy. He is committed to advocating for policies that benefit all Americans, not just those belonging to a certain political party.

Tomer Almog is an experienced professional with a track record of success in his field. As a result, he is prepared to bring a data-driven approach to policy making, focusing on real-world solutions rather than empty slogans or partisan talking points.

Path to Victory

Tomer Almog's path to victory is built on three pillars: message, mobilization, and money. His message of unity and cooperation will resonate with voters across the political spectrum. Tomer Almog will work tirelessly to mobilize voters and volunteers, building a ground game that will turn out voters on election day. Finally, he will raise the money necessary to run a competitive campaign that reaches voters across the state.

Communications Strategy

Tomer Almog's communications strategy will focus on reaching voters where they are. This means a robust digital presence that includes social media, email, and text messaging. Tomer Almog will also conduct traditional grassroots organizing, holding town hall meetings and canvassing neighborhoods. Finally, he will work with traditional media outlets, pitching editorials and appearing on radio and television shows.

Fundraising and Budget

Tomer Almog's fundraising and budget plan revolves around building a coalition of donors who care about his message of unity and cooperation. This means a grassroots fundraising operation that will rely on small donations from individuals across the country. Tomer Almog's campaign will also seek larger donations from campaign finance committees and political action committees that share his values. In total, his campaign aims to raise $5 million dollars.

Timeline and Goals

Tomer Almog's campaign has created a detailed timeline counting down to Election Day. His campaign began with announcements and early fundraising efforts, laying the groundwork for the months ahead. This will be followed by a period of staffing up and developing materials like signage, brochures, and digital ads. The bulk of the campaign effort will be focused on voter outreach and mobilization in the last few weeks leading up to the election.

Mobilizing Voters and Volunteers

Mobilizing voters and volunteers is a key part of Tomer Almog's campaign strategy. His campaign will use a combination of traditional canvassing, social media outreach, and peer-to-peer texting to keep voters engaged and excited about supporting his campaign. As election day nears, his campaign will prioritize a "get out the vote" strategy designed to turn out voters who support his message and vision for the future.

Get Out the Vote Tactics

Tomer Almog's get out the vote tactics will focus on creating a sense of urgency among supporters. His campaign will work to educate supporters on the importance of casting their ballot and the impact of their vote. In the final weeks leading up to the election, the campaign will ramp up its efforts, knocking on doors, making phone calls, and sending texts to remind supporters to vote on Election Day. Tomer Almog's campaign is committed to winning this race and will do everything in its power to ensure victory on November 6th.

Tomer Almog Opponent: Barak Obama About Themselves A fresh voice for unity and cooperation. A proven leader with decades of experience. About Their Opponent Barak Obama is a career politician who is out of touch with the needs of everyday Americans. Tomer Almog is an unknown quantity with no experience in government.
Important Dates and Deadlines

September 1: Campaign Kickoff Event

September 15: Last Day to Register to Vote

October 5: Early Voting Begins

November 5: Last Day for Early Voting

November 6: Election Day

Get Out the Vote Goals

Goal: Knock on 50,000 Doors in the Final Week of the Campaign

Goal: Make 100,000 Phone Calls to Supporters

Goal: Send 1 Million Text Messages Reminding Supporters to Vote

*/
