import PortalPanel from '@shared/layouts/PortalPanel';
import OnboardingWrapper from '../../../shared/OnboardingWrapper';
import PledgeButton from './PledgeButton';

export default function PledgePage(props) {
  return (
    <OnboardingWrapper {...props}>
      <PortalPanel color="#ea580c" smWhite>
        <h3 className="font-black text-xl italic mb-8">Good Party Pledge</h3>
        (this is the old pledge)
        <ol className="mt-2 list-decimal">
          <li>
            <div className="font-black">Honest</div>
            <ul>
              <li>
                Good Certified candidates are committed to serving with utmost
                integrity, and using technology to be open, transparent and
                responsive representatives of the people.
              </li>
              <li>
                I pledge to serve transparently and to be accountable and
                responsive to the people - including to the extent possible to:
                <br />
                <ul>
                  <li>
                    Openly share my calendar, and to have my meetings on public
                    time be live-streamed, closed-captioned, archived and
                    searchable.
                  </li>
                  <li>
                    {' '}
                    Allocate a reasonable portion of official and campaign
                    resources to the technology (e.g. mobile apps, phone, body
                    cam, Youtube, Facebook Live, etc.) necessary to do so.
                  </li>
                  <li>
                    Push for transparency and accountability in all government
                    spending and accounting, including the use of technologies
                    for such purposes.
                  </li>
                </ul>
              </li>
              <li>
                I pledge that, if elected, I will always work to champion or
                support anti-corruption policies that enable more competition
                and choices in elections and transparency and accountability in
                government - including but not limited to examples such as:
                <br />
                <ul>
                  <li>
                    Rank-choice voting, non-partisan primaries, ending
                    gerrymandering, proportional representation, closing the
                    revolving door from politics to lobbying and eliminating
                    influence of dark money.
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <div className="font-black">Independent</div>
            Good Certified candidates are not Republican or Democratic
            politicians. They are independent-minded people from across the
            political spectrum, dedicated to advancing the priorities of their
            constituents.
            <ul>
              <li>
                I pledge to disaffiliate from the Democratic or Republican
                Parties and declare myself an independent or alternative party
                candidate for office.
              </li>
              <li>
                I pledge that, if elected, I will NOT pay membership dues or
                otherwise engage in fundraising for either of the two major
                political party committees while in office.
              </li>
              <li>
                I pledge that, if elected, I will remain independent of partisan
                politics and be open to working with all sides to the benefit of
                my constituents.
              </li>
            </ul>
          </li>
          <li>
            <div className="font-black">Independent</div>
            <ul>
              <li>
                I pledge that the majority of my support will come from living
                people and individual donors, NOT from corporations, unions,
                political action committees, or other non-living entities.
              </li>
              <li>
                I pledge to run a grass-roots campaign, centered on ideas,
                earned media and word-of-mouth promotion, so that I’m dependent
                on the people, not on big-money and special interests.
              </li>
              <li>
                I pledge that after I’m elected I will stay connected to my
                constituency using technology and tools that ensure my decisions
                on important issues and legislation are informed by their best
                ideas and interests.
              </li>
            </ul>
          </li>
        </ol>
        <PledgeButton slug={props.slug} campaign={props.campaign} />
      </PortalPanel>
    </OnboardingWrapper>
  );
}
