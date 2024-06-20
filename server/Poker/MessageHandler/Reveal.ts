import { onMessage } from '../../SockerMessageHandler/onMessage';
import { PokerMessageHandler } from "./PokerMessageHandler";

interface RevealArgs {
    roomId: string;
}

export class Reveal extends PokerMessageHandler {
    @onMessage('reveal')
    public invoke({ roomId }: RevealArgs) {
      if (this.socket.rooms.has(roomId)) {
        const room = this.rooms[roomId];
        const userIndex = room.users.findIndex((user) => user.id === this.socket.data.id);
        if (userIndex !== -1 && this.socket.data.id === room.admin) {
          this.rooms[roomId].reveal = true;
          this.updateRoom(room);
        }
      }
    }
}