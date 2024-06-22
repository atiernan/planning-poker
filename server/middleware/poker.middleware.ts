import { Socket, Server } from 'socket.io';
import type { Room } from '~/server/Poker/Room';
import { SetRoom } from '../Poker/MessageHandler/SetRoom';
import { Estimate } from '../Poker/MessageHandler/Estimate';
import { Reveal } from '../Poker/MessageHandler/Reveal';
import { NextRound } from '../Poker/MessageHandler/NextRound';
import { ClearEstimate } from '../Poker/MessageHandler/ClearEstimate';
import { UpdateRoomSettings } from '../Poker/MessageHandler/UpdateRoomSettings';
import { UpdateUserSettings } from '../Poker/MessageHandler/UpdateUserSettings';
import { AddExternalLink } from '../Poker/MessageHandler/AddExternalLink';

let server: Server | null = null;
const rooms: Record<string, Room> = {};

export default defineEventHandler((event) => {
  if (server !== null) {
    return
  }

  const node = event.node
  server = new Server(node.res.socket?.server)
  server.on('connection', (socket: Socket) => {
    const handlers = [
      SetRoom,
      Estimate,
      Reveal,
      NextRound,
      ClearEstimate,
      UpdateRoomSettings,
      UpdateUserSettings,
      AddExternalLink,
    ].map((Handler) => new Handler(socket, server as Server, rooms));

    socket.on('disconnecting', () => {
      socket.rooms.forEach((roomId) => {
        const room = rooms[roomId];
        if (room === undefined) {
          return;
        }

        const userIndex = room.users.findIndex((user) => user.id === socket.data.id);
        if (userIndex !== -1) {
          room.users.splice(userIndex, 1);
          if (room.users.length > 0 && room.admin === socket.data.id) {
            room.admin = room.users[0].id;
          } else if (room.users.length == 0) {
            delete rooms[roomId];
          }
          server?.in(room.id).emit('room-update', room);
        }
      });
    });
  })
});
