import type { EditorView } from "@codemirror/view";
import {
  flash,
  highlightMiniLocations,
  updateMiniLocations,
} from "@strudel/codemirror";
// Avoid `@strudel/web` — its dist bundle inlines @strudel/core + superdough,
// which collides with our direct imports and produces two parallel soundMaps
// (samples register in one, the cyclist queries the other).
import { evalScope, setTime } from "@strudel/core";
import { Drawer } from "@strudel/draw";
import { miniAllStrings } from "@strudel/mini";
import { registerSoundfonts } from "@strudel/soundfonts";
import { transpiler } from "@strudel/transpiler";
import type { StrudelRepl } from "@strudel/web";
import {
  aliasBank,
  getAudioContext,
  initAudioOnFirstClick,
  registerSynthSounds,
  registerZZFXSounds,
  samples,
  webaudioRepl,
} from "@strudel/webaudio";

const CDN = "https://strudel.b-cdn.net";

// Mirrors strudel.cc's website/src/repl/prebake.mjs so s("bd"), bank("RolandTR909"),
// and the rest of the playground sample set work the same way locally.
const prebake = async () => {
  await Promise.all([
    registerZZFXSounds(),
    registerSoundfonts(),
    // EmuSP12 is strudel.cc's default drum kit — it registers the bare names
    // (bd, sd, hh, oh, cp, cr, rd, rim, lt, mt, ht, cb, perc) so `s("bd hh sd")`
    // plays without a .bank(). Its samples live under the tidal-drum-machines tree.
    samples(`${CDN}/EmuSP12.json`, `${CDN}/tidal-drum-machines/machines/`, {
      prebake: true,
      tag: "drum-machines",
    }),
    samples(`${CDN}/piano.json`, `${CDN}/piano/`, { prebake: true }),
    samples(`${CDN}/vcsl.json`, `${CDN}/VCSL/`, { prebake: true }),
    samples(
      `${CDN}/tidal-drum-machines.json`,
      `${CDN}/tidal-drum-machines/machines/`,
      { prebake: true, tag: "drum-machines" }
    ),
    samples(`${CDN}/uzu-drumkit.json`, `${CDN}/uzu-drumkit/`, {
      prebake: true,
      tag: "drum-machines",
    }),
    samples(`${CDN}/uzu-wavetables.json`, `${CDN}/uzu-wavetables/`, {
      prebake: true,
    }),
    samples(`${CDN}/mridangam.json`, `${CDN}/mrid/`, {
      prebake: true,
      tag: "drum-machines",
    }),
    samples(
      {
        casio: ["casio/high.wav", "casio/low.wav", "casio/noise.wav"],
        crow: [
          "crow/000_crow.wav",
          "crow/001_crow2.wav",
          "crow/002_crow3.wav",
          "crow/003_crow4.wav",
        ],
        east: [
          "east/000_nipon_wood_block.wav",
          "east/001_ohkawa_mute.wav",
          "east/002_ohkawa_open.wav",
          "east/003_shime_hi.wav",
          "east/004_shime_hi_2.wav",
          "east/005_shime_mute.wav",
          "east/006_taiko_1.wav",
          "east/007_taiko_2.wav",
          "east/008_taiko_3.wav",
        ],
        insect: [
          "insect/000_everglades_conehead.wav",
          "insect/001_robust_shieldback.wav",
          "insect/002_seashore_meadow_katydid.wav",
        ],
        jazz: [
          "jazz/000_BD.wav",
          "jazz/001_CB.wav",
          "jazz/002_FX.wav",
          "jazz/003_HH.wav",
          "jazz/004_OH.wav",
          "jazz/005_P1.wav",
          "jazz/006_P2.wav",
          "jazz/007_SN.wav",
        ],
        metal: [
          "metal/000_0.wav",
          "metal/001_1.wav",
          "metal/002_2.wav",
          "metal/003_3.wav",
          "metal/004_4.wav",
          "metal/005_5.wav",
          "metal/006_6.wav",
          "metal/007_7.wav",
          "metal/008_8.wav",
          "metal/009_9.wav",
        ],
        num: [
          "num/00.wav",
          "num/01.wav",
          "num/02.wav",
          "num/03.wav",
          "num/04.wav",
          "num/05.wav",
          "num/06.wav",
          "num/07.wav",
          "num/08.wav",
          "num/09.wav",
          "num/10.wav",
          "num/11.wav",
          "num/12.wav",
          "num/13.wav",
          "num/14.wav",
          "num/15.wav",
          "num/16.wav",
          "num/17.wav",
          "num/18.wav",
          "num/19.wav",
          "num/20.wav",
        ],
        numbers: [
          "numbers/0.wav",
          "numbers/1.wav",
          "numbers/2.wav",
          "numbers/3.wav",
          "numbers/4.wav",
          "numbers/5.wav",
          "numbers/6.wav",
          "numbers/7.wav",
          "numbers/8.wav",
        ],
        space: [
          "space/000_0.wav",
          "space/001_1.wav",
          "space/002_11.wav",
          "space/003_12.wav",
          "space/004_13.wav",
          "space/005_14.wav",
          "space/006_15.wav",
          "space/007_16.wav",
          "space/008_17.wav",
          "space/009_18.wav",
          "space/010_2.wav",
          "space/011_3.wav",
          "space/012_4.wav",
          "space/013_5.wav",
          "space/014_6.wav",
          "space/015_7.wav",
          "space/016_8.wav",
          "space/017_9.wav",
        ],
        wind: [
          "wind/000_wind1.wav",
          "wind/001_wind10.wav",
          "wind/002_wind2.wav",
          "wind/003_wind3.wav",
          "wind/004_wind4.wav",
          "wind/005_wind5.wav",
          "wind/006_wind6.wav",
          "wind/007_wind7.wav",
          "wind/008_wind8.wav",
          "wind/009_wind9.wav",
        ],
      },
      `${CDN}/Dirt-Samples/`,
      { prebake: true }
    ),
  ]);
  aliasBank(`${CDN}/tidal-drum-machines-alias.json`);
};

let editorView: EditorView | null = null;
let initPromise: Promise<StrudelRepl> | null = null;
let replInstance: StrudelRepl | null = null;
let audioReady: Promise<void> | null = null;

export const setEditorView = (view: EditorView | null) => {
  editorView = view;
};

const init = (): Promise<StrudelRepl> => {
  if (!initPromise) {
    audioReady = initAudioOnFirstClick();
    miniAllStrings();

    const drawer = new Drawer(
      (haps, time) => {
        if (!editorView) {
          return;
        }
        const active = haps.filter((hap) => hap.isActive(time));
        highlightMiniLocations(editorView, time, active);
      },
      [0, 0]
    );

    const repl = webaudioRepl({
      afterEval: ({
        meta,
      }: {
        meta?: { miniLocations?: [number, number][] };
      }) => {
        if (!editorView) {
          return;
        }
        updateMiniLocations(editorView, meta?.miniLocations ?? []);
        drawer.invalidate(repl.scheduler);
      },
      onToggle: (started: boolean) => {
        if (started) {
          drawer.start(repl.scheduler);
        } else {
          drawer.stop();
          if (editorView) {
            updateMiniLocations(editorView, []);
          }
        }
      },
      transpiler,
    }) as StrudelRepl;
    replInstance = repl;
    setTime(() => (repl.scheduler as { now: () => number }).now());

    initPromise = (async () => {
      const loadModules = evalScope(
        evalScope,
        import("@strudel/core"),
        import("@strudel/mini"),
        import("@strudel/tonal"),
        import("@strudel/webaudio"),
        {
          evaluate: (code: string) => repl.evaluate(code, true),
          hush: () => repl.stop(),
        }
      );
      await Promise.all([loadModules, registerSynthSounds()]);
      await prebake();
      return repl;
    })();
  }
  return initPromise;
};

if (typeof window !== "undefined") {
  init();
}

export const play = async (code: string) => {
  // Resume the AudioContext synchronously inside the user gesture,
  // before any await yields control. Otherwise browsers reject the
  // resume and playback is silent until the second click.
  const ctx = getAudioContext();
  const resuming = ctx.state === "running" ? null : ctx.resume();

  const repl = await init();
  if (audioReady) {
    await audioReady;
  }
  if (resuming) {
    await resuming;
  }
  if (editorView) {
    flash(editorView);
  }
  await repl.evaluate(code, true);
};

export const stop = () => {
  replInstance?.stop();
};
