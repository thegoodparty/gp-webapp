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
