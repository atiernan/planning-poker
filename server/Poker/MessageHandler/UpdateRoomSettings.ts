import { onMessage } from '../../SockerMessageHandler/onMessage';
import { Mode } from '../Mode';
import { PokerMessageHandler } from "./PokerMessageHandler";

interface UpdateRoomSettingsArgs {
    admin: string;
    roomId: string;
    possibleEstimates: string[];
    mode: Mode,
}

export class UpdateRoomSettings extends PokerMessageHandler {
  @onMessage('update-room-settings')
  public invoke({ roomId, admin, possibleEstimates, mode }: UpdateRoomSettingsArgs) {
    if (this.socket.rooms.has(roomId)) {
      const room = this.rooms[roomId];
      const userIndex = room.users.findIndex((user) => user.id === this.socket.data.id);
      if (userIndex !== -1 && room.admin === this.socket.data.id) {
        room.admin = admin;
        room.possibleEstimates = possibleEstimates;
        room.mode = mode;
        this.updateRoom(room);
      }
    }
  }
}