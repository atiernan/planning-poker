import type { Estimate } from "./Estimate";
import type { RoundState } from "./RoundState";

export interface Round {
    title: string;
    when: Date;
    estimates: Record<string, Estimate>;
    state: RoundState;
    storyPoints: number | undefined;
}