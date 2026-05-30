"use strict";

/**
 * A callback function used as a listener in a `Channel`.
 * * @template T The type of data payload this callback receives.
 * * @note This type is mutated internally with an `id` property to achieve $O(1)$ lookup times during unsubscription. 
 * **Do not manually modify or rely on the `id` property in external code.**
 */
export type ChannelCB<T> = ((data: T) => void) & { id?: number };

/**
 * An optimized Pub/Sub event channel designed as a high-performance, scalable alternative to the standard `EventEmitter`.
 * Features $O(1)$ removals for unique listeners and faster creation overhead.
 * @template MessageType The type of data payload published by this channel.
 * @note The order of listeners is **not preserved** when removing subscribers.
 * @see Inspired by tseep.
 * @example
 * type LogMessage = `[Log] ${string}`;
 * const logChannel = new Channel<LogMessage>();
 * const onLog = (msg: LogMessage) => console.log(msg);
 * logChannel.sub_unique(onLog);
 * logChannel.pub("[Log] User logged in");
 * logChannel.unsub_unique(onLog);
 */
export class Channel<MessageType> {
  protected cbs: ChannelCB<MessageType>[] = [];
  protected i: number = 0;

  /**
   * Indicates whether the channel currently has no active listeners.
   */
  get isEmpty(): boolean { return !this.cbs.length; }

  /**
   * Subscribes a listener to the channel. 
   * Use this for general listeners, that you reuse in many Channel instances OR when you need to register a listener several times OR or removal order doesn't matter.
   * @example
   * channel.sub((data) => console.log(data));
   */
  sub(fn: ChannelCB<MessageType>): void {
    this.cbs.push(fn);  
  }

  /**
   * Subscribes a unique listener to the channel and attaches an internal ID metadata property.
   * Use this alongside `unsub_unique` to achieve constant time $O(1)$ unsubscription performance.
   * @example
   * const onEvent = (data) => console.log(data);
   * channel.sub_unique(onEvent);
   */
  sub_unique(fn: ChannelCB<MessageType>): void {
    var cbs = this.cbs; 
    (fn as any).id = cbs.length; 
    cbs.push(fn);  
  }

  /**
   * Unsubscribes a listener by performing a linear scan from the end of the array.
   * @warning This method alters the execution order of the remaining listeners.
   * @example
   * channel.unsub(onEvent);
   */
  unsub(fn: ChannelCB<MessageType>): void {
    for(var i = this.cbs.length - 1; i >= 0; i--) {
      if(this.cbs[i] != fn) continue;

      if(i == this.cbs.length - 1) {
        this.cbs.pop();
      } else {
        let newCb = (this.cbs[i] = this.cbs.pop()!); newCb.id = i;
      }

      break;
    }
  }

  /**
   * Unsubscribes a listener previously registered via `sub_unique`.
   * Leverages the internal `id` property to swap and pop elements in $O(1)$ time.
   * @warning This method alters the execution order of the remaining listeners.
   * @example
   * channel.unsub_unique(onEvent);
   */
  unsub_unique(fn: ChannelCB<MessageType>): void {
    var id: number = (fn as any).id;
    if (id == this.cbs.length - 1) {
      this.cbs.pop();
    } else {
      let newCb = (this.cbs[id] = this.cbs.pop()!); newCb.id = id;
    }
  }

  /**
   * Unsubscribes the listener that is **currently executing** during a publication cycle.
   * Useful for writing single-use ("once") listeners or self-cleaning hooks.
   * @warning This method alters the execution order of the remaining listeners.
   * @example
   * channel.sub((msg) => {
   *   console.log("Runs only once:", msg);
   *   channel.unsubCurrent();
   * });
   */
  unsubCurrent(): void {
    var cbs = this.cbs;
    if(this.i == cbs.length - 1) {cbs.pop(); return;};
    var newCb = (cbs[this.i] = cbs.pop()!); newCb.id = this.i--;
  }

  /**
   * Publishes data synchronously to all registered listeners.
   * Listeners can be safely removed mid-execution via `unsubCurrent()`.
   * @example
   * channel.pub({ eventType: "click", x: 10, y: 20 });
   */
  pub(data: MessageType): void {
    var cbs = this.cbs;
    while(this.i < cbs.length) {
      cbs[this.i]!(data);
      this.i++;
    }
    this.i = 0;
  } 

  /**
   * Drops all registered listeners from the channel instantly.
   */
  clear(): void { this.cbs = []; }
}

/**
 * A strongly-typed map wrapper that dynamically manages distinct named `Channel` instances.
 * Acts as a minimal simulation of EventEmitter
 * For event names use should use strings performance-wise
 * @template EventMap Type definition containing event names mapped to their respective payloads.
 * @example
 * interface Events {
 *   login: { username: string };
 * }
 * const emitter = new ChannelMap<Events>();
 * var channel = emitter.on("login");
 * channel.sub(({ username }) => console.log(username));
 * channel.pub({ username: "Neo" });
 */
export class ChannelMap<
  EventMap extends Record<string | number | symbol, any>
> {
  /* Map get initialised lazily*/
  protected events: EventMap = {} as any;

  /**
   * Retrieves or instantiates the specific `Channel` instance tied to an event name.
   * @param ev The event name/key.
   * @returns The `Channel` handling the event payload type.
   */
  on<Event extends keyof EventMap>(ev: Event): Channel<EventMap[Event]> {
    return this.events[ev] ??= new Channel() as any;
  }
  /** 
   * @param ev The optional event name/key. If present - clears the channel for event. Otherwise - remove all channels
   */
  removeAllListeners(ev?: keyof EventMap) {
    ev ? this.events[ev]?.clear() : this.events = {} as any;
  }
}
