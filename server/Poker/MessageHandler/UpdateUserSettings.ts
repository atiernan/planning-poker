import { PokerMessageHandler } from "./PokerMessageHandler";
import { onMessage } from '../../SockerMessageHandler/onMessage';
import { UserType } from "../UserType";

interface UpdateUserSettingsArgs {
    name: string;
    type: UserType;
}

export class UpdateUserSettings extends PokerMessageHandler {
  @onMessage('update-user-settings')
  public invoke({ name, type }: UpdateUserSettingsArgs) {
    this.socket.rooms.forEach((roomId) => {
      const room = this.rooms[roomId];
      if (room === undefined) {{
        return;
      }}
      const index = room.users.findIndex(({ id }) => id === this.socket.data.id);
      room.users[index].name = name;
      room.users[index].type = type;
      this.updateRoom(room);
    });
  }
}