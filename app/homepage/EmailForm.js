'use client';
export default function EmailForm() {
  return (
    <form className="pt-5" noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="relative mb-24 lg:mb-0 lg:w-[50%] xl:w-[40%]">
        <input
          type="email"
          name="email"
          placeholder="john@email.com"
          className="py-4 pl-4 pr-32 border-purple border-2 rounded-full w-full"
        />
        <input
          type="submit"
          value="Learn how"
          className="bg-purple absolute rounded-full right-2 top-2 py-2.5 text-white px-5 font-bold"
          style={{ color: 'white' }}
        />
      </div>
    </form>
  );
}
