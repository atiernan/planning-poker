import { PokerMessageHandler } from "./PokerMessageHandler";
import { onMessage } from '../../SockerMessageHandler/onMessage';
import type { Room } from "../Room";
import { Mode } from "../Mode";
import { RoundState } from "../RoundState";
import { UserType } from "../UserType";

interface SetRoomArgs {
    name: string;
    roomId: string;
    userType: UserType;
}

export class SetRoom extends PokerMessageHandler {
    @onMessage('set-room')
    public invoke({ roomId, name, userType }: SetRoomArgs) {
        this.socket.data.id = this.socket.id;
        if (this.rooms[roomId] === undefined || this.rooms[roomId].users.length === 0) {
          this.rooms[roomId] = this.createEmptyRoom(roomId, this.socket.id);
        }
  
        this.rooms[roomId].users.push({
          id: this.socket.data.id,
          name: name,
          type: userType,
        });
        this.socket.join(roomId);
        this.server.in(roomId).emit('room-update', this.rooms[roomId]);
        this.socket.emit('user-id', this.socket.data.id);
    }

    private createEmptyRoom(roomId: string, adminId: string): Room {
        return {
            id: roomId,
            users: [],
            rounds: [{
                estimates: {},
                when: new Date(),
                title: '',
                state: RoundState.InProgress,
                storyPoints: undefined,
                externalLinks: {},
            }],
            possibleEstimates: ['0', '½', '1', '2', '3', '5', '8', '13', '20', '40', '100', '☕'],
            reveal: false,
            admin: adminId,
            mode: Mode.Advanced,
            currentRound: 0,
            externalLinks: {
                jira: process.env.JIRA_HOST !== undefined,
            }
        }
    }
}