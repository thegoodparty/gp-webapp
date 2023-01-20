const points = [
  {
    title: 'Tell us about you!',
    description:
      'Connect with our team to help us learn basic information about you and your campaign:',
    ol: [
      'Who and where are you?',
      'Why are you interested in running?',
      'What office are you considering running for?',
    ],
  },
  {
    title: 'Meet your campaign coach',
    description:
      'Get expert feedback on your campaign’s viability and personalized data about your race and path to victory.',
  },
  {
    title: 'Get the Campaign Planning Tool',
    description:
      'Take the Good Party Pledge and get access to our cutting-edge Campaign Planning Tool.',
  },
  {
    title: 'Win with real support',
    description:
      'Learn how to earn grassroots support, volunteers and unlock in-district events and activities to win your election.',
  },
];

export default function Points() {
  return (
    <div className="py-6 grid grid-cols-12 gap-2">
      {points.map((point, index) => (
        <div className="col-span-12 lg:col-span-6" key={point.title}>
          <div className="text-5xl font-black flex">
            <div className="text-yellow-400 mr-3">{index + 1}</div>{' '}
            <div className="mb-12 lg:mb-24 lg:pr-12">
              {point.title}
              <div className="text-lg font-light mt-3">{point.description}</div>
              {point.ol && (
                <ol className="text-lg font-light mt-2 list-decimal">
                  {point.ol.map((li) => (
                    <li className="ml-4 pl-1 mb-1" key={li}>
                      {li}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
