export default function mapCampaignToCandidate(campaign) {
  if (!campaign) {
    return false;
  }
  const {
    slug,
    details,
    campaignPlan,
    pathToVictory,
    color,
    image,
    twitter,
    instagram,
    facebook,
    linkedin,
    tiktok,
    snap,
    twitch,
    hashtag,
    website,
    customIssues,
    endorsements,
    launchStatus,
  } = campaign;
  const {
    firstName,
    lastName,
    party,
    state,
    office,
    pastExperience,
    occupation,
    funFact,
    district,
  } = details || {};
  const { slogan, aboutMe, why } = campaignPlan || {};

  const { voteGoal, voterProjection } = pathToVictory || {};
  return {
    slug,
    firstName,
    lastName,
    party,
    state,
    office,
    slogan,
    about: aboutMe,
    why,
    pastExperience,
    occupation,
    funFact,
    voteGoal: parseInt(voteGoal) || 0,
    voterProjection: parseInt(voterProjection) || 0,
    color,
    image,
    twitter,
    instagram,
    facebook,
    linkedin,
    tiktok,
    snap,
    twitch,
    hashtag,
    website,
    district,
    customIssues,
    endorsements,
    launchStatus,
  };
}
