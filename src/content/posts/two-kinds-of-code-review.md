---
title: Two kinds of code review
description: Agents can now check that code works better than we can, which leaves people with the question of whether it's the right code.
date: 2026-10-24
---

In May, Anthropic merged about 2,500 code changes a day. By September it was over 30,000. In [their post about rebuilding source control](https://www.anthropic.com/research/redesigning-source-control), the team says every engineer on the project would now rate Claude as a better coder than themselves. A lot of their job became telling Claude no. They still review every change to the system, but they look at the intent instead of every line.

That matches what I've seen, if "better coder" means implementation. I'd have said roughly yes since GPT-5.6 Sol and Opus 4.8, and definitely as of GPT-6 Astra and Opus 5.5. Given the right direction, any frontier model now writes code better than I would. The role of a software engineer has moved from writing the code to something closer to being its tech lead: deciding what gets built, how it fits together and when to say no.

I've been thinking about what that no is for. Working at OpenAI, I've found myself building a new mental model for it: code review was always two jobs, and agents can now do one of them better than we can.

## What review was for

In 1976, Michael Fagan at IBM [described formal code inspections](https://ieeexplore.ieee.org/document/5388086). A moderator ran the meeting, the designer walked everyone through the design and a reader paraphrased the code piece by piece. Fagan was clear about the goal. Inspections were for finding errors, and redesign or alternative solutions were out of scope.

That's not quite how review turned out. When Mika Mäntylä and Casper Lassenius [looked at what reviews actually found](https://doi.org/10.1109/TSE.2008.71), about three in four findings didn't change how the code behaved. They were about structure, documentation and how the code read. At Microsoft, Alberto Bacchelli and Christian Bird [found](https://www.microsoft.com/en-us/research/?p=164195) that developers expected review to catch defects, but defects made up only 14% of review comments.

They also found the hardest part of review was understanding the change. Fagan's version had the designer in the room to explain it. With agents, the person who opened the PR might not be able to explain it either.

## Two kinds

I've recently split review into two kinds. Objective review asks whether the code works: bugs, security holes, edge cases and an adversarial reviewer trying to break it. Subjective review asks whether it's the right code. That one's a skim. You're checking the PR makes sense directionally, not reading every line or looking for bugs.

This isn't an original idea. [GitHub's guide to reviewing agent PRs](https://github.blog/ai-and-ml/generative-ai/agent-pull-requests-are-everywhere-heres-how-to-review-them/) leaves the mechanical checks to Copilot and the judgment to people. [Addy Osmani](https://addyosmani.com/blog/agentic-code-review/) has made a similar case, and the [Claude Code team](https://claude.dev/blog/solving-code-review-at-anthropic/) recently wrote that humans keep "direction, taste and scope". There's more to say about where the line sits and why it moves, though.

Given a good prompt, agents are now better at objective review than we are. They read every line, they don't get tired and they can run the code. Every internal PR at OpenAI gets an automated review from Codex, and authors [change their code after about half of its comments](https://alignment.openai.com/scaling-code-verification/).

We probably couldn't keep up without them anyway. At OpenAI, weekly PR volume [has more than doubled since Q4](https://developers.openai.com/blog/custom-code-review-rules-for-codex). [Faros](https://pages.faros.ai/hubfs/AI_Engineering_Report_2026_The_Acceleration_Whiplash_Faros.pdf) found that as teams leaned on AI, median time in review went up 441%, and 31% more PRs were merged with no review at all.

That leaves people with two questions.

## Scope

The quickest check is whether the agent touched the right files. Sometimes agents overwork. Ask for one change and they'll edit files, or whole projects, that had nothing to do with it.

Kent Beck [lists functionality he didn't ask for](https://tidyfirst.substack.com/p/augmented-coding-beyond-the-vibes) as a warning sign, even when it's a reasonable next step. In [a study of 33K agent PRs](https://arxiv.org/abs/2601.15195), the ones that didn't get merged were larger and touched more files. A manual read of 600 of them turned up features nobody asked for.

Most of the time, that just means reading the file list.

## Direction

The harder check is whether it's going the right way. Code can work and still be wrong. The agent builds something itself when a popular npm package already does it. In Anthropic's example, systems worked out when a change merged by reading the whole commit log instead of asking the code review tool.

An OpenAI team ran into this when they [used GPT-6 to clean up their codebase](https://developers.openai.com/blog/maintaining-software-with-the-gpt-6-family). They merged more than 1,400 PRs and deleted over 800K lines, but some of the proposals added more complexity than they were worth. Building it yourself isn't always wrong, either. OpenAI's [harness engineering](https://openai.com/index/harness-engineering/) team found a hand-rolled helper cheaper than the package. That's why it's a judgment call.

## Agent review isn't deterministic

I'd use a frontier model for objective review. Whether you run it yourself or through a service like [CodeRabbit](https://www.coderabbit.ai) matters less than the fact that finding issues is non-deterministic (though, CodeRabbit is amazing). Run the same review twice and you'll get different findings.

The Claude Code team had one PR go through more than 50 review rounds overnight, so they capped reviews at three rounds. OpenAI tuned Codex review for precision over recall, and says stylistic comments can do more harm than good even when they're technically correct.

That's the same rule Stephen Johnson set for lint in 1978. A warning is only worth it in proportion to the real bugs it finds, and noisy ones get ignored. An agent reviewer should only report what it's confident about.

I'd go further and take lint and formatting out of agent review completely. They already have deterministic tools that fix them automatically (I wrote about this in [the agentic development loop](/writing/ultracite)), and OpenAI's [own guidance](https://developers.openai.com/blog/custom-code-review-rules-for-codex) is to keep them in CI. Leaving them in review fills the agent's context with problems that never needed judgment, and pulls its attention away from the ones nothing can fix automatically.

## Consequences

How much of this you hand off depends on what a mistake would cost. My open source projects are 100% agent-driven, and my reviews there are sweeping. If I make a mistake, I can patch it and publish a fix in seconds, and the blast radius is limited to whoever upgraded to the broken version. At OpenAI, a mistake could be much broader and much worse (API downtime or broken mission-critical functionality, for example), so it warrants more scrutiny.

The two fit together. The split says what an agent can review, and the consequences decide how much you trust it on its own. Because agent review is non-deterministic, the more a mistake costs, the more you want a person reading the lines as well. The [Claude Code team](https://claude.dev/blog/solving-code-review-at-anthropic/) does something similar, setting how many people need to approve a change, from zero to two, by its risk.

## Writing taste down

The line between the two kinds also moves. OpenAI's harness engineering team wrote much of its taste down as custom lint rules and "golden principles", one of which prefers shared packages over hand-rolled helpers. Once taste is written down, an agent can check it, and it becomes objective.

Codex now [reads review rules from AGENTS.md](https://developers.openai.com/blog/custom-code-review-rules-for-codex) and cites the rule when it flags something. In OpenAI's evals, review with those rules caught 98% of the findings they were written for, compared with 58% without them.

So I think human review has a second half. When you make the same taste call twice, write it down in a lint rule or AGENTS.md so you don't have to make it a third time. That's most of what [Ultracite](https://www.ultracite.ai) is.

None of this takes the person out of review. Simon Willison argues your job is to [deliver code you've proven to work](https://simonwillison.net/2025/Dec/18/code-proven-to-work/), because a computer can't be held accountable. I agree, and so does OpenAI's own guidance, which calls Codex an additional reviewer and leaves enforcement to tests, branch protections and required approvals. Proving it works is objective, and an agent can attach the evidence. Whether the change should exist at all is the part someone has to own.

For most code, I think human review will end up as a minute on the file list and the approach, plus writing down whatever taste call you just made. Fagan wanted inspections to find errors and nothing else. That's the part we can finally hand off.
