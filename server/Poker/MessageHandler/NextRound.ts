import { onMessage } from '../../SockerMessageHandler/onMessage';
import { RoundState } from '../RoundState';
import { PokerMessageHandler } from "./PokerMessageHandler";

interface NextRoundArgs {
    roomId: string;
}

export class NextRound extends PokerMessageHandler {
    @onMessage('next-round')
    public invoke({ roomId }: NextRoundArgs) {
      if (this.socket.rooms.has(roomId)) {
        const room = this.rooms[roomId];
        const userIndex = room.users.findIndex((user) => user.id === this.socket.data.id);
        if (userIndex !== -1 && this.socket.data.id === room.admin) {
          this.rooms[roomId].reveal = false;
          this.rooms[roomId].rounds[this.rooms[roomId].currentRound].state = RoundState.Complete;

          if (this.rooms[roomId].rounds.length - 1 > this.rooms[roomId].currentRound) {
            this.rooms[roomId].currentRound += 1;
            this.rooms[roomId].rounds[this.rooms[roomId].currentRound].state = RoundState.InProgress;
          } else {
            this.rooms[roomId].rounds.push({
              estimates: {},
              when: new Date(),
              title: '',
              state: RoundState.InProgress,
              storyPoints: undefined,
              externalLinks: {},
            });
            this.rooms[roomId].currentRound = this.rooms[roomId].rounds.length - 1;
          }
          this.updateRoom(room);
        }
      }
    }
}