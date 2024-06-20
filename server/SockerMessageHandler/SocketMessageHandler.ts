import type { Server, Socket } from "socket.io";

interface EventCallback {
    (...args: any[]): void
}

interface EventHandler {
    event: string;
    callback: EventCallback;
}

export class SockerMessageHandler {
    constructor(
        protected readonly socket: Socket,
        protected readonly server: Server,
    ) {
        this.registerEvents();
    }

    protected registerEvents(): void {
        const meta = Object.getPrototypeOf(this)[Symbol.metadata];
        if (!Array.isArray(meta.events)) {
            return;
        }
        meta.events.forEach(({ event, callback }: EventHandler) => {
            this.socket.on(event, (...args: any[]) => {
                callback.call(this, ...args);
            });
        });
    }
}