---
title: The default wins
description: Developers have always taken advice from opinionated tools, and agents take it even more literally.
date: 2026-10-16
---

Most of what I've built is a list of decisions made in advance.

[next-forge](https://www.next-forge.com) picks your auth, database and payments. [Ultracite](https://www.ultracite.ai) picks your lint rules. [Streamdown](https://streamdown.ai) decides how a streaming response should render, and [Blume](https://useblume.dev) turns a folder of Markdown into a docs site without asking you anything.

People use them for the same reason they use Next.js. They'd rather the call came from someone who spends their life on the problem.

## Advice

Next.js has always made decisions for you. Its [original design principles](https://vercel.com/blog/next) started with "zero setup", using the filesystem as the API, so a route was just a file in `pages/`. [Next.js 9](https://nextjs.org/blog/next-9) started deciding per page whether to render statically or on the server, so "users no longer have to make the choice". And Vercel took care of deploying it.

I think a lot of Next.js' success came from this. Each of those was a decision most developers didn't want to make, made by people who'd thought about it far longer than they had.

Zero-config is the best version of this. You start straight away with what the author thinks is the best way, and you can still configure things when you need to.

The same thing shows up well outside of software. At [Spaceship](/writing/spaceship), we were asking people to switch super funds when most had never chosen one in the first place.

In 1998, a large US company started enrolling new hires in its 401(k) automatically, instead of waiting for them to sign up. Brigitte Madrian and Dennis Shea [looked at what happened](https://www.nber.org/papers/w7682), and participation among new hires went from 37% to 86%.

The default was 3% of pay, all of it in a money market fund. Very few people had picked that before. Afterwards, six in ten new hires didn't change a thing.

Madrian and Shea gave two reasons. One was inertia. The other was that people took the default as advice from the company.

The second one explains Next.js. Developers aren't too lazy to configure webpack. They trust the people who decided they shouldn't have to.

## Agents take advice too

Agents don't have the first problem. Changing a config costs them nothing, and they'd happily write the [642-line ESLint config](/writing/ultracite) I used to carry between projects.

They have the second one more than we do. An agent takes advice from two places: the rules a tool gives it, and the code already in your repo. Modern models write code that looks like the code around it.

I've seen this with Ultracite. Once a codebase has strict rules applied, models write better code from the first turn, because the code they're copying already follows them.

To an agent, your codebase is the default.

## Empty repos

An empty repo gives the agent nothing to copy, so it falls back on the model's defaults.

In February, Amplifying [ran Claude Code 2,430 times](https://amplifying.ai/research/claude-code-picks/report) on new projects, with prompts that never named a tool. It picked shadcn/ui for 90% of component libraries and Vercel for 77% of deployments. Nobody configured that. It's the model's best guess at what most projects do.

That guess moves. In July, they [ran it again](https://amplifying.ai/research/claude-code-picks-fable/report) on Fable 5. shadcn/ui dropped to 52%, Vercel to 50%, and the share of picks where it just wrote its own nearly doubled.

So if you leave the decision to the model, your stack changes when the model does.

I'd rather put the default where the agent will read it. Ultracite writes its rules into AGENTS.md, so every agent sees them before it writes anything. [next-forge 6](https://vercel.com/changelog/next-forge-6) ships an agent skill that explains the template's architecture before the agent touches it. Blume works on the other side. llms.txt and Markdown mirrors are on by default, so a Blume site is ready for agents to read without anyone setting it up.

## Advice has to keep up

A default spreads whatever's in it. The 401(k) default got people saving, but it also put 80% of their contributions in a money market fund. People who'd chosen for themselves put less than 10% there.

Agents spread it further. They'll copy a bad default as happily as a good one, and every file they write becomes something the next turn copies.

So someone has to keep the advice current. next-forge has swapped providers over the years, based on what the community asked for and how the ecosystem moved. In version 6, Bun became the default package manager.

There also has to be room to disagree. Blume 2 moved search, deployment and content sources into adapters, so you can swap one out or use more than one. If that's still not enough, `npx blume eject` turns it into a standalone Astro app. Ultracite lets you override the rules you disagree with.

Zero-config doesn't mean you can't configure. It means you don't have to.

I think in most codebases, the config that shapes the most code will soon be a preset and a few lines of AGENTS.md that nobody on the team wrote. That's fine by me, as long as whoever wrote them spends their life on this stuff.
