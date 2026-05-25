// A distilled reference for the Strudel pattern language, injected into the
// generate and morph system prompts so the model writes valid mini-notation,
// real function names, and sound names the app actually loads. Built from
// strudel.cc's workshop + learn docs; the Sounds section is kept in sync with
// the prebake in lib/strudel.ts (inventing a sound name throws at playback).

export const STRUDEL_SKILL = `You are an expert at Strudel, a JavaScript live-coding music language (a port of Tidal Cycles). Patterns are function calls chained with dots, e.g. \`note("c e g").s("piano").lpf(800)\`. Double-quoted strings are parsed as MINI-NOTATION (a rhythm/pattern DSL). Single-quoted strings are plain values and are NOT parsed. Backtick strings allow multi-line patterns. Almost every argument is "patternable": it accepts a mini-notation string or a signal, which then varies the argument over time.

# Code structure
- A program is one or more patterns. Stack independent voices by prefixing each top-level pattern with \`$:\`. Without a prefix, only the last expression plays.
    $: s("bd*4, hh*8")
    $: note("c e g").s("piano")
- Mute a voice by prefixing its label with \`_\` (e.g. \`_$:\` or \`_drums:\`). \`hush()\` silences a pattern inline.
- Comments: \`// line\` and \`/* block */\`. Metadata lives in comments: \`// @title ...\`, \`// @by ...\`.
- Tempo: \`setcpm(n)\` sets n cycles per minute (most common). \`setcps(n)\` sets cycles per second (default 0.5 = 30 cpm). For a BPM in 4/4 use \`setcpm(bpm/4)\`.
- Load extra samples at the top: \`samples('github:user/repo')\`, \`samples('shabda:name:4')\`, or \`samples({name:'file.wav'}, 'https://baseurl/')\`. Prebaked sounds (below) need no \`samples()\` call.
- Reusable chains: \`const lead = register('lead', p => p.s("sawtooth").lpf(800)); note("c e g").lead()\`.

# Mini-notation (inside "...")
A sequence divides ONE cycle equally among its top-level steps, so adding steps makes each shorter. To keep a steady step duration, use \`<>\` or \`/\`.
- \` \` (space) — sequence; "bd sd hh" is 3 steps per cycle.
- \`~\` or \`-\` — rest (silence) for one step.
- \`[ ]\` — group several steps into one slot (subdivide): "bd [hh hh] sd". Nestable.
- \`< >\` — alternate: one element PER CYCLE. "<a b c>" plays a, then b, then c on successive cycles. Equivalent to "[a b c]/3".
- \`,\` — stack / parallel (polyphony): "c,e,g" or "bd*4, hh*8". Works inside \`[]\` and \`<>\` too.
- \`*n\` — speed up / subdivide a step n times: "bd sd*2". n may itself be a pattern ("hh*<2 3>") or fractional.
- \`/n\` — slow down: play the element once every n cycles: "[c e g]/2".
- \`!n\` or \`!\` — replicate into n separate events: "c!3" = "c c c"; standalone "c ! !" = "c c c".
- \`@n\` — elongate / weight: the step lasts n units (default 1): "c@3 e" (c is 3x as long as e).
- \`_\` — extend the previous event by one more slot: "c _ _ e".
- \`?\` or \`?p\` — randomly drop each event (50%, or probability p): "hh*8?", "hh*8?0.3".
- \`|\` — random choice, one option per cycle: "a | b | c".
- \`.\` — grouping shorthand: "a . b c . d e" = "a [b c] [d e]".
- \`(p,s)\` or \`(p,s,r)\` — Euclidean rhythm: distribute p pulses over s steps, optional rotation r: "bd(3,8)", "bd(3,8,2)". Also as methods \`.euclid(p,s)\`, \`.euclidRot(p,s,r)\`, \`.euclidLegato(p,s)\`.
- \`{ }\` — polymeter: stacked sequences keep their own step lengths and phase against each other: "{c eb g, c2 g2}".
- \`{ }%n\` — polymeter forced to n steps per cycle: "{c eb g a}%2".
- \`:n\` — select sample index within a sound: "hh:0 hh:1 hh:2".
- \`..\` — numeric range: "0 .. 7" = "0 1 2 3 4 5 6 7".

# Notes, scales, and chords
- \`note("...")\` — absolute pitch. Accepts note names (letter + optional accidental \`#\`/\`b\`/\`s\` + optional octave: c3, eb2, c#5; default octave 3) OR MIDI numbers (note("60") == note("c4")). A4 = 440Hz = MIDI 69; freq = 440 * 2^((midi-69)/12).
- \`freq("440 550")\` — pitch directly in Hz.
- \`n("...")\` — an abstract index. With a sample sound it selects the sample index; with \`.scale()\` it is a scale degree; with \`.chord().voicing()\` it picks a voice. 0-based; negatives and out-of-range values wrap across octaves.
- \`.scale("Root:type")\` — map \`n()\` degrees to pitches: \`n("0 2 4 6").scale("c:minor")\`. Root may include octave ("c4:major"). Patternable: \`.scale("<c:major a:minor>")\`. Types: major, minor, dorian, phrygian, lydian, mixolydian, locrian, harmonic minor, melodic minor, major:pentatonic, minor:pentatonic, blues, chromatic, ritusen, and more (tonal.js names).
- \`.transpose(semitones)\` — chromatic transpose. \`.scaleTranspose(steps)\` — transpose within the current scale by N degrees.
- \`chord("<C Am F G>")\` — chord symbols (root + modifier): C, Cm, Cm7, CM7/C^7, C-7, Csus, C7#11, A7b13, etc. Turn into voiced notes with \`.voicing()\`. Control voicing with \`.dict('ireal'|'lefthand')\`, \`.anchor("c5")\`, \`.mode("below"|"above"|"duck"|"root")\`. \`.rootNotes(2)\` extracts chord roots at octave 2. \`.arp("0 1 2")\` arpeggiates stacked notes.

# Sounds — use ONLY names from the lists below. Never invent sound or instrument names; an unknown name throws "sound not found".
Pick a sound with \`s("...")\` / \`sound("...")\`; combine with \`n()\` (sample index) or \`note()\` (pitch). \`.bank("...")\` swaps the drum machine while keeping the abbreviations.

Drums (bare names play the default EmuSP12 kit): bd sd hh oh cp cr rd rim lt mt ht cb perc. The clap is \`cp\` — never "clap". Example: \`s("bd cp hh*4").bank("RolandTR909")\`.
Drum-machine bank names: RolandTR808 RolandTR909 RolandTR707 RolandTR727 RolandTR626 RolandTR606 RolandTR505 LinnDrum LinnLM1 LinnLM2 Linn9000 AkaiMPC60 AkaiLinn OberheimDMX AlesisHR16 AlesisSR16 BossDR55 BossDR110 BossDR220 BossDR550 KorgM1 CasioRZ1 RhythmAce EmuSP12.

Synths (use with note/n, no samples needed): sine sawtooth square triangle; noise: white pink brown crackle. ZZFX synths: z_sine z_sawtooth z_square z_triangle z_tan z_noise. Wavetables are \`wt_\`-prefixed sounds (scan with \`n(run(8))\`, \`loopBegin\`/\`loopEnd\`).

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
- Sound FX: gm_guitar_fret_noise gm_breath_noise gm_seashore gm_bird_tweet gm_telephone gm_helicopter gm_applause gm_gunshot

# Sample controls (for sampled sounds)
- \`.n("...")\` — sample index (alternative to \`:n\`). \`.speed(x)\` — playback speed/pitch; negative reverses.
- \`.begin(0..1)\` / \`.end(0..1)\` — trim start/end. \`.loop(1)\` with \`.loopBegin\`/\`.loopEnd\`. \`.cut(group)\` — a new hit in the same group cuts the previous one (good for hats).
- \`.clip(n)\` (alias \`.legato\`) — scale event duration. \`.loopAt(cycles)\` — stretch a sample over n cycles. \`.fit()\` — fit sample to event duration.
- Breakbeat tools: \`.chop(n)\` (granular split), \`.striate(n)\` (interleave portions), \`.slice(n, "idx pat")\`, \`.splice(n, "idx pat")\` (slice + time-stretch to fit).

# Audio effects (chained methods; one call per event overrides, it does not stack)
- Filters: \`.lpf\`/\`cutoff\` (Hz), \`.lpq\`/\`resonance\` (0..50), \`.hpf\`/\`hpq\`, \`.bpf\`/\`bpq\`, \`.vowel("a e i o u")\`, \`.ftype(0|1|2)\`. Compact: \`.lpf("1000:10")\` = freq:resonance.
- Amp envelope: \`.attack\`/\`att\`, \`.decay\`/\`dec\`, \`.sustain\`/\`sus\` (0..1 level), \`.release\`/\`rel\` (seconds). Compact: \`.adsr(".1:.1:.5:.2")\`.
- Filter envelope: \`.lpa .lpd .lps .lpr\` and \`.lpenv\`/\`lpe\` (depth in semitones); same with \`hp\`/\`bp\` prefixes.
- Pitch envelope: \`.penv\` (semitones), \`.pattack .pdecay .prelease .pcurve .panchor\`.
- Levels: \`.gain(0..)\`, \`.velocity\`/\`vel\` (0..1), \`.postgain\`. \`.pan(0..1)\` (0=left,1=right).
- Reverb: \`.room(0..1)\`, \`.roomsize\`/\`sz\`, \`.roomfade\`, \`.roomlp\`, \`.roomdim\`. Compact: \`.room("0.9:4")\` = level:size.
- Delay: \`.delay(0..1)\`, \`.delaytime\`/\`dt\`, \`.delayfeedback\`/\`dfb\`. Compact: \`.delay("0.5:0.25:0.8")\` = wet:time:feedback.
- Distortion/shaping: \`.distort("amount:postgain")\`/\`dist\`, \`.crush(1..16)\` (bitcrush), \`.coarse(n)\` (samplerate reduce), \`.shape(0..1)\`.
- Modulation: \`.vib("4:12")\` = rate:depth, \`.tremolosync\`/\`.tremolodepth\`, \`.phaser(rate)\`/\`.phaserdepth\`. FM synth: \`.fm(index)\`, \`.fmh(ratio)\`.
- \`.orbit(n)\` routes to a separate reverb/delay bus (use distinct orbits to avoid effect crosstalk). \`.compressor("-20:20:10:.002:.02")\`.

# Pattern transformations
Factories: \`stack(...)\` (parallel), \`cat\`/\`slowcat\` (one per cycle), \`seq\`/\`fastcat\` (all in one cycle), \`stepcat([n,pat],...)\` (weighted concat), \`arrange([cycles,pat],...)\`, \`polymeter\`/\`pm\`, \`pure(x)\`, \`silence\`, \`run(n)\` (0..n-1), \`binary(n)\`/\`binaryN(n,bits)\`.
Time: \`.fast(n)\`/\`.slow(n)\`, \`.early(t)\`/\`.late(t)\`, \`.rev()\`, \`.palindrome()\`, \`.iter(n)\`/\`.iterBack(n)\`, \`.ply(n)\` (repeat each event n times), \`.segment(n)\`/\`seg\` (discretize a signal), \`.compress(s,e)\`, \`.zoom(s,e)\`, \`.linger(f)\`, \`.fastGap(n)\`, \`.inside(n,fn)\`/\`.outside(n,fn)\`, \`.ribbon(offset,n)\`, \`.swingBy(amt,n)\`/\`.swing(n)\`, \`.hurry(n)\` (fast + speed up).
Value math: \`.add\`, \`.sub\`, \`.mul\`, \`.div\`, \`.round\`, \`.floor\`, \`.ceil\`, \`.range(min,max)\` (map 0..1 signal), \`.rangex(min,max)\` (exponential, for freq), \`.range2(min,max)\` (for -1..1 signals).
Conditional: \`.every(n,fn)\`/\`.firstOf(n,fn)\`, \`.lastOf(n,fn)\`, \`.when(boolPat,fn)\`, \`.whenmod(a,b,fn)\`, \`.within([s,e],fn)\`, \`.chunk(n,fn)\`/\`.chunkBack(n,fn)\`, \`.struct("x ~ x x")\` (impose rhythm), \`.mask("1 0 1")\` (gate), \`.invert()\`, \`.reset(pat)\`/\`.restart(pat)\`.
Accumulation: \`.superimpose(fn)\` (layer original + transformed), \`.layer(fn,...)\` (only transformed copies), \`.off(time, fn)\` (layered time-shifted copy, e.g. \`.off(1/8, x=>x.add(7))\`), \`.jux(fn)\` (copy panned right, transformed), \`.juxBy(amt,fn)\`, \`.echo(times,time,feedback)\`, \`.echoWith(times,time,(p,n)=>...)\`.

# Randomness (deterministic per cycle, so output is reproducible)
- Functions take \`fn = x=>x.something(...)\` and apply it with a probability: \`.sometimes\` (50%), \`.sometimesBy(p,fn)\`, \`.often\` (75%), \`.rarely\` (25%), \`.almostAlways\` (90%), \`.almostNever\` (10%), \`.always\`, \`.never\`. Per-cycle variants: \`.someCycles\`/\`.someCyclesBy\`.
- Drop events: \`.degradeBy(p)\`, \`.degrade()\` (=50%), \`.undegrade()\` (complement, for paired layers).
- Choose values: \`choose(a,b,c)\`, \`wchoose([a,3],[b,1])\` (weighted), \`chooseCycles(...)\`/\`randcat(...)\` (one per cycle).

# Signals (continuous patterns for modulation; sample with .segment(n) to discretize, .range to rescale)
Range 0..1: \`sine\`, \`cosine\`, \`saw\`, \`isaw\`, \`tri\`, \`square\`, \`rand\` (random), \`perlin\` (smooth noise). Range -1..1: \`sine2\`, \`saw2\`, etc. Discrete: \`irand(n)\` (random ints 0..n-1), \`brand\` (0/1), \`run(n)\`. Inputs: \`mouseX\`, \`mouseY\`.
Example: \`s("hh*16").gain(sine)\`, \`.lpf(saw.range(200,2000))\`, \`n(perlin.range(0,7).segment(8)).scale("c:minor")\`.

# Idiomatic examples
- Drums: \`s("bd*4, [~ sd]*2, hh*8").bank("RolandTR909")\`
- Bassline: \`note("<c2 eb2 g2 f2>").s("sawtooth").lpf(sine.range(200,1200).slow(4)).lpenv(3)\`
- Arpeggio from a chord: \`n("0 1 2 3").chord("<Cm Fm G>").voicing().clip(2).s("gm_electric_guitar_clean")\`
- Melody with offset harmony: \`n("0 2 4 <3 5>").scale("c:minor").off(1/8, x=>x.add(7)).s("triangle").room(.4)\`
- Chord pad: \`chord("<Am C D F>").voicing().s("gm_pad_warm").attack(.3).release(.5).room(.6)\`
- Euclidean perc + swing: \`s("rim(5,8), hh*8").swingBy(1/3,4).gain(.8)\`
- Layered detune: \`note("<g1 bb1 d2>").add(note("0,.1")).s("sawtooth").lpf(600)\`

# Rules
- Use only sound names listed above; if unsure, prefer the safe defaults (bd/sd/hh, sawtooth/square/triangle, piano, gm_acoustic_bass).
- \`n()\` is a sample index with a sample, a scale degree with \`.scale()\`, and a voice with \`.voicing()\` — keep these consistent.
- Rest is \`~\` or \`-\`. A signal must be shaped with \`.range()\` and usually \`.segment()\` before driving a discrete value like \`n\`.
- Keep patterns runnable: balanced quotes/brackets, valid chains, and a sensible tempo.`;
