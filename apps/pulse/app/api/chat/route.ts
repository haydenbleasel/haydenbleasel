import { createGateway, generateText, streamText } from "ai";

import { AI_TOKEN_HEADER } from "@/lib/ai-token";

export const maxDuration = 60;

const STRUDEL_BASICS = `Strudel basics:
- Mini-notation drives patterns: \`s("bd hh sd hh")\` for samples, \`note("c e g")\` or \`n("0 2 4")\` for pitched parts. \`*\` repeats (\`hh*4\`), \`~\` rests, \`<>\` alternates per cycle, \`[]\` groups, \`,\` stacks.
- Common functions: \`stack\`, \`cat\`, \`seq\`, \`note\`, \`n\`, \`s\`, \`sound\`, \`bank\`, \`gain\`, \`pan\`, \`room\`, \`delay\`, \`lpf\`, \`hpf\`, \`cutoff\`, \`fast\`, \`slow\`, \`rev\`, \`every\`, \`chop\`, \`jux\`, \`scale\`, \`struct\`, \`euclid\`.
- Tempo: \`setcps(0.5)\` (cycles per second) or \`setcpm(120)\`.
- Compose with \`stack(...)\` for layers, and chain transforms like \`.fast(2)\`, \`.slow(2)\`, \`.rev()\`, \`.jux(rev)\`.`;

// Without an explicit list, models invent plausible-but-nonexistent sound names
// (e.g. "clap" instead of the abbreviation "cp", or "gm_funk_guitar" which isn't
// a real soundfont), which throw `sound X not found` at playback. These are the
// names actually loaded by the prebake in lib/strudel.ts — keep the two in sync.
const STRUDEL_SOUNDS = `Sounds — use ONLY names from the lists below. Never invent sound or instrument names.

Drums (bare names play the default EmuSP12 kit): bd sd hh oh cp cr rd rim lt mt ht cb perc. The clap is \`cp\` — never "clap". Switch drum machine with \`.bank(...)\`, e.g. \`s("bd cp hh*4").bank("RolandTR909")\` (the abbreviations stay the same).
Drum-machine bank names: RolandTR808 RolandTR909 RolandTR707 RolandTR727 RolandTR626 RolandTR606 RolandTR505 LinnDrum LinnLM1 LinnLM2 Linn9000 AkaiMPC60 AkaiLinn OberheimDMX AlesisHR16 AlesisSR16 BossDR55 BossDR110 BossDR220 BossDR550 KorgM1 CasioRZ1 RhythmAce EmuSP12.

Synths (use with note/n, no samples needed): sine sawtooth square triangle; noise: white pink brown crackle.

Other sample banks (bare names): piano casio crow east insect jazz metal num numbers space wind, plus mridangam and VCSL orchestral samples.

Soundfonts (pitched — use with note/n, e.g. \`note("c2 g2").s("gm_acoustic_bass")\`). The ONLY valid gm_ names, grouped by family:
- Keys: gm_acoustic_piano gm_bright_acoustic_piano gm_electric_grand_piano gm_honky_tonk_piano gm_epiano1 gm_epiano2 gm_harpsichord gm_clavinet gm_piano
- Chromatic perc: gm_celesta gm_glockenspiel gm_music_box gm_vibraphone gm_marimba gm_xylophone gm_tubular_bells gm_dulcimer
- Organ/accordion: gm_drawbar_organ gm_percussive_organ gm_rock_organ gm_church_organ gm_reed_organ gm_accordion gm_harmonica gm_bandoneon
- Guitar: gm_acoustic_guitar_nylon gm_acoustic_guitar_steel gm_electric_guitar_jazz gm_electric_guitar_clean gm_electric_guitar_muted gm_overdriven_guitar gm_distortion_guitar gm_guitar_harmonics
- Bass: gm_acoustic_bass gm_electric_bass_finger gm_electric_bass_pick gm_fretless_bass gm_slap_bass_1 gm_slap_bass_2 gm_synth_bass_1 gm_synth_bass_2
- Strings/orchestral: gm_violin gm_viola gm_cello gm_contrabass gm_tremolo_strings gm_pizzicato_strings gm_orchestral_harp gm_timpani gm_string_ensemble_1 gm_string_ensemble_2 gm_synth_strings_1 gm_synth_strings_2
- Voice: gm_choir_aahs gm_voice_oohs gm_synth_choir gm_orchestra_hit
- Brass: gm_trumpet gm_trombone gm_tuba gm_muted_trumpet gm_french_horn gm_brass_section gm_synth_brass_1 gm_synth_brass_2
- Reed: gm_soprano_sax gm_alto_sax gm_tenor_sax gm_baritone_sax gm_oboe gm_english_horn gm_bassoon gm_clarinet
- Pipe: gm_piccolo gm_flute gm_recorder gm_pan_flute gm_blown_bottle gm_shakuhachi gm_whistle gm_ocarina
- Synth lead: gm_lead_1_square gm_lead_2_sawtooth gm_lead_3_calliope gm_lead_4_chiff gm_lead_5_charang gm_lead_6_voice gm_lead_7_fifths gm_lead_8_bass_lead
- Synth pad: gm_pad_new_age gm_pad_warm gm_pad_poly gm_pad_choir gm_pad_bowed gm_pad_metallic gm_pad_halo gm_pad_sweep
- Synth FX: gm_fx_rain gm_fx_soundtrack gm_fx_crystal gm_fx_atmosphere gm_fx_brightness gm_fx_goblins gm_fx_echoes gm_fx_sci_fi
- Ethnic: gm_sitar gm_banjo gm_shamisen gm_koto gm_kalimba gm_bagpipe gm_fiddle gm_shanai
- Percussive: gm_tinkle_bell gm_agogo gm_steel_drums gm_woodblock gm_taiko_drum gm_melodic_tom gm_synth_drum gm_reverse_cymbal
- Sound FX: gm_guitar_fret_noise gm_breath_noise gm_seashore gm_bird_tweet gm_telephone gm_helicopter gm_applause gm_gunshot`;

// Used when the pattern is empty — there is nothing to diff, so the planning
// model writes the whole thing and we skip the apply model entirely.
const NEW_PATTERN_SYSTEM = `You write Strudel patterns for a live-coding music studio. Strudel is a JavaScript pattern language built on Tidal Cycles.

Given an instruction, output a complete, runnable Strudel pattern.

${STRUDEL_BASICS}

${STRUDEL_SOUNDS}`;

// The planning half of the pipeline. The planning model reads the current
// pattern and the instruction and emits a *lazy* edit snippet; Morph then
// merges it into the full file, so the model never rewrites untouched code.
const PLAN_SYSTEM = `You are the planning half of a two-stage code editor for a live-coding music studio that uses Strudel — a JavaScript pattern language built on Tidal Cycles.

You receive the current Strudel pattern and an edit instruction. Emit a *lazy edit snippet*: only the lines that change, using the marker

// ... existing code ...

to stand in for each run of unchanged lines. A separate apply model merges your snippet into the full file, so you never rewrite untouched code.

Rules:
- Keep one or two real lines of surrounding context around each change so the snippet can be located unambiguously.
- Put a \`// ... existing code ...\` marker wherever you skip unchanged lines — including the start and end of the file if it continues there. Any region you neither show nor cover with a marker is treated as deleted.
- To delete lines, show the kept line just before and just after the deletion next to each other, with no marker between them.
- Output ONLY the snippet. No prose, no explanations, no Markdown code fences.

${STRUDEL_BASICS}

${STRUDEL_SOUNDS}`;

const PLAN_MODEL = "anthropic/claude-sonnet-4.6";
const APPLY_MODEL = "morph/morph-v3-fast";

// Strudel is a niche DSL and the lazy-marker format is unforgiving (an unmarked
// region gets deleted on merge), so the planning model needs real reasoning.
// Sonnet runs with extended thinking enabled; the AI SDK keeps thinking out of
// `.text` (and out of the text stream), so only the snippet flows on to Morph.
const THINKING_BUDGET = 4096;

const PLAN_PROVIDER_OPTIONS = {
  anthropic: {
    thinking: { budgetTokens: THINKING_BUDGET, type: "enabled" },
  },
};

// The model is told not to fence its output, but strip a wrapping fence
// defensively so a stray ```js never leaks into the snippet or the new pattern.
const stripFences = (text: string): string => {
  const fenced = text.match(
    /^```(?:js|javascript|strudel)?\s*\n([\s\S]*?)\n```\s*$/u
  );
  return (fenced?.[1] ?? text).trim();
};

export const POST = async (req: Request) => {
  const apiKey = req.headers.get(AI_TOKEN_HEADER)?.trim();
  if (!apiKey) {
    return new Response("Add your AI Gateway key in Settings to use the AI.", {
      status: 401,
    });
  }

  const {
    prompt,
    currentCode,
    activePath,
  }: {
    prompt: string;
    currentCode?: string;
    activePath?: string | null;
  } = await req.json();

  const gateway = createGateway({ apiKey });
  const source = currentCode ?? "";

  // New / empty pattern: nothing to diff, so generate the whole pattern directly.
  if (source.trim().length === 0) {
    const result = streamText({
      model: gateway(PLAN_MODEL),
      prompt: [
        activePath ? `New pattern: ${activePath}` : "New pattern.",
        "",
        "Instruction:",
        prompt,
      ].join("\n"),
      providerOptions: PLAN_PROVIDER_OPTIONS,
      system: NEW_PATTERN_SYSTEM,
    });
    return result.toTextStreamResponse();
  }

  // Existing pattern: Claude plans a lazy snippet, Morph applies it.
  let snippet: string;
  try {
    const planned = await generateText({
      model: gateway(PLAN_MODEL),
      prompt: [
        activePath ? `Active pattern: ${activePath}` : "",
        "Current pattern:",
        "```js",
        source,
        "```",
        "",
        "Edit instruction:",
        prompt,
      ].join("\n"),
      providerOptions: PLAN_PROVIDER_OPTIONS,
      system: PLAN_SYSTEM,
    });
    snippet = stripFences(planned.text);
  } catch (error) {
    return new Response(`Planning step failed: ${String(error)}`, {
      status: 502,
    });
  }

  if (snippet.length === 0) {
    return new Response("Model returned no edit.", { status: 422 });
  }

  // Morph wants the instruction, the full original file, and the lazy snippet
  // as a single user message, with deterministic sampling.
  const merged = streamText({
    messages: [
      {
        content: `<instruction>${prompt}</instruction>\n<code>${source}</code>\n<update>${snippet}</update>`,
        role: "user",
      },
    ],
    model: gateway(APPLY_MODEL),
    topP: 1,
  });

  return merged.toTextStreamResponse();
};
