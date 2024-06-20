import { onMessage } from '../../SockerMessageHandler/onMessage';
import { PokerMessageHandler } from "./PokerMessageHandler";

interface EstimateArgs {
    estimate: string;
    roomId: string;
}

export class Estimate extends PokerMessageHandler {
    @onMessage('estimate')
    public invoke({ estimate, roomId }: EstimateArgs) {
      if (this.socket.rooms.has(roomId)) {
        const room = this.rooms[roomId];
        const userIndex = room.users.findIndex((user) => user.id === this.socket.data.id);
        if (userIndex !== -1 && room.reveal !== true) {
        room.rounds[room.currentRound].estimates[this.socket.data.id] = {
          userId: this.socket.data.id,
          estimate,
          name: room.users[userIndex].name,
        };

        this.updateRoom(room);
        }
      }
    }
}