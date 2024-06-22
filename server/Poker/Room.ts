import type { User } from './User';
import type { Round } from './Round';
import { Mode } from './Mode';
import type { SupportedLinks } from './SupportedLinks';

export interface Room {
    id: string;
    users: User[];
    rounds: Round[];
    possibleEstimates: string[];
    reveal: boolean;
    admin: string;
    mode: Mode;
    currentRound: number;
    externalLinks: SupportedLinks
  }