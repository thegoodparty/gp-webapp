import Slider from 'react-slick';

import WinnerSnippet from './WinnerSnippet';
import H5 from '@shared/typography/H5';
import { numberFormatter } from 'helpers/numberHelper';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

export default function FilteredWinnerList({ campaigns }) {
  // split campaigns to and array of arrays each has 9 campaigns max
  const splitCampaigns = campaigns.reduce((acc, campaign, index) => {
    const i = Math.floor(index / 9);
    if (!acc[i]) {
      acc[i] = [];
    }
    acc[i].push(campaign);
    return acc;
  }, []);
  console.log('splitCampaigns', splitCampaigns);
  return (
    <div className="pb-4">
      <H5 className="mb-6">{numberFormatter(campaigns.length)} candidates</H5>
      <Slider {...settings}>
        {splitCampaigns.map((slideCampaigns, index) => (
          <div key={index} className="pb-12">
            <div className="grid grid-cols-12 gap-4">
              {slideCampaigns.map((campaign) => (
                <div key={campaign.slug} className="col-span-12 lg:col-span-4">
                  <WinnerSnippet campaign={campaign} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
