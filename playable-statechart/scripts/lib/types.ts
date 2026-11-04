// Data model shared by the parser, layout, renderer and (as JSON) the HTML runtime.
// Erasable-syntax TypeScript only: Node 22.18+ runs it with type stripping, no build step.

export type Direction = 'LR' | 'TB' | 'RL' | 'BT';

export interface Guard {
  /** `when`/`while` → enabled if `text` matches an active state label; `unless` → enabled if it does not; `other` → not evaluated. */
  kind: 'when' | 'unless' | 'other';
  text: string;
}

export interface StateNode {
  id: string;
  label: string;
  kind: 'leaf' | 'composite';
  parent: string | null;
  /** Direct children in declaration order (composite only). */
  children: string[];
  /** Children grouped by `--` dividers. Length > 1 means parallel regions. */
  regions: string[][];
  /** Per region: the child entered on `[*]` (null when the region has none). Same length as `regions`. */
  initials: Array<string | null>;
  classes: string[];
}

export interface Transition {
  id: string;
  from: string;
  to: string;
  /** Label as written, guard brackets included. */
  label: string;
  /** Label with the trailing `[...]` removed. */
  text: string;
  guard: Guard | null;
  classes: string[];
}

export interface LegendEntry {
  id: string;
  label: string;
  classes: string[];
}

export interface Chart {
  title: string | null;
  direction: Direction;
  states: Record<string, StateNode>;
  /** Top-level state ids in declaration order (legend excluded). */
  roots: string[];
  /** Top-level ids entered on `[*]`. */
  initial: string[];
  /** Top-level ids with a `--> [*]` final transition. */
  finals: string[];
  transitions: Transition[];
  legend: LegendEntry[];
  classDefs: Record<string, string>;
}

export interface BugPathStep {
  /** Transition label that led here; null for step 0 (the start). */
  step: string | null;
  /** State label as the report prints it. */
  state: string;
}

export interface BugPath {
  rule: string;
  steps: BugPathStep[];
}

export interface Report {
  summary: string | null;
  bugs: BugPath[];
  holds: string[];
  notChecked: string[];
}
