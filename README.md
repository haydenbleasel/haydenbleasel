# Hayden Bleasel

My personal website, powered by Next.js with TypeScript and hosted on Vercel.

## Prerequisites

Beyond the basics like Node, you'll need to install Yarn - the package manager of choice for this project.

```
npm install --global yarn
```

You'll also need to create a `.env.local` file with all the necessary environment variables. You can find these by searching the codebase for any variable beginning with `NEXT_PUBLIC_`. And no, you can't have my keys!

## Usage

To start developing, run `yarn dev`. This will spin up Next's development environment with HMR, so you only need to hit save and the page will refresh on it's own.

To run a production build, run `yarn build`. This will build a local copy of the application that appears in the live environment. After the build finishes, it will automatically run `yarn postbuild` which generates the sitemap.

There's also `yarn start`, which will start a Next.js production server, `yarn tsc` which runs a Typescript check and `yarn analyze` which runs a build with a bundle analyzer active.