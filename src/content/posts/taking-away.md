---
title: By taking away
description: Software used to be made like a painting, one layer at a time. With agents, it's closer to sculpture, and the hard part is seeing what to keep.
date: 2026-11-08
---

There's a Michelangelo quote I think about a lot: "The sculpture is already complete within the marble block, before I start my work. It is already there, I just have to chisel away the superfluous material."

He probably never said it. The line gets passed around without a source, and the earliest citation [anyone seems to give](https://wist.info/michelangelo/65044/) is a book from 1890.

He did write something close, in [a sonnet](<https://it.wikisource.org/wiki/Rime_(Michelangelo)/151._Non_ha_l%27ottimo_artista_alcun_concetto>) from around 1540:

> Non ha l'ottimo artista alcun concetto\
> c'un marmo solo in sé non circonscriva\
> col suo superchio, e solo a quello arriva\
> la man che ubbidisce all'intelletto.

Roughly, it says the best artist has no concetto (the idea in the artist's mind) that a single block of marble doesn't already hold inside its excess, and only the hand that obeys the intellect can reach it. It's also a love poem, probably to Vittoria Colonna.

Benedetto Varchi once asked artists whether painting or sculpture was the greater art. In 1549, [Michelangelo answered](https://art1010student.commons.gc.cuny.edu/wp-content/blogs.dir/8854/files/2018/01/Michelangelo-on-the-arts_renaissance.pdf) that sculpture is made "per forza di levare", by taking away. Work made "per via di porre", by putting on, is like painting.

## Putting on

For most of my career, products were made by putting on. Building was the expensive part, so you couldn't afford to build the wrong thing. You built the smallest version you could and added to it from there.

The [minimum viable product](https://en.wikipedia.org/wiki/Minimum_viable_product) gave that a name. Frank Robinson coined the term in 2001, and Eric Ries later defined it as the version that collects "the maximum amount of validated learning about customers with the least effort". It was never about writing less code, more about learning before you'd spent much.

What got built was small, but the idea behind it was usually much bigger. Every product I've worked on started as something nebulous: an outcome I wanted, without a clear shape. Getting from there to a product that makes sense to me and to other people has always taken a lot of carving. Most of it happened in my head, on whiteboards and in Figma, before anything got built.

When building is expensive, you carve in your head and put on in the product. Now you can build the idea before you've finished carving it.

## Taking away

A one-shot often comes back with more than you asked for: features, screens, settings and states you hadn't thought about yet. Even when it doesn't, adding things is so cheap that you keep going.

When I started [Blume](https://useblume.dev), I wrote a plan with a roadmap of ten milestones. I'd written it the way I've always written roadmaps, as if each milestone would take a few weeks. The agent built [all ten in 63 minutes](https://github.com/haydenbleasel/blume/commits/45566dbb).

When putting on costs nothing, you end up with a block.

I think that's the real shift. The carving has moved out of your head and into the product. What people now call taste is mostly knowing what to take away, which means seeing the finished thing before you start.

Most of the carving I do now is product work. I decide which options a user ever sees, what can be detected instead of configured and what should always be on. The code underneath changes a lot, but the decisions are about shape.

I think a reductive approach is behind most great interfaces. AI chat apps are a good example, collapsing whole dashboards into one composer. Carving is how you get there.

## The wax model

The statue waiting in the block is a bit of a myth too. Michelangelo worked from small models in wax and clay. The V&A has [the wax sketch](https://collections.vam.ac.uk/item/O70293) for his Young Slave, and Benvenuto Cellini wrote that [sculptors always made small models](https://camws.org/sites/default/files/meeting2015/Abstracts2015/216.Michelangelomyth.pdf). Giorgio Vasari describes Michelangelo lowering the water over a wax model in a basin and carving whatever surfaced next. (Vasari [never watched him carve](https://www.thehistoryblog.com/?p=61906), so it might just be a good story.)

So he did both. He put on in wax and took away in marble, and the seeing happened in the small model.

That's why I don't think the MVP is dead. You still need the small version to learn from. You carve down to it now, instead of building up to it.

My wax model is the end result. Before a one-shot, I try to picture the finished design and explain it to the agent. I describe what the interface looks like and what the developer experience feels like, and sketch roughly how things should work. An agent can't see your mental model unless you describe it, so it'll pick the most obvious implementation, which might not be the one that scales the way you want.

A wax model can say too much, though. My plan for Blume described everything it might ever do, and the agent built all of it. Next time, I'd leave most of the integrations out of the first version, so I could see where people need them most and how to build them flexibly.

## New blocks

Marble doesn't let you change your mind. Michelangelo spent most of 1505 [at the quarries in Carrara](https://en.wikipedia.org/wiki/Tomb_of_Pope_Julius_II), choosing the blocks for a single tomb. Once he started carving, every strike was permanent.

Painters have always had more room. When an arm or a horizon the artist painted over shows through later, it's called a [pentimento](https://en.wikipedia.org/wiki/Pentimento), from the Italian for repentance.

Code has always been closer to painting. Software engineers have the luxury of malleability, at least for a while. You can revert a cut, or ask for three versions and pick one in a few minutes. Agents give you the sculptor's process with the painter's second chances, so you can carve much harder than a sculptor ever could.

Every block anchors you, though. Carve a dashboard and you'll get a better dashboard, never the composer that replaces it. My rule depends on how much came back. If it's so complex that I can't form a mental model of it, I don't start carving. I go back and start again with a more focused prompt.

## What a cut costs

Software stays easy to cut until people depend on it. After that, every cut is a breaking change, and removing something means a migration path: a clear error, a hint naming the replacement and maybe an upgrade command. The biggest cuts are easiest before a first release, when nobody relies on anything yet.

A cut also leaves pieces behind. A linter will find dead code, but not dead features, like a config option that still validates when nothing reads it anymore. Agents are good at finding those in [review](/writing/two-kinds-of-code-review) sweeps after a big cut.

## Three, not twenty

Not everything in the block is superfluous, and overcarving is a failure too. Features are cheap enough now that v1 can include most of what people want, instead of a year-long roadmap.

When something I've cut has come back, it's come back in a different shape. The test is whether each piece belongs, however much ends up left.

It's easy to generate 20 integrations at once now. I think it's better to generate the three most popular, ship them as v1 and iterate quickly. That's where the MVP comes back. The block can hold everything, and you still carve down to something small enough to learn from.

## The stone

A one-shot's block is made of the model's defaults. Models have good fidelity, but they're same-y by default, so the block tends to look like everyone else's. With specific skills and instructions, they do exceptional work. That's how I made the new [ultracite.ai](https://www.ultracite.ai) brand.

So part of taste moves upstream, into what the block is made of.

## The hand

The sonnet doesn't quite say taste is all that matters. The figure is only reached by the hand that obeys the intellect, so the hand counts too. Carving cleanly takes real engineering, and someone has to know how to remove a feature without breaking the people using it.

I think the hand is the agent's now. Agents do the carving, and they write the code better than I would. What's left for me is knowing what a clean cut looks like: where a boundary goes, what should be inferred and what should be rejected. That's taste too, applied to structure.

In the Accademia in Florence, four of Michelangelo's [Prisoners](https://smarthistory.org/michelangelo-unfinished-slaves-accademia/) are still half inside their blocks. He carved them for a tomb that was never finished the way he planned it. Software ends up with a few of those too. Knowing which pieces to finish is the part I can't hand off.
