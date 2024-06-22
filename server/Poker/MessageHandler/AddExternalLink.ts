import { onMessage } from '../../SockerMessageHandler/onMessage';
import { getJiraTicket } from '../ExternalLinks/Jira';
import { SupportedLinks } from '../SupportedLinks';
import { PokerMessageHandler } from "./PokerMessageHandler";

interface AddExternalLinkArgs {
    roomId: string;
    round: number;
    link: {
      jira?: string;
    };
}

export class AddExternalLink extends PokerMessageHandler {
    @onMessage('add-external-link')
    public async invoke({ roomId, round, link }: AddExternalLinkArgs) {
      if (this.socket.rooms.has(roomId)) {
        const room = this.rooms[roomId];
        const userIndex = room.users.findIndex((user) => user.id === this.socket.data.id);
        if (userIndex !== -1 && this.socket.data.id === room.admin) {
          if (link.jira) {
            room.rounds[round].externalLinks.jira = await getJiraTicket(link.jira);
          }
          this.updateRoom(room);
        }
      }
    }
}