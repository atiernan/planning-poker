import type { Room } from "~/server/Poker/Room";
import { useSocket } from "./useSocket";
import type { Mode } from "~/server/Poker/Mode";
import type { UserType } from "~/server/Poker/UserType";
import type { SupportedLinks } from "~/server/Poker/SupportedLinks";

export function usePokerSocket(roomId: string) {
    const room = ref<null | Room>(null);
    const userId = ref<null | string>(null);
    const { sendMessage, onMessage, connected } = useSocket();
    const isAdmin = computed(() => room.value?.admin === userId.value);
    const selectedEstimate = computed(() => {
        if (room.value === null || userId.value === null || room.value.rounds[room.value.currentRound].estimates[userId.value] === undefined) {
            return '';
        }

        return room.value.rounds[room.value.currentRound].estimates[userId.value].estimate;
    });
    
    onMessage('room-update', (updatedRoom: Room) => {
        room.value = updatedRoom;
    });
    onMessage('user-id', (newUserId: string) => userId.value = newUserId);

    function joinRoom(name: string, userType: UserType) {
        sendMessage('set-room', { roomId, name, userType });
    }

    function estimate(value: string) {
        if (room.value == null || room.value.reveal === true) {
            return;
        }

        const currentEstimate = room.value.rounds[room.value.currentRound].estimates[userId.value ?? '']
        if (currentEstimate !== undefined && currentEstimate.estimate === value) {
            sendMessage('clear-estimate', { roomId });
        } else {
            sendMessage('estimate', { estimate: value, roomId });
        }
    }

    function reveal() {
        if (isAdmin.value) {
            sendMessage('reveal', { roomId });
        }
    }

    function nextRound() {
        if (isAdmin.value) {
            sendMessage('next-round', { roomId });
        }
    }
    
    function updateRoomSettings(admin: string, possibleEstimates: string[], mode: Mode) {
        if (isAdmin.value) {
            sendMessage('update-room-settings', { roomId, admin, possibleEstimates, mode });
        }
    }

    function setTicket(ticketId: string) {
        if (isAdmin.value) {
            sendMessage('set-ticket', { roomId, ticketId });
        }
    }

    function updateUserSettings(name: string, type: UserType) {
        sendMessage('update-user-settings', { name, type });
    }

    function addExternalLink(round: number, link: SupportedLinks) {
        sendMessage('add-external-link', { roomId, round, link });
    }
    
    return {
        joinRoom,
        room,
        estimate,
        isAdmin,
        reveal,
        nextRound,
        selectedEstimate,
        connected,
        updateRoomSettings,
        setTicket,
        updateUserSettings,
        addExternalLink,
    };
}