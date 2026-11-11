---
title: Building Streamdown
description: Why I built Streamdown, a React renderer for streaming Markdown, and the trade-offs behind its performance, plugins and security.
date: 2026-10-01
updated: 2026-10-11
---

In March 2004, [John Gruber released Markdown](https://daringfireball.net/2004/03/introducing_markdown), with Aaron Swartz as his sounding board. You wrote in plain text, ran a Perl script over the finished file and published the HTML. The script starts by reading the entire file into memory, under a comment that says "Slurp the whole file".

For almost twenty years that was a safe assumption. The person writing was the person publishing, and they were done before anyone read a word. In [Gruber's words](https://daringfireball.net/projects/markdown/syntax), "HTML is a publishing format; Markdown is a writing format."

Then chat apps started streaming answers in Markdown, written by a model, a few tokens at a time, while you watch.

I first ran into a version of this in January 2023, [streaming OpenAI completions](https://web.archive.org/web/20250422115411/https://www.haydenbleasel.com/blog/streaming-openai-completions-vercel-edge) through Vercel's Edge Runtime. Chunks kept arriving split halfway through a JSON object, so I wrapped `JSON.parse` in a try/catch and waited for the next one.

Two years later I was building [AI Elements](https://ui.shadcn.com/docs/ai-elements) at Vercel, and every demo, template and livestream had to render streamed Markdown. Each time we rebuilt it from react-markdown and a pile of plugins, and each time we hit the same problems. The response component kept absorbing fixes until it needed its own repo, and in August 2025 that became [Streamdown](https://streamdown.ai).

Looking back, it came down to a handful of ideas. Most held up. One I had to compromise on.

## Heal it, don't hide it

A half-streamed response looks broken. `**This is bol` renders as literal asterisks until the closing pair arrives, and a half-written link shows up as a raw URL.

You can deal with that in two ways. You can hide the unfinished part until it's complete, which is roughly what [Shopify's Sidekick](https://shopify.engineering/sidekicks-improved-streaming) did with a buffer on the server. Or you can guess what the model is about to write and render that instead.

Streamdown started out hiding unfinished links, and one of the [first issues](https://github.com/vercel/streamdown/issues/85) was that long links showed nothing at all until they finished. So I leaned into healing instead. Close whatever's still open, and give unfinished links a placeholder URL so the text shows up straight away. That logic grew into its own package, [Remend](/writing/remend).

The same thinking applied to everything around the text. Every component needed to know whether it was finished. Copy buttons stay disabled until a code block is complete, so nobody copies half a function. New words fade in, but only the new ones, so a re-render doesn't replay what you've already read. A caret shows the model is still going.

None of these are big features, but they're the difference between a response that's streaming and one that looks broken until it stops.

## Finished blocks don't change

The second problem was speed. Markdown parsers expect to convert a document once, and a chat app converts it on every chunk. If you re-parse the whole response each time, every update costs more than the last.

The fix comes from a simple observation. Once a model finishes a paragraph, that paragraph never changes again. So Streamdown splits the response into blocks, memoizes each one and only re-parses the last. Nico Albanese had written up the pattern in an [AI SDK recipe](https://ai-sdk.dev/cookbook/next/markdown-chatbot-with-memoization) the year before, and I made it the default so nobody had to know about it.

In a local benchmark, a 10KB response streamed in 24-character chunks had react-markdown spending around 10ms per update by the end, most of a 60fps frame. Streamdown stayed at about 0.6ms in that run.

My naive goal was to beat react-markdown everywhere, so in 1.6 I replaced it with our own renderer that caches the parser instead of rebuilding it every render. It didn't make parsing any faster. In those tests, the two benchmarked about the same, and rendering a whole document at once, Streamdown was a bit slower because every element came styled. The win was not doing work twice. I've come to think that's where most performance wins come from.

## Don't make people choose

The idea I cared about most was zero config. Every chat app needs code highlighting, math, diagrams and tables, and I didn't want developers assembling ten plugins to get there. I'd rather nobody has to choose between a good experience and a light one.

That included people reading in other languages. Every label can be translated and `dir="auto"` handles right-to-left text. A [CJK plugin](https://streamdown.ai/docs/plugins/cjk) also works around a [gap in CommonMark](https://github.com/commonmark/commonmark-spec/issues/650) where bold can break next to Chinese or Japanese punctuation. Models produce that constantly.

It's also the idea I had to compromise on. Bundling Shiki, KaTeX and Mermaid meant the build capped out around 12MB, which was [too big for some edge runtimes](https://github.com/vercel/streamdown/issues/157), and smaller bundles were the most requested fix after launch. The obvious answer was plugins. I resisted it for a while, because plugins put the choice back on the developer.

An average conversation only needs about a tenth of that bundle, so I experimented with loading the rest from a Streamdown CDN on demand. Pulling in code at runtime didn't fit our security policy, though, so in 2.1 code, math and Mermaid became plugins. The core is now about 150KB gzipped, and installing every plugin gets you back to zero config. I think that's a fair trade.

## Model output is user input

When you render your own writing, you trust the author. With a model you can't. A [prompt injection](https://simonwillison.net/2023/Apr/14/worst-that-can-happen/) can get it to write a link to a phishing page, or an image whose URL sends part of the conversation to someone else's server the moment it loads.

So I treated model output like anything a stranger types into your app. Streamdown launched on Malte Ubl's harden-react-markdown, and it now sanitizes HTML with GitHub's schema and can restrict where links and images point. When someone asked for a ChatGPT-style confirmation before opening links, I made it on by default. It costs the reader a click, and security features that are off by default mostly stay off.

## Split it out when it gets clever

Streamdown started as a component inside AI Elements. Remend started as a function inside Streamdown, and split out when someone asked to use it on its own. Both got their own package once they were intricate enough to need their own tests and releases.

There's an old idea behind this. Doug McIlroy, who invented the Unix pipe, is credited with the classic summary of the [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy). Write programs that do one thing well and work together, and write them to handle text streams, "because that is a universal interface."

Remend is about as literal an example as you'll find. A string goes in and a healed string comes out, so it can sit first in a pipeline of remend, then remark, then rehype. That's also why it ended up in places Streamdown never could, like [Hugging Face's](https://github.com/huggingface/chat-ui) Svelte chat UI, [Qwen Code](https://github.com/QwenLM/qwen-code)'s terminal UI and Slack via [Chat SDK](https://chat-sdk.dev).

That turned out to matter more than I expected, because an isolated package is one you can hand to AI. At first I asked Claude for more fixes, but there was no way to tell whether they were good. So I invested heavily in tests, then had Claude generate broken Markdown, check what Remend did with it, fix the handler and keep the test. By 2.3 the project had over 1,100 tests and, briefly, an empty bug backlog.

## Where it ended up

I left Vercel in March 2026. Since then, Vercel and the community have kept making it faster. Syntax highlighting is now [incremental](https://github.com/vercel/streamdown/pull/631), and [one round of main-thread fixes](https://github.com/vercel/streamdown/pull/635) took the share of frames that fit in a 60fps budget on a throttled CPU from 20% to 83%. I'm choosing to read that as a sign of a healthy project.

In the week ending September 30, 2026, npm recorded [about 8M downloads](https://api.npmjs.org/downloads/point/2026-09-24:2026-09-30/streamdown). It runs in [Supabase Studio](https://github.com/supabase/supabase), [Ollama](https://github.com/ollama/ollama), [Dify](https://github.com/langgenius/dify), [Langfuse](https://github.com/langfuse/langfuse) and [ElevenLabs UI](https://github.com/elevenlabs/ui).

Over the next few years, I think more of what we read on screens will be written by a model while we watch, and not only in chat. Renderers will have to assume the document isn't finished and wasn't written by someone they trust.

Gruber called Markdown a writing format. It still is. It's just not us doing the writing anymore.
