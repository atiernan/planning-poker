interface Context {
    name: string;
    metadata: Record<PropertyKey, unknown>;
}

export function onMessage(event: string) {
  return (target: any, context: string): void => {
    if (!target[Symbol.metadata]) {
        target[Symbol.metadata] = {};
    }
    
    if (!target[Symbol.metadata].events) {
        target[Symbol.metadata].events = [];
    }

    target[Symbol.metadata].events = [{ event, callback: target[context] }, ...target[Symbol.metadata].events];
  };
}
