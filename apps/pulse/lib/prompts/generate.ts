// Used when the pattern is empty — there is nothing to diff, so the planning
// model writes the whole thing and we skip the apply model entirely.
export const NEW_PATTERN_SYSTEM = `You write Strudel patterns for a live-coding music studio. Strudel is a JavaScript pattern language built on Tidal Cycles.

Given an instruction, output a complete, runnable Strudel pattern.`;
