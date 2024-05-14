'use client';
import Body1 from '@shared/typography/Body1';
import { voterName } from './VoterInfo';
import { getUserCookie } from 'helpers/cookieHelper';

export default function TempScript(props) {
  const { voter } = props;
  const name = voterName(voter);
  const user = getUserCookie(true);
  console.log('user', user);
  const userName = `${user.firstName || ''} ${user.lastName || ''}`;
  return (
    <section>
      <Body1>
        <strong>Greeting:</strong>
        <br /> Is {name} home?
      </Body1>
      <Body1>
        Hi, my name is {userName}, and I&apos;m a volunteer for the independent
        movement. We&apos;ve been talking to your neighbors today about making
        people matter more than money in our democracy!
        <br />
        <br />
        <strong>Opening Statement:</strong>
        <br />
        We wanted to talk to you because we know you are registered as an
        independent voter-and you aren&apos;t alone-a majority of Americans are
        Independents like you and me, but independents face an uphill battle
        getting elected. We are just asking folks three questions.
        <br />
        <br />
        <hr />
        <br />
        <strong>QUESTION 1:</strong>
        <br />
        First, why do you think it is so much harder for independents to get
        elected?
        <br />
        <br />
        <strong>Listen and Acknowledge:</strong>
        <br /> (Allow for their response and echo their sentiments
        respectfully.) I hear you. Independents face challenges such as a lack
        of party infrastructure or big money to buy media and mind share. Plus,
        rules designed to keep them off the ballot. Plus, Dems have a jackass,
        Republicans have an elephant, but Indys do not have a recognizable brand
        or symbol of our own to rally support.
        <br />
        The good news is we&apos;re working to level the playing field on all
        these... but first, let me ask you:
        <br />
        <br />
        <hr />
        <br />
        <strong>QUESTION 2:</strong>
        <br />
        What would you say is the most important issue to you in the upcoming
        election?
        <br />
        <br />
        <strong>Educational Insight: </strong>
        <br />
        That is an important issue! We will only see progress on [THEIR ISSUE]
        if we start electing more independents who will put people before
        profit!
        <br />
        <br />
        We are working on leveling the playing field by providing free campaign
        tools to help independents run and win in local elections because 70% of
        state/local races go uncontested. Those races are the best chance for
        independents to build momentum through a wave of victories-they are also
        the elections a lot of voters tend to miss.
        <br />
        <br />
        <hr />
        <br />
        <strong>Question 3:</strong>
        <br />
        With that said, would you be interested in helping more independent
        candidates win?
        <br />
        <br />
        <strong>If Yes:</strong> Great! You can start by signing this postcard
        to yourself-which has been proven to boost turnout in local elections.
        We&apos;ll mail back as a pre-election reminder to vote your values and
        look into the state and local indys on your next ballot. Feel free to
        add a personal note about why you broke up with the two-party system in
        the first place.
        <br />
        <strong>IF No:</strong> I understand that might seem like a big step
        right now. Could I ask what&apos;s holding you back?
        <br />
        <br />
        <strong>Pushback after they shared their no reason:</strong>
        <br />
        [Start by reflecting to share that you listened, and understood.]
        <br />
        <br />
        <strong>Pushback:</strong>
        <br />
        &quot;Independents never win, so what&apos;s the point?&quot;
        <br />
        <strong>Response:</strong>
        <br />
        We are trying to change that and we are having some great results. We
        rolled out our tools in 2023 and since then we have been steadily
        racking up wins across the country. The tools and tech are working, and
        we are confident AZ can be a part of that momentum continuing.
        <br />
        <br />
        <strong>Pushback:</strong>
        <br />
        &quot;I don&apos;t know enough about any independent candidates.&quot;
        <strong>Response:</strong> &quot;We can help with that! I can provide
        information about local independents who align with your values. [Hand
        Sticker] Check us out here to learn more about local indy candidates
        near you and around the country.&quot;
        <br />
        <br />
        <strong>Pushback:</strong>
        <br /> &quot;My vote might just end up helping a candidate I don&apos;t
        like win.&quot; <br />
        <strong>Response:</strong>
        <br /> &quot;I understand being worried about the spoiler effect. I used
        to be worried about that too, but then I learned that as many as 70% of
        state and local offices are unopposed. That means they are defaulting to
        red or blue. This is why local elections are so important to growing the
        independent movement.
        <br />
        <br />
        <hr />
        <br />
        <br />
        <strong>Thank Them:</strong>
        <br />
        Thanks for your time! Here are some stickers. This is the symbol we are
        using to signal that people are over the two-party system. It has our
        website and a QR code for more about Good Party and the ways we support
        independent candidates. I am going to leave you enough to share a few
        with friends if you like what you see! Have a wonderful day!
        <br />
        <br />
        <strong>Note for Team:</strong>
        <br />
        <ul>
          <li>
            Always maintain a friendly, assumptive, but non-confrontational
            tone.
          </li>
          <li>Be respectful of all responses, whether or not they agree.</li>
          <li>Use the camera to document interactions only with consent.</li>
          <li>
            Ensure all materials, including postcards, are well-organized and
            presentable.
          </li>
          <li>
            Debrief as a team after the canvassing session to discuss learnings
            and potential improvements for future interactions.
          </li>
        </ul>
      </Body1>
    </section>
  );
}
