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

- [Next.js 15](https://nextjs.org/) - React SSR Framework with App Router
- [Tailwind CSS](https://tailwindcss.com/) - CSS library
- [Material UI](https://material-ui.com/) - UI Library

## Get Started

```
npm install
npm run dev
```

To Run with dev api

```
npm run dev-dev
```

## Styleguide

our styleguide lives on <a href="https://style.goodparty.org">style.goodparty.org</a> and uses <a href="https://storybook.js.org/">storybook</a>.<br/>
To run it locally run

```
npm run storybook
```

You will need to run also the api for the project <a href="https://github.com/thegoodparty/gp-api">https://github.com/thegoodparty/gp-api</a>

## AI-Assisted Development

We use [Claude Code](https://claude.ai/code) for AI-assisted development. Project-specific context lives in `CLAUDE.md` at the repo root. If you find yourself teaching the AI the same thing more than once, add it to `CLAUDE.md` so all future sessions (for the whole team) benefit.

The `ai-rules/` directory is a git submodule containing rule files for AI code review critics. After cloning, initialize it with `git submodule update --init`. To pull the latest rules: `npm run ai-rules:update`.

## License

This project is licensed under the [Creative Common Zero (CC0)](https://creativecommons.org/share-your-work/public-domain/cc0/) License

