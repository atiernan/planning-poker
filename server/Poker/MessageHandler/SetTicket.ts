import { PokerMessageHandler } from "./PokerMessageHandler";
import { onMessage } from '../../SockerMessageHandler/onMessage';

interface SetTicketArgs {
    ticketId: string;
    roomId: string;
}

export class SetTicket extends PokerMessageHandler {
  @onMessage('set-ticket')
  public invoke({ roomId, ticketId }: SetTicketArgs) {
    if (this.socket.rooms.has(roomId)) {
      const room = this.rooms[roomId];
      const userIndex = room.users.findIndex((user) => user.id === this.socket.data.id);
      if (userIndex !== -1 && this.socket.data.id === room.admin) {
      }
    }
  }
}