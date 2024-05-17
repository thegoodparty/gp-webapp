import EmailForm from '@shared/inputs/EmailForm';

export default function TeamHero() {
  return (
    <section className="bg-secondary-light px-4 py-8 font-medium lg:p-24 lg:text-center">
      <h1 className="text-5xl leading-tight lg:text-8xl lg:leading-tight">
        Who is GoodParty.org?
      </h1>
      <p className="text-2xl mb-3 lg:text-4xl lg:leading-tight">
        We are a team of organizers, technologists, creators, and citizens with
        diverse backgrounds and political views
      </p>
      <div className="lg:mx-auto lg:max-w-[512px]">
        <EmailForm
          formId="5d84452a-01df-422b-9734-580148677d2c"
          pageName="Team Page"
          labelId="team-subscribe-form"
          label="Join the movement"
        />
      </div>
    </section>
  );
}
