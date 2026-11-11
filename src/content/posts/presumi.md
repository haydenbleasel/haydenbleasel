---
title: The story of Presumi
description: How a resume I hacked to track itself turned into an 18-month side project, a pivot and an experiment with SEEK.
date: 2017-08-17
---

I've been applying for jobs since I was 15, and the worst part has never been the rejections. It's the silence. You send a resume off and hear nothing, so you never find out whether anyone even opened it.

In late 2015 I got home from a product design internship at Palantir and went back to being a university student, applying for part-time roles. So I wrote a little library that rewrote my resume with tracking built in, and sent it to an employer as a test. It was surprisingly accurate.

I gave it a simple UI so I could use it to apply for jobs at Facebook, Twitter and a few others, and put it on a spare domain. Then someone posted it to [BetaList](https://betalist.com/startups/presumi) and [Product Hunt](https://www.producthunt.com/posts/presumi), and about 700 people signed up overnight. I'd built it in a week, and now hundreds of people were sending me feature requests and bug reports.

That was the start of Presumi.

## A four-slide deck

I thought it might be a real company, so I looked at [Startmate](https://www.startmate.com.au). Applications had closed about a month earlier, so I contacted Niki Scevak directly to ask for advice, and he invited me into the Blackbird Ventures office to pitch him.

It was a terrible deck (four slides, not much on them) but a half-decent pitch, mostly because I really cared about the problem. Niki let me pitch as a bonus at the end of the Startmate pitch night, where a much bigger room gave me feedback on focus, automation, market and growth. A few weeks later, Alan Jones of BlueChilli had me over to his office to talk about what to do next.

From there I joined the UTS Hatchery+, my university's startup program. I'd worked at plenty of startups, so I assumed I knew how they worked. Running one is a different job. Every decision lands on you, and you're always short on cash and time. I'd gladly skip a night out with friends to get one more user.

Over the following months I rebuilt and redesigned the platform a few times, learning React, Babel and Webpack along the way. They became my main stack at the time. An illustrator gave us a new brand and we had a second, [official Product Hunt launch](https://www.producthunt.com/posts/presumi-1). The press picked it up too, from [Startup Daily](http://www.startupdaily.net/2016/10/sydney-startup-presumi-helps-job-seekers-see-employers-interact-resume/) to the [UTS Newsroom](http://newsroom.uts.edu.au/news/2016/06/hard-slog-and-serendipity-path-overnight-success).

Product, growth and press were all going well. I was less sure about doing it alone, in a co-working space where the general view was that one founder can't do all the work.

## The university

The first real shot at revenue came from somewhere I hadn't looked. I was at the university careers fair, competing for signups with the startup next to us (they had free donuts), when Aaron from UTS Careers came over with a question. If Presumi could tell a student why they didn't get a job, could the university find out why its students weren't getting jobs?

I hadn't thought of that at all. I told him we were already working on it, then went home and started building it.

A couple of weeks later, the careers team had a platform that measured how students went when applying for jobs. It found the groups getting rejected most often, so the team could reach out to them first. The university paid for a trial, and it went well.

Then it stalled. After long stretches without replies and no sign-off from middle management, I pulled back. It probably wouldn't have worked anyway, because it needed every student to apply for every job through one platform. Someone saying "I can see people using this" is nowhere near someone saying "I would use this".

## Going B2B

So I went back to job seekers. A lot of students around campus had heard of Presumi, and I brought on four of them as interns to help with everything I didn't have time for.

Around then, a large Australian recruitment company asked how flexible our technology was, and whether it could work with theirs. In hindsight that question made something obvious. I'd set out to help job seekers, but the algorithm also solved a problem for the job marketplaces. Once a candidate sends their resume, the marketplace has no idea what happens on the hirer's side.

Going B2B meant shutting down the consumer site overnight and giving up on designing what people actually saw. I'd put it off for a while because I was afraid of leaving nothing behind, as if Presumi had never existed. But if the big marketplaces could see why resumes get rejected, they could improve the odds for far more job seekers than I'd ever reach on my own.

## SEEK

Working with SEEK wasn't the plan. I'd asked to use their API for an experimental feature, and they said no. To be fair, I didn't have much to offer in exchange for their job listings. Not long after, someone from their international strategy team emailed to ask if I had time for an informal chat.

After a few calls, I was invited down to SEEK's headquarters in Melbourne. I'd assumed the algorithm would end up on the main SEEK site, but the team had other ideas. They introduced me to SEEK Asia in Hong Kong, who wanted to run an experiment on one of their partner sites, [JobsDB](https://hk.jobsdb.com).

The hypothesis had two sides. Candidates would prefer applying with a trackable resume because they'd get feedback and signals of interest from hirers, and hirers would be happy to receive one and reply.

So when applying for a job on JobsDB, candidates could go the normal way or opt into a new "Status Tracker". If they opted in, the application went through Presumi, which sent a trackable resume to the hirer and told the candidate whenever it was received, opened, marked as interesting or replied to. We skinned our pages with the JobsDB UI library, so nobody could tell they'd left the site.

To measure it, I built a new analytics system around the algorithm that tracked things like interactions per visit, hirer click-through rates and how often candidates checked their dashboard.

It ran on JobsDB for about six months. As a B2B product, we processed more applications every three days than we had in a year of B2C. Tens of thousands of applications came in so quickly that we started hitting performance issues, and I'm less of an infrastructure developer than I'd like to admit, so there were a few crashes. Working remotely with the Hong Kong team, I got it stable and it ran without trouble for the rest of the experiment.

A couple of months ago we closed the funnel, and the international strategy team sat down to decide whether to keep going next financial year. They were keen, but there wasn't the budget. So after 18 months, I've hung up my hat on Presumi.

It helped tens of thousands of people find out what happened to their resume. Most of them never knew it was called Presumi.
