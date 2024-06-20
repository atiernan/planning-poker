import type { User } from './User';
import type { Round } from './Round';
import { Mode } from './Mode';

export interface Room {
    id: string;
    users: User[];
    rounds: Round[];
    possibleEstimates: string[];
    reveal: boolean;
    admin: string;
    mode: Mode;
    currentRound: number;
  }