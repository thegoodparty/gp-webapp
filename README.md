<img src="https://assets.goodparty.org/share.jpg" alt="GoodParty.org" align="center" />

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

- [Next13](https://nextjs.org/) - React SSR Framework
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

You will need to run also the api for the project <a href="https://github.com/thegoodparty/tgp-api">https://github.com/thegoodparty/tgp-api</a>

## Tests

We are using [cypress.io](https://www.cypress.io/) for our tests.
To run with local api:

- make sure you run your webapp and api local

```
npm run cypress-local
```

to run cypress with dev or prod api (and local webApp):

```
npm run cypress-local-dev
npm run cypress-local-prod
```

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
