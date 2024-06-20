import { SockerMessageHandler } from "../../SockerMessageHandler/SocketMessageHandler";
import type { Room } from '../Room';
import type { Server, Socket } from "socket.io";

export class PokerMessageHandler extends SockerMessageHandler {
    constructor(
        readonly socket: Socket,
        readonly server: Server,
        protected readonly rooms: Record<string, Room>
    ) {
        super(socket, server);
    }

    protected updateRoom(room: Room) {
        this.server?.in(room.id).emit('room-update', room);
    }
}