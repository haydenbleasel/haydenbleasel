# Hayden Bleasel

Hi, I’m Hayden Bleasel. I design, code and grow things on the internet.

I run the Product and Design teams at Corellium where I help shape the direction of our brand and product, blurring the line between real and virtual.

I’m an Australian he/him living in Sydney. I enjoy turning complex problems into meaningful solutions through design and code. I focus on simplicity, thoughtfulness, accessibility and a learning-based approach to my work.

This repo is used for my personal website, powered by Next.js with TypeScript and hosted on Vercel.

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
