import Carousel from '@shared/inputs/Carousel';

const sections = [
  {
    title: 'Social Impact Consultant',
    subtitle: 'Good Party Certified',
    name: 'Peter H. - Independent',
    description:
      '“A harmless next step to figure out ways to potentially launch my own campaign or to run.”',
    img: '/images/run-for-office/peter.jpg',
  },
  {
    name: 'Breanna S. - Independent',
    title: 'Fintech Founder',
    subtitle: 'Good Party Academy Graduate',
    description:
      "“[Until Good Party Academy] I didn't feel like there were a lot of resources out there that gave you a clear understanding of the process of starting a campaign”",
    img: '/images/run-for-office/breanna.jpg',
  },
  {
    name: 'Carlos R. - Independent',
    title: 'Regulatory Writer',
    subtitle: 'Good Party Academy Graduate',
    description:
      '“The most valuable part about good party academy for me has been the knowledge that I can do this”',
    img: '/images/run-for-office/carlos.jpg',
  },
  {
    name: 'Victoria M. - Independent',
    title: 'Elementary School Teacher',
    subtitle: 'Good Party Academy Graduate',
    description:
      "“You're very personable, it's conversational, but you're also learning”",
    img: '/images/run-for-office/victoria.jpg',
  },
];

export default function Testimonials() {
  return (
    <div className="flex justify-center mt-20">
      <Carousel sections={sections} />
    </div>
  );
}
