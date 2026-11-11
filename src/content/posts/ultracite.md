---
title: The agentic development loop
description: "How coding agents changed the way I build Ultracite: faster linting, stricter rules and fewer ways to bypass checks."
date: 2026-10-07
updated: 2026-10-11
---

In 1978, Stephen C. Johnson at Bell Labs wrote [lint](<https://en.wikipedia.org/wiki/Lint_(software)>), a program that checked C code more strictly than the compiler did. He kept the two separate on purpose. The compiler had to be fast, so lint could take its time looking for code that was legal but probably wrong.

His [paper](https://wolfram.schneider.org/bsd/7thEdManVol2/lint/lint.pdf) on it has a short section called "A Word About Philosophy". In it, Johnson says warnings are "acceptable only in proportion to the fraction of real bugs they uncover." If too many turn out to be nothing, people stop trusting them. So the pickiest checks sat behind a flag you had to ask for.

Both limits came from the person on the other end. People won't wait for a slow check, and they won't read a noisy one. So for most of the fifty years since, linting has been something you could put off or ignore. It ran in CI, in a pre-commit hook or as a squiggle in your editor. Configs got tuned to what people would tolerate.

Mine was no different. In 2022, I had a 642-line ESLint config that I used across all my React, Next.js and Expo projects. (I rounded it down to 600 in my post about [redesigning ESLint](https://eslint.org/blog/2022/08/redesigning-eslint/).)

It described itself as strict, but it turned off `complexity` and `sort-keys`. Neither rule is wrong. I just didn't want to fix them by hand.

## The loop

Agents change those limits. They work in turns. You give one an instruction and it edits some files. In the workflow I want, it runs the project's checks before handing back: the linter, the formatter, the type checker and often the tests. If anything fails, it fixes the problem and runs them again.

This is the agentic development loop. Configure it to run checks every turn, often more than once, and linting becomes part of the work. The failures give the agent concrete feedback before a person sees the code.

So I think the loop is now one of the best places to spend effort in a codebase, and most of the loop is your checks. They need to be fast enough to run every turn, strict enough to be worth running and hard to cheat.

That's what I've been building [Ultracite](https://www.ultracite.ai) for. It started as that 642-line config, so nobody else would have to write their own. The two biggest jumps in its downloads came when I reframed it around agents in v5 and v7, and npm recorded [~4M downloads in September 2026](https://api.npmjs.org/downloads/point/2026-09-01:2026-09-30/ultracite).

## Fast

Johnson could let lint take its time because it sat outside the compiler. In the loop, it runs every turn and the agent waits on it every time, so a slow linter makes a slow agent. I think fast checks are critical to agent-native development workflows.

When I joined OpenAI, I switched a few of our projects to [Oxlint](https://oxc.rs), Oxfmt and Ultracite for exactly this reason. Our lint and format checks went from ~2 minutes to ~3 seconds. That's about two minutes back on every Codex turn.

It's also why Ultracite recommends Oxlint and Oxfmt over ESLint and Prettier. Its [agent hook](https://www.ultracite.ai/docs/ai/hooks) runs `ultracite fix` on just the file that changed, right after each edit, so the agent doesn't spend a turn on formatting.

## Strict

Johnson's other limit was noise, and agents change that one too. A rule I used to turn off because I didn't want to fix it by hand can be worth keeping when an agent handles the repetitive work. The warnings still need to be useful, and there still needs to be room for them in its context.

So the rules people switched off can come back on. `complexity` and `sort-keys`, the two I turned off in 2022, are both errors in Ultracite now. So is `no-warning-comments`, which bans `TODO`, because agents like to leave `// TODO: implement` where the hard part should be.

Agents are non-deterministic and linters aren't. The more of an agent's output you can check by rule, the less of it you have to check by reading.

It helps to tell the agent the rules up front, too. Ultracite writes its standards into `AGENTS.md`, `CLAUDE.md` and other [agent rule files](https://www.ultracite.ai/docs/ai/rules), so the agent knows them before it writes anything. Every check that passes the first time is one less trip around the loop.

## Hard to cheat

A strict check only helps if the agent fixes the problem instead of hiding it. Give one a type error it can't figure out and it may reach for `as any` or `@ts-ignore`. Ultracite turns on `strictNullChecks` and makes both of those errors, closing off two common ways to silence the checker.

An opt-in preset built on Dillon Mulroy's [anti-slop](https://github.com/dmmulroy/anti-slop) plugin goes further and requires a comment explaining why each type assertion is safe. I'd never ask a person to do that. An agent can write the explanation, though the comment alone doesn't prove it's right.

The same idea works for security. Ultracite errors on the obvious ones like `eval` and `dangerouslySetInnerHTML`, and it has an opt-in preset for Guillermo Rauch's [gdp-ts](https://github.com/rauchg/gdp-ts).

gdp-ts is based on Matt Noonan's [Ghosts of Departed Proofs](https://users.cs.northwestern.edu/~robby/icfp2018/icfpws18haskell/icfpws18haskellmain-id18-p.pdf), a 2018 Haskell paper about encoding preconditions in the type system. Sensitive functions demand a proof that an authorization check happened, and only one trusted module can create those proofs. If an agent skips the check, the code doesn't type check. Ultracite's rules stop it from faking the proof with a type assertion.

For code using those proof types, a missing authorization check can become a failed check in the loop. The trusted module and the rules still need review, and the agent mustn't be able to weaken them to make a check pass.

## Where it stops

None of this means turning on every rule. Every warning takes up some context, and an agent follows a bad rule as faithfully as a good one.

`max-lines` and `max-params` are still off in Ultracite, because an arbitrary limit makes code worse no matter who writes it. In v7, I loosened the complexity limit a little after it flagged too much reasonable code. Johnson's test still holds. A rule has to catch real problems.

For more on the reasoning behind the rules, see our [open research](https://www.ultracite.ai/research).

Checks also only cover what can be checked. They can't tell you whether the agent built the right thing. That's what the hand back is for, and the better the loop, the more of your review can go there.

I think most codebases will end up with checks that would have seemed extreme a few years ago. Most people won't notice, because they won't be the ones reading the output.

In 1978, lint ran outside the loop and its pickiest checks were behind `-h`. Now it runs every turn. I'd make it fast and leave `-h` on.
