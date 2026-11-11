---
title: The value of open source
description: An agent can rebuild your repo in a week, but the code was never what open source was selling, and for maintainers, AI is speeding things up.
date: 2026-10-31
---

In February, tldraw [floated moving its tests](https://github.com/tldraw/tldraw/issues/8082) into a private repo. The worry was that someone would point an agent at them and rebuild tldraw from the outside. Malte Ubl called that a [slop fork](https://x.com/cramforce/status/2026782878609322317).

Steve Ruiz later said it was mostly a joke, and the tests never moved. Others weren't joking. Cal.com closed its source in April, and a growing list of maintainers have stopped accepting pull requests altogether.

A few people have asked me some version of the same question since. If an agent can read your repo, or rebuild it as a competitor in a week, what's the point of open sourcing anything?

I think it depends on why you open sourced it. Some people do it to build a company or a product. Some do it performatively, to look like a contributor. And some ship code that makes other developers' lives easier and expect nothing back, just for the love of the game. The question is mostly about the first group, so I'll start there.

## The code was never the moat

Open source code has always been free to copy. [Next.js](https://github.com/vercel/next.js) is MIT licensed, and as Malte [pointed out](https://x.com/cramforce/status/2027155457597669785), Cloudflare could have forked it whenever it wanted. AI makes a copy cheaper, but a copy was never expensive.

The value had to come from somewhere else. I think it's come from five places:

1. The trust you get from being able to read the code.
2. Being able to fix it yourself.
3. The community around it.
4. A hosted version, so you don't have to run it.
5. The creators / maintainers, who spent a good portion of their life investigating and solving the problem.

You can see this last one especially in when large companies buy open source projects. Anthropic [bought Bun](https://bun.com/blog/bun-joins-anthropic), which is MIT licensed and, in Jarred Sumner's words, "makes $0 in revenue". OpenAI [announced a deal for Astral](https://astral.sh/blog/openai), and uv and Ruff are still open source. Either company could have forked the code for free. They paid for the people.

## What AI changes

Hosting is where AI's effect is easiest to see. Most open source apps can be self-hosted, but you need servers, a database, environment variables, billing and someone to do the upgrades, so it's usually easier to pay the people who made it.

Now I can ask an agent to spin a repo up on Cloudflare for me, and XDA wrote this month that agents have made self-hosting "[dramatically easier](https://www.xda-developers.com/self-hosting-dramatically-easier-year-coding-agents-reason/)".

In practice, a lot of agents reach for the hosted option anyway. Over 60% of new Supabase databases are [created by AI tools](https://techcrunch.com/2026/06/05/supabase-doubles-valuation-to-10b-in-8-months/), and Supabase is open source. An agent can spin something up, but someone still has to keep it running.

Trust is the one people disagree about. Cal.com said AI vulnerability scanners make open code "[like giving attackers the blueprints to the vault](https://cal.com/blog/cal-com-goes-closed-source-why)". Discourse [disagreed](https://meta.discourse.org/t/discourse-is-not-going-closed-source/400863) a few days later and stayed open.

I'm with Discourse. The trust was never in the code. It was in the people reading it, and a slop fork copies the code without them. In vinext's first week, Vercel [reported seven vulnerabilities](https://x.com/rauchg/status/2026864132423823499) and Hacktron [found 24](https://www.hacktron.ai/blog/hacking-cloudflare-vinext), including one that leaked sessions between requests.

Being able to fix it yourself is the one AI makes more valuable. Free software [started with a printer](https://oreilly.com/openbook/freedom/ch01.html). In 1980, MIT's AI Lab got a new Xerox printer, and Richard Stallman couldn't get its source code. He'd changed the software on the lab's old printer to tell people when their jobs were done, and the one person he found with the new code had signed a nondisclosure agreement.

For decades, that freedom mostly mattered to people who could act on it. Simon Willison [argues](https://simonwillison.net/2026/Aug/3/devtools-must-be-open-source-exedev/) that LLMs finally make it practical for ordinary users. You can fork a library and have an agent fix your copy, which is technically a slop fork too, just one nobody minds.

Community is the one a fork can't copy at all. A fork gets the code as it was on the day it was copied, not the next fix. vinext has since shipped 1.0, with agents that [track Next.js canary every day](https://blog.cloudflare.com/vinext-nextjs-on-vite/), so it still depends on the Next.js team doing the work.

## What licenses protect

Open core companies have mostly relied on licenses for protection. When cloud providers started selling hosted versions of their software, Elastic and Redis moved to licenses that restricted them. Both later [came back](https://www.elastic.co/blog/elasticsearch-is-open-source-again) to the [AGPL](https://redis.io/blog/agplv3/), which lets anyone host the code as long as they share their changes.

In the same thread, Malte argued that slop forks might be the end of that model. A license covers the code. A slop fork doesn't copy the code, it rebuilds the behavior, so the license doesn't come into it.

chardet is the test case so far. In March, its maintainer [rewrote it with Claude](https://lwn.net/Articles/1061534/) and moved it from the LGPL to MIT. Mark Pilgrim, who wrote the original, [said](https://github.com/chardet/chardet/issues/327) it wasn't a clean-room implementation. Richard Fontana, an open source lawyer, saw no basis for keeping the LGPL, and Heather Meeker [thinks he's probably right](https://heathermeeker.com/2026/04/09/the-chardet-controversy-open-source-and-the-ai-clean-room/). No court has ruled on it yet.

A good test suite makes a rebuild much easier. This month, Theo Browne's agents [ported the TypeScript compiler](https://www.theregister.com/devops/2026/10/15/24000-ai-experiment-ports-typescript-compiler-to-rust/5303409) from Go to Rust, and the port passes nearly all of its conformance tests. That's exactly what tldraw was worried about.

Neon made the same point from the other side. Its developer advocate [slop-forked the Neon console](https://neon.com/blog/slop-fork-neon) in about half a day for around $100, to argue that the API behind it is the product.

So if a license is the main thing stopping a competitor, I wouldn't count on it for much longer.

## Two ways to make money

Open source has never been a safe path for a company. The ones that make it work tend to fall into two groups.

The first is a cheaper, open, high-quality version of a tool people aren't happy with. Cal.com was my go-to example, an open alternative to Calendly. It's also the group a slop fork threatens most, because a slop fork makes the same pitch. In April, Cal.com went closed source and left behind a [smaller MIT version](https://github.com/calcom/cal.diy) without Teams, Workflows or SSO.

The second is a lead-in for something else. In 2002, Joel Spolsky wrote that [smart companies commoditize their product's complements](https://www.joelonsoftware.com/2002/06/12/strategy-letter-v/). If the thing next to your product gets cheaper, demand for your product goes up. Next.js is free, so more people need somewhere to host it. Vercel is the part that makes money, and it's closed source, built to be the best place to run Next.js.

vinext is Cloudflare making the same move with the same framework, and Cloudflare now recommends it as the default way to run Next.js on Workers. The lead-in still works, because the framework isn't what's being sold.

I'd think carefully before open sourcing mission-critical code, let alone a whole codebase. Open source the part you want everyone building on, and make sure the reason people pay you isn't in the repo.

## Who pays

Open source has always had a gap between the people who use it and the people who pay for it. Agents make it wider, because they use open source on someone's behalf without that person ever visiting the project.

Tailwind's funnel ran through its docs, and AI answers the question without the visit. In January, Adam Wathan [wrote](https://github.com/tailwindlabs/tailwindcss.com/pull/2388) that docs traffic was down about 40% since early 2023, revenue was down close to 80% and 75% of the engineering team had lost their jobs.

In September, Tailwind [joined Shopify](https://tailwindcss.com/blog/tailwind-is-joining-shopify). The framework is installed more than 110M times a week, and they're no longer trying to grow a business around it. Nobody forked anything. People just stopped visiting.

Economists have started modeling this. In "[Vibe Coding Kills Open Source](https://arxiv.org/abs/2601.15494)", Miklós Koren and his coauthors argue that agents assemble open source without users ever engaging with the people who maintain it. In their model, open source only holds up if those users give back at least 84% of what direct users do, or the money comes from somewhere that doesn't depend on usage. It's a preprint, and Tailwind is one of their examples.

At the same time, more money is going into open source than ever, and most of it doesn't depend on usage at all. GitHub Sponsors [passed $100M](https://github.blog/open-source/maintainers/100-million-for-open-source-a-milestone-built-by-the-community/) in total this July, and the last $10M took five months. Anthropic and OpenAI now both give maintainers free plans ([Claude](https://claude.com/open-source-max), [Codex](https://developers.openai.com/community/codex-for-oss)), and in March they joined Google, Microsoft and others in putting [$12.5M](https://www.linuxfoundation.org/press/linux-foundation-announces-12.5-million-in-grant-funding-from-leading-organizations-to-advance-open-source-security) into open source security.

So individual projects are making less while open source as a whole gets more, and the two don't pay for the same things. Most of the new money goes to security work and tools rather than maintainer time, and none of it replaces what Tailwind lost. The [Sovereign Tech Agency](https://www.sovereign.tech/news/celebrating-five-years) put the gap well: AI makes vulnerabilities easier to find, not easier to fix.

## A new speed

In April, Anthropic launched [Project Glasswing](https://www.anthropic.com/glasswing), which gives partners like AWS, Apple, Google and Microsoft access to Claude Mythos Preview, a model it isn't releasing more widely. Anthropic says it [found thousands](https://www.anthropic.com/research/mythos-preview) of high and critical vulnerabilities, including a 27-year-old crash in OpenBSD and a 16-year-old flaw in FFmpeg. A month later, OpenAI launched [Daybreak](https://www.infosecurity-magazine.com/news/openai-daybreak-secure-by-design/). Its open source program, [Patch the Planet](https://engadget.com/2199569/openai-new-daybreak-initiative-open-source-projects-bugs), works with Trail of Bits and HackerOne to send fixes upstream.

Open source maintainers felt it straight away. Node.js got more than 30 security reports in a month over the holidays, up from [three a year earlier](https://openjsf.org/blog/ai-is-stress-testing-open-source), and curl's reports are running at [four to five times](https://daniel.haxx.se/blog/2026/05/26/the-pressure/) the 2024 rate. By May, Glasswing had disclosed 530 open source bugs and 75 had been patched, and some maintainers had [asked Anthropic to slow down](https://www.anthropic.com/research/glasswing-initial-update).

A lot of people read this as AI companies causing a problem and then selling the fix. When Google's AI found bugs in FFmpeg last year, the project called them "[CVE slop](https://x.com/ffmpeg/status/1984207514389586050)" and said trillion-dollar companies should send patches or money instead. Daniel Stenberg called the Mythos hype "[primarily marketing](https://daniel.haxx.se/blog/2026/05/11/mythos-finds-a-curl-vulnerability/)".

I think that's a limited view. AI-written code isn't bulletproof (in [Veracode's tests](https://www.veracode.com/news/llms-are-getting-smarter-but-not-safer-veracode-2026-genai-code-security-report-finds-ai-generated-code-security-has-stalled-at-56%25-pass-rate/), even the best model failed about a third of the time), but in my experience frontier models write more secure code than most people do. And the bugs they're finding were mostly written by people, often a decade or two ago. The OpenBSD crash Mythos found had been sitting there for 27 years.

I don't think it's a matter of supply and demand. It's a matter of speed. Mandiant found the average time to exploit a vulnerability [fell from 63 days to five](https://cloud.google.com/blog/topics/threat-intelligence/time-to-exploit-trends-2023) between 2018 and 2023, and in May, Google reported the [first zero-day it believes was built with AI](https://cloud.google.com/blog/topics/threat-intelligence/ai-vulnerability-exploitation-initial-access). Defenders have to move just as fast.

The reports are getting better, too. In January, curl [ended its bug bounty](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/) because so few of the reports it was getting were real. This month, Stenberg [wrote](https://daniel.haxx.se/blog/2026/10/22/ignore-the-slop/) that AI-assisted reports are now mostly accurate and the slop has largely gone. Fixing is still the slow part, and it's mostly still volunteers doing it.

I don't think closing the source helps much, either. Open projects are the ones these programs are scanning and patching for free. There have always been attackers and defenders. We're just playing at a new speed now.

## Fewer packages

Packages were how we built on each other's work. You installed someone else's solution and had less code to manage yourself.

That's harder to trust after the last year on npm. Attackers phished the maintainer of [chalk, debug and 16 other packages](https://www.aikido.dev/blog/npm-debug-and-chalk-packages-compromised), with more than 2B downloads a week between them, and published malware that swapped crypto wallet addresses. [Shai-Hulud](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem) became the first self-replicating npm worm, and [axios](https://securitylabs.datadoghq.com/articles/axios-npm-supply-chain-compromise/) was compromised in March. The [Nx compromise](https://nx.dev/blog/s1ngularity-postmortem) even asked the AI coding tools on your machine to go looking for secrets.

The package managers are catching up. In July, [npm 12](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/) stopped running dependencies' install scripts by default, and [pnpm 11](https://pnpm.io/blog/releases/11.0) won't install a release until it's a day old.

Some developers are skipping the package entirely and asking an agent for a small replacement. Armin Ronacher [made the case](https://lucumr.pocoo.org/2025/1/24/build-it-yourself/) for building it yourself, and Mitchell Hashimoto [argues the opposite](https://mitchellh.com/writing/building-block-economy), that agents are at their best gluing proven pieces together.

The strongest case for generating so far is a [July paper](https://arxiv.org/abs/2607.13021) that had AI regenerate only the part of each dependency a repo actually used. Across 180 pairs, it kept 99.8% of the behavior it observed, with 93% less API surface.

"Observed" is doing a lot of work there. A package that's been around for a while is mostly edge cases, and a lot of them were found by people using it in ways the author never expected. A generated replacement only covers the cases you've already seen.

It also swaps one risk for another. A generated replacement can't be hijacked upstream, but its bugs are in your code now, and nobody else is finding them.

I'd still generate the trivial ones. For anything where the edge cases are the hard part, other people's bug reports are most of what you're installing.

## Performative open source

Performative open source is older than AI. In 2020, Hacktoberfest offered a T-shirt for four pull requests, and maintainers got a flood of [one-line README edits](https://drewdevault.com/blog/Spamtoberfest/). Within days, DigitalOcean made it opt-in.

AI made that kind of contribution nearly free. In February, an OpenClaw agent opened a PR on matplotlib, and when maintainer Scott Shambaugh closed it, the agent [published a blog post about him](https://theshamblog.com/an-ai-agent-published-a-hit-piece-on-me/). GitHub's [post about OpenClaw's own maintainers](https://github.blog/open-source/maintainers/openclaw-went-viral-meet-the-maintainers-building-and-securing-it) has a section called "Reputation became an attack surface", about people copying other contributors' PRs to build a merge history.

This year, Hacktoberfest stopped counting PRs toward rewards at all, because "[AI tools make low-effort PRs easier than ever to generate](https://hacktoberfest.com/mission/)".

GitHub summed up the problem in [one line](https://github.blog/open-source/maintainers/welcome-to-the-eternal-september-of-open-source-heres-what-we-plan-to-do-for-maintainers/): "The cost to create has dropped but the cost to review has not." According to this year's [Octoverse](https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/), agents started more than 40% of the pull requests on GitHub in September, up from 17% in March.

It doesn't land evenly, either. In [Working in Public](https://press.stripe.com/working-in-public), Nadia Asparouhova calls projects with lots of users and few contributors stadiums. Most of the libraries I've worked on are stadiums, and stadiums are where this hurts most, because maintainer attention is the thing they're short of. OpenClaw went from about two PRs a week to [3,400](https://www.greptile.com/blog/prs-on-openclaw) in a couple of months, and its merge rate fell from 48% to under 10%.

Maintainers are responding by limiting who can contribute. tldraw [auto-closes external PRs](https://tldraw.dev/blog/stay-away-from-my-trash), Ghostty needs a trusted contributor to [vouch](https://github.com/mitchellh/vouch) for you, and [Codex](https://github.com/openai/codex/discussions/9956) stopped accepting unsolicited PRs in January. It's a real problem.

## The onus is on me

AI has also brought a lot of new people into open source, and not all of them are developers. Some are vibe coding an app, something breaks and their agent files an issue on the library it was using.

By the usual standard, a lot of what they send is bad. A [study of vibe coders' PRs](https://arxiv.org/abs/2602.23905) found the less experienced ones were accepted 31% less often.

I think that's a matter of perspective, though. Not everyone showing up is an expert developer or knows what a good pull request looks like, but I like to think they're doing their best, and I want to support that. When a PR isn't quite ready, I'd rather fix it up and merge it myself than close it or tell them what they did wrong.

Issues work the same way. If an agent can't figure out how to integrate my library, that's mine to fix. It usually means the docs aren't clear, the API isn't intuitive or the types don't say enough. An agent's bug report is a usability test I didn't have to run.

## Maintainers have agents too

A lot of people think AI is killing open source, and Koren and his coauthors put it in [the title of their paper](https://arxiv.org/abs/2601.15494). It's not what it looks like from the maintainer's side.

My open source projects are 100% agent-driven now, and I've done far more with them than I could have on my own. I've shipped features I'd have skipped because of the maintenance they'd add or how big they were, redesigned websites and written complete docs.

I'm not the only one. Ghostty's maintainers [say they use AI heavily](https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md), and one maintainer [called 2026](https://p.umputun.com/en/2026/03/18/opensource-ai-renaissance/) "the year of open source renaissance", with about 90% of his contributors using AI and about half their proposals good to merge as they are. Across GitHub, 1.3B pull requests were merged in the year to September, [more than double](https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/) the year before.

Projects can't agree on what to do about it, though. Gentoo [bans AI-generated contributions](https://wiki.gentoo.org/wiki/Project:Council/AI_policy), NetBSD [treats them as tainted](https://www.netbsd.org/developers/commit-guidelines.html) unless its core team signs off and Godot [bans vibe coding and autonomous agents](https://godotengine.org/article/contribution-policy-2026/). Codeberg banned projects that are mostly AI-generated, and Armin Ronacher [argued](https://lucumr.pocoo.org/2026/7/24/codeberg-divides/) that was the wrong call. Last week, r/opensource [banned projects that use AI](https://helpnetsecurity.com/2026/10/26/reddit-r-opensource-ai-ban), and someone started r/TrueOpenSource in response.

Even labeling it is contested. In April, the Linux kernel started asking contributors to tag AI-assisted patches. This month, its maintainers [agreed to drop that requirement](https://www.theregister.com/ai-and-ml/2026/10/14/linux-kernel-devs-drop-obligatory-confession-of-ai-tool-usage/5303140), and Linus Torvalds argued disclosure doesn't matter as long as people understand the code they send. Andrew Nesbitt [found](https://nesbitt.io/2026/08/06/a-year-of-ai-disclosure-in-critical-packages.html) that only about 5% of commits in critical packages carry an explicit AI marker, while agents now start more than 40% of the pull requests on GitHub. Those measure different things, but the gap is hard to miss.

I'm closer to Torvalds on this. I care less about which tool wrote a change than whether someone understands it and stands behind it.

The tools that make a slop PR cheap make a good one cheap too, and maintainers are in the best position to use them well, because they know what the project needs. For the people maintaining it, AI isn't killing open source. It's speeding it up.

## For the love of the game

People who open source things for the love of the game barely have a problem. If you open sourced something to make other developers' lives easier, an agent reading it to help someone else is the point.

When Steve walked back the idea of hiding tldraw's tests, he said moving them would slow development down. That's the whole trade in one sentence. The docs, types and tests that make a library easy for an agent to use are the same things that make it easy to copy. I'll take that trade.
