'use client';
import TeamSection from './TeamSection';

export const TEAM_MEMBERS = [
  {
    name: 'Farhad Mohit',
    role: 'Founder',
    img: 'https://assets.goodparty.org/team/farhad-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/farhad-party.jpg',
    partyRole: 'Burner',
  },
  {
    name: 'Žak Tomich',
    role: 'Chief Executive Officer',
    img: 'https://assets.goodparty.org/team/zak-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/zak-party.jpg',
    partyRole: 'Dad Joker',
  },
  {
    name: 'Victoria Mitchell',
    role: 'Chief Operating Officer',
    img: 'https://assets.goodparty.org/team/victoria-goodparty.jpg',
    flipImg: 'https://assets.goodparty.org/team/victoria-party.jpg',
    partyRole: 'Responsibly Wild Wanderer',
  },
  {
    name: 'Tomer Almog',
    role: 'Chief Technology Officer',
    img: 'https://assets.goodparty.org/team/tomer-gp2.jpg',
    flipImg: 'https://assets.goodparty.org/team/tomer-party.jpg',
    partyRole: 'Peaceful Warrior',
  },
  {
    name: 'Rob Booth',
    role: 'Head of Field and Mobilization',
    img: 'https://assets.goodparty.org/team/rob-goodparty.jpg',
    flipImg: 'https://assets.goodparty.org/team/rob-party.jpg',
    partyRole: 'Rockstar',
  },
  {
    name: 'Jared Alper',
    role: 'Political Director',
    img: 'https://assets.goodparty.org/team/jared-goodparty.jpg',
    flipImg: 'https://assets.goodparty.org/team/jared-party.jpg',
    partyRole: 'Improviser',
  },
  {
    name: 'Mateo Wardenaar',
    role: 'Director of Product Management',
    img: 'https://assets.goodparty.org/team/matthew-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/matthew-party.jpg',
    partyRole: 'Social Storyteller',
  },
  {
    name: 'Jack Nagel',
    role: 'Marketing Manager',
    img: 'https://assets.goodparty.org/team/jack-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/jack-party.png',
    partyRole: 'Curious Plant Dad',
  },
  {
    name: 'Martha Gakunju',
    role: 'People & Culture Coordinator',
    img: 'https://assets.goodparty.org/team/martha-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/martha-party.jpg',
    partyRole: 'Safari-er',
  },
  {
    name: 'Taylor Murray',
    role: 'Senior Fullstack Developer',
    img: 'https://assets.goodparty.org/team/taylor-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/taylor-party.png',
    partyRole: 'Good Vibes',
  },
  {
    name: 'Quinn McCully',
    role: 'Community Manager',
    img: 'https://assets.goodparty.org/team/quinn-goodparty.jpg',
    flipImg: 'https://assets.goodparty.org/team/quinn-party.jpg',
    partyRole: 'Explorer',
  },
  {
    name: 'Kennedy Mason',
    role: 'Social Media Manager',
    img: 'https://assets.goodparty.org/team/kennedy-goodparty.jpg',
    flipImg: 'https://assets.goodparty.org/team/kennedy-party.jpg',
    partyRole: 'Adventurer',
  },
];

export default function Team() {
  return <TeamSection TEAM_MEMBERS={TEAM_MEMBERS} title="Good Party Team" />;
}
