import EmailForm from '@shared/inputs/EmailForm';

export default function TeamHero() {
  return <section className="bg-secondary-light">
      <div className="px-4 py-8 font-medium">
        <h1 className="text-5xl leading-tight">Who is Good Party?</h1>
        <p className="text-2xl mb-3">We are a team of organizers, technologists, creators, and citizens with diverse backgrounds and political views</p>
        <EmailForm
          formId="5d84452a-01df-422b-9734-580148677d2c"
          pageName="Team Page"
          labelId="team-subscribe-form"
          label="Join the movement" />
      </div>
    </section>
}
