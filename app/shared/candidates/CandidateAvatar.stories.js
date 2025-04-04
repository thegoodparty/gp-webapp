import CandidateAvatar from './CandidateAvatar'

export default {
  title: 'Candidates/CandidateAvatar',
  component: CandidateAvatar,
  tags: ['autodocs'],
  args: {
    candidate: {
      firstName: 'John',
      lastName: 'Doe',
      image: 'https://i.pravatar.cc/100?u=goodparty123',
    },
  },
}

export const Default = {}

export const Empty = {
  args: {
    candidate: {
      firstName: 'John',
      lastName: 'Doe',
    },
  },
}
