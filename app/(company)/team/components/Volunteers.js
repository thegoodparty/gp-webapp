export const VOLUNTEERS = [
  {
    name: 'Navid Aslani',
    link: 'https://www.linkedin.com/in/navidaslani/',
    role: 'Operations',
  },
  {
    name: 'Kai Gradert',
    link: 'https://www.linkedin.com/in/kaigradert/',
    role: 'Product / Design',
  },
  {
    name: 'Jeehye Jung',
    link: 'https://www.linkedin.com/in/jeehye-jung-6b4b0361',
    role: 'Social Media / Instagram',
  },
  {
    name: 'Kam Kafi',
    link: 'https://www.linkedin.com/in/kamkafi/',
    role: 'Creator Relations',
  },
  {
    name: " Brian O'Neil",
    link: 'https://www.linkedin.com/in/brian-o-neil-a8b5283/',
    role: ' HR / FEC / Finance',
  },
  {
    name: 'Gobi Rahimi',
    link: 'https://www.linkedin.com/in/gobi-m-rahimi-3725721/',
    role: 'Creator',
  },
  {
    name: 'Jean Rousseau',
    link: 'https://www.linkedin.com/in/jeanrousseau/',
    role: 'Field Operations',
  },
];

export default function Volunteers() {
  return (
    <div className="py-12 px-2">
      <h2
        className="text-2xl font-black my-10"
        data-cy="volunteer-section-title"
      >
        Volunteers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {VOLUNTEERS.map((volunteer) => (
          <div
            className="my-2 text-lg"
            key={volunteer.name}
            data-cy="volunteer"
          >
            <a
              href={volunteer.link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              data-cy="volunteer-name"
            >
              <strong>{volunteer.name}</strong>
            </a>
            <div className="mt-3" data-cy="volunteer-role">
              {volunteer.role}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12" data-cy="join-form">
        If you&apos;re interested in volunteering your time and talent, join us!
        Please fill out{' '}
        <a
          href="https://join.goodparty.org/ambassador"
          target="_blank"
          rel="noopener noreferrer nofollow"
          data-cy="join-form-link"
        >
          {' '}
          this form
        </a>
        . <br />
        You can also email{' '}
        <a href="mailto:ask@goodparty.org" data-cy="contact-email-link">
          {' '}
          ask@goodparty.org
        </a>{' '}
        if you have any questions.
      </div>
    </div>
  );
}
