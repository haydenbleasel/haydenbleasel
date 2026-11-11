---
title: Self-healing Markdown
description: How Remend repairs half-written Markdown while a model is still writing it, and why the hard part is knowing when not to.
date: 2026-10-06
updated: 2026-10-11
---

The most downloaded thing I built at Vercel mostly adds asterisks to the end of strings.

It's called [Remend](https://www.npmjs.com/package/remend), and npm recorded [about 12M downloads in the week ending October 5, 2026](https://api.npmjs.org/downloads/point/2026-09-29:2026-10-05/remend). I built it for [Streamdown](/writing/streamdown). It's also probably the most interesting thing I worked on there, which is a strange thing to say about a pile of regular expressions.

Here's the problem it solves. A few milliseconds into a bold phrase, a streaming model has written this much:

<!-- prettier-ignore -->
```md
**This is bol
```

Most Markdown renderers show exactly that, asterisks and all, until the closing pair arrives. That's the spec doing its job. [CommonMark](https://spec.commonmark.org/0.31.2/#delimiter-run) treats an unmatched `**` as literal text until something closes it, which made sense when people finished writing before they published.

HTML went the other way. Browsers have rendered broken markup since the early web, and HTML5 eventually wrote down exactly how to repair it. My favorite part of that spec is the bit that untangles `<b><i></b></i>`, which is called the [adoption agency algorithm](https://html.spec.whatwg.org/multipage/parsing.html#adoption-agency-algorithm) because it moves elements to new parents. So if a browser receives `<b>This is bol`, it shows bold text straight away. Markdown never needed anything like that, until models started writing it in front of us.

## Self-healing Markdown

While I was building Streamdown, Vercel was talking a lot about "self-driving infrastructure", and at some point I said something like "it'd be cool if we had self-healing Markdown". It was a throwaway line, but it's more or less what Remend does: repair the Markdown before the parser sees it, so it renders the way the model meant it to. The name is mostly alliteration. Markdown in JavaScript usually runs through remark and rehype, and remend goes first.

The first version looked roughly like this:

```ts
const heal = (text: string) => {
  const count = text.split("**").length - 1;

  return count % 2 === 1 ? `${text}**` : text;
};
```

Count the bold markers, and if there's an odd number, close the last one. Do the same for italics, inline code and strikethrough. It's asterisks and underscores. How hard could it be?

## Every asterisk is a decision

Within a week of launch, Gemini users found that their lists grew a [stray asterisk](https://github.com/vercel/streamdown/issues/33). Gemini formats lists as `*   item`, so every list marker was being counted as italics. Rule one: an asterisk at the start of a line, followed by a space, is a list.

Then `5 * 0` came out with an [extra asterisk](https://github.com/vercel/streamdown/issues/370). CommonMark already has an answer for this: a delimiter with whitespace on both sides can't open or close emphasis. Rule two: read the spec.

Then an image [gained an underscore](https://github.com/vercel/streamdown/issues/284), but only when it was the only image in the response. Its URL had one `_` in it, so the count was odd. With two images, the underscores paired up and the bug disappeared. That's the purest failure of counting I've seen.

The same thing broke `snake_case` until John McCambridge [fixed it](https://github.com/vercel/streamdown/pull/125), and the very first issue anyone filed on Streamdown was [underscores inside math](https://github.com/vercel/streamdown/issues/1). Rule three: a character means different things in a URL, a word, an equation and a sentence. A single `$` is almost always a price, which is why single-dollar math is off by default. Otherwise "can I have $20 please" turns into an equation.

Then a Mermaid diagram containing `[*] --> Idle` grew a stray `*` after the code block. Rule four: code beats prose. Nothing inside a code block gets healed.

My favorite is the setext heading. In Markdown, a line of dashes under a paragraph turns that paragraph into a heading. So when a model starts a list with `-`, for one frame the whole paragraph above it becomes an `<h2>`. The fix is to append a zero-width space, an invisible character that's just enough to stop the parser reading the dash as an underline. Rule five: sometimes the best fix is one nobody can see.

As of October 6, 2026, Remend has 14 handlers that run in priority order, plus a scanner that labels every character as prose or code before any of them run. It's around 2,600 lines, and almost all of it is edge cases like these.

## When not to guess

CPUs make this kind of guess constantly. When a branch depends on a value that hasn't arrived yet, the processor predicts which way it'll go and runs ahead, then throws the work away if it was wrong. That's cheap, because the program never sees a bad guess. In 1996, Jacobsen, Rotenberg and Smith [argued](https://ericrotenberg.wordpress.ncsu.edu/files/2025/06/paper_MICRO-29_jrs.pdf) that once wrong guesses get expensive, a processor should only speculate when it's confident.

Remend's wrong guesses are on screen, so that's its rule too. It only heals when it's clear something is unfinished. `my name is **` stays literal, because there's nothing to close yet. The parallel stops at rollback. A CPU checkpoints and rewinds, but Remend just runs again on the next chunk, so a bad guess usually only lasts until the next chunk arrives.

Being cautious has a cost. Sometimes the asterisks still flash, and people have a name for that now: [FOUM](https://github.com/vercel/streamdown/issues/539), a flash of unstyled Markdown. It's still not always right, either. `The glob *.ts matches files.` comes out in italics. I'd still rather see a few asterisks than have Remend confidently rewrite someone's sentence.

## How it got good

At first I asked my coding assistant for more fixes, and it did an okay job, but there was no way to tell whether a fix was good. So I started investing heavily in tests. My agent would generate broken Markdown, I'd check what Remend did with it, fix the handler and keep the test. The library slowly turned into a list of everything a model had ever done to it.

After someone asked to use the healing logic without the rest of Streamdown, we split it out into its own package in December 2025. By February it had 100% test coverage. In my last week at Vercel, I added a corpus of 102 broken Markdown variants, with sections like "formatting cut mid-marker" and "confusing asterisk sequences".

Since I left, contributors have taken it further than I did. Farnabaz and Ben Drucker rewrote the core as a single-pass scanner that follows CommonMark's rules for code. Vikram Bhamre fixed a [quadratic scan](https://github.com/vercel/streamdown/pull/574) that cost 915ms per chunk on a long, unclosed code block, which now takes 0.4ms. There are property tests that heal every prefix of a document and check the result against a real CommonMark parser. By October 6, 2026, it had 524 tests.

## Bigger than Streamdown

Most of the projects using Remend don't use Streamdown at all: [Hugging Face's chat UI](https://github.com/huggingface/chat-ui) with Svelte and marked, [Qwen Code](https://github.com/QwenLM/qwen-code) in the terminal, Vercel's [Chat SDK](https://chat-sdk.dev) in Slack, Streamlit, Metabase and MUI X. Software Mansion built [React Native Streamdown](https://github.com/software-mansion-labs/react-native-streamdown) on it, and someone ported it to Dart.

I don't think it'll stay a Markdown problem. Anything a model streams arrives unfinished. In 2023 I was patching JSON that arrived in pieces, and by March we were auto-closing JSX tags in [AI Elements](https://vercel.com/changelog/ai-elements-1-9). I'd expect most formats that models write to need a healer like this before long.

In 1979, Jon Postel wrote that network software should accept any input it can interpret and "not object to technical errors where the meaning is still clear." It's usually remembered as the [robustness principle](https://www.rfc-editor.org/ien/ien111.txt), or "be liberal in what you accept", and it has its critics. [RFC 9413](https://www.rfc-editor.org/rfc/rfc9413) argues that quietly tolerating bad input lets mistakes become permanent.

I think Remend's answer is the part of Postel's sentence that usually gets dropped. Only fix things where the meaning is still clear.
