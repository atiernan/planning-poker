import { onMessage } from '../../SockerMessageHandler/onMessage';
import { PokerMessageHandler } from "./PokerMessageHandler";

interface ClearEstimateArgs {
    estimate: string;
    roomId: string;
}

export class ClearEstimate extends PokerMessageHandler {
  @onMessage('clear-estimate')
  public invoke({ roomId }: ClearEstimateArgs) {
    if (this.socket.rooms.has(roomId)) {
      const room = this.rooms[roomId];
      const userIndex = room.users.findIndex((user) => user.id === this.socket.data.id);
      if (userIndex !== -1) {
        delete room.rounds[room.rounds.length - 1].estimates[this.socket.data.id];
        this.updateRoom(room);
      }
    }
  }
}