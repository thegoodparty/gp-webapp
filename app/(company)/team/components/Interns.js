'use client';
import TeamSection from './TeamSection';

// Interns
export const TEAM_MEMBERS = [
  {
    name: 'Cameron Farrar',
    role: 'Social Media Marketing Intern',
    img: 'https://assets.goodparty.org/team/cameron-good1.jpg',
    flipImg: 'https://assets.goodparty.org/team/cameron-Party1.jpg',
    partyRole: 'Social Media Marketing Intern',
  },
  {
    name: 'Julian Delamaza',
    role: 'Field and Politics Intern',
    img: 'https://assets.goodparty.org/team/julian-goodparty.jpg',
    flipImg: 'https://assets.goodparty.org/team/julian-party.jpg',
    partyRole: 'Field and Politics Intern',
  },
  {
    name: 'JayneLynn Sullivan',
    role: 'Social Media Intern',
    img: 'https://assets.goodparty.org/team/jaynelynn-goodparty.jpg',
    flipImg: 'https://assets.goodparty.org/team/jaynelynn-party.jpg',
    partyRole: 'Social Media Intern',
  },
];

export default function Interns() {
  return <TeamSection TEAM_MEMBERS={TEAM_MEMBERS} title="Interns" />;
}
