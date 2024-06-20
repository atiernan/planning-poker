import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { ref } from 'vue';

type OnMessageHandler = (...args: any[]) => void;

export function useSocket() {
    let socket: Socket | undefined;
    const connected = ref(false);

    const sendMessage = (channel: string, message: any) => {
        socket?.emit(channel, message)
    }

    const onMessage = (channel: string, callback: OnMessageHandler) => {
        const registerCallback = () => {
            if (socket === undefined) {
                nextTick(() => registerCallback());
            } else {
                socket?.on(channel, (...args) => callback(...args));
            }
        };
        registerCallback();
    }

    onMounted(async () => {
        socket = io(`${location.protocol === 'https:' ? 'wss://' : 'ws://' }${location.host}`);
        socket.on('connect', () => connected.value = true);
    });

    onUnmounted(() => {
        socket?.disconnect()
    });

    return { sendMessage, onMessage, connected };
}