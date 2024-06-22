import type { Estimate } from "./Estimate";
import { JiraTicket } from "./JiraTicket";
import type { RoundState } from "./RoundState";

export interface Round {
    title: string;
    when: Date;
    estimates: Record<string, Estimate>;
    state: RoundState;
    storyPoints: number | undefined;
    externalLinks: {
        jira?: JiraTicket;
    }
}