<img src="https://assets.goodparty.org/gp-share.png" alt="GoodParty.org" align="center" />

<br />
<br />
<div align="center">
  <h1>GoodParty.org Webapp</h1>
</div>
<div align="center"><strong>Website:</strong> <a href="https://goodparty.org">https://goodparty.org</a></div>

<br />

## Coding styles

We are using [conventional commits](https://www.conventionalcommits.org/)

## Built With

- [Next.js](https://nextjs.org/) - React SSR Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS library
- [Material UI](https://material-ui.com/) - UI Library
- [Clerk](https://clerk.com/) - Authentication

## Get Started

1. Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

2. Install dependencies and run:

```bash
npm install
npm run dev
```

To run with dev API:

```bash
npm run dev-dev
```

### Environment Variables

See `.env.example` for the full list. The required variables for local development are:

| Variable                            | Description                                  |
| ----------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (from Clerk dashboard) |
| `CLERK_SECRET_KEY`                  | Clerk secret key (from Clerk dashboard)      |
| `NEXT_PUBLIC_API_BASE`              | gp-api URL (defaults to dev)                 |
| `NEXT_PUBLIC_SEGMENT_WRITE_KEY`     | Segment analytics write key                  |
| `NEXT_PUBLIC_AMPLITUDE_API_KEY`     | Amplitude analytics API key                  |

## Styleguide

our styleguide lives on <a href="https://style.goodparty.org">style.goodparty.org</a> and uses <a href="https://storybook.js.org/">storybook</a>.<br/>
To run it locally run

```
npm run storybook
```

You will need to run also the api for the project <a href="https://github.com/thegoodparty/tgp-api">https://github.com/thegoodparty/tgp-api</a>

## AI-Assisted Development

We use [Claude Code](https://claude.ai/code) for AI-assisted development. Project-specific context lives in `CLAUDE.md` at the repo root. If you find yourself teaching the AI the same thing more than once, add it to `CLAUDE.md` so all future sessions (for the whole team) benefit.

The `ai-rules/` directory is a git submodule containing rule files for AI code review critics. After cloning, initialize it with `git submodule update --init`. To pull the latest rules: `npm run ai-rules:update`.

## License

This project is licensed under the [Creative Common Zero (CC0)](https://creativecommons.org/share-your-work/public-domain/cc0/) License

<h2>A Next13 App.</h2>

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
