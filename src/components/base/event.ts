type EventHandler<T = unknown> = (data: T) => void;

export class EventEmitter {
  private events: Record<string, EventHandler[]> = {};

  on<T = unknown>(event: string, callback: EventHandler<T>): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback as EventHandler);
    return () => this.off(event, callback);
  }

  off<T = unknown>(event: string, callback: EventHandler<T>): void {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter(
      (handler) => handler !== callback
    );

    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }

  emit<T = unknown>(event: string, data?: T): void {
    if (!this.events[event]) return;
    const handlers = [...this.events[event]];

    for (const handler of handlers) {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event "${event}" handler:`, error);
      }
    }
  }

  once<T = unknown>(event: string, callback: EventHandler<T>): void {
    const onceHandler: EventHandler<T> = (data) => {
      this.off(event, onceHandler);
      callback(data);
    };
    this.on(event, onceHandler);
  }

  getEventListeners(event?: string): Record<string, number> | number {
    if (event) {
      return this.events[event]?.length || 0;
    }

    return Object.fromEntries(
      Object.entries(this.events).map(([key, handlers]) => [key, handlers.length])
    );
  }
  
  clear(event?: string): void {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}