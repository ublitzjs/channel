# @ublitzjs/channel - REALLY fastest niche event emitter alternative

A blazing-fast, lightweight Pub/Sub event channel designed as a high-performance, type-safe alternative to Node's standard `EventEmitter`. 

![μBlitz.js](./logo.png)
<br/>

Built for performance-critical applications, it minimizes creation overhead and leverages an optimized swap-and-pop strategy to achieve **$O(1)$ unsubscription times** for unique listeners.

## Features

- **Ultra Low Overhead:** Faster instantiation and publication execution than standard event emitters.
- **$O(1)$ Removals:** True constant-time unsubscriptions via `sub_unique` and `unsub_unique`.
- **Self-Cleaning Listeners:** Easily create single-use (`once`) events mid-execution without breaking the dispatch loop.
- **No Dependencies:** Works in NodeJS, Bun and a Web browser
- **TypeScript-first** 
- **Prebuilt for ESM and CJS**
- **Thoroughly tested**

> ⚠️ **Important Note on Ordering:** To maintain extreme speed during deletions, the execution order of the remaining listeners is **not preserved** when a subscriber is removed.

---

## Benchmarks
- [NodeJS](./nodejs_benchmark.md)
- [Bun](./bunjs_benchmark.md)

## Installation

```bash
bun add @ublitzjs/channel 
```

## Quick Start
### Using a single Channel

If you use EventEmitter for only one event, use **Channel** directly
```typescript

import { Channel } from '@ublitzjs/channel';

// Define your payload type
type LogMessage = `[Log] ${string}`;

// Create a channel with a payload type
const logChannel = new Channel<LogMessage>();

// Subscribe to updates (like emitter.on)
const onLog = (msg: LogMessage) => console.log(`Received: ${msg}`);
logChannel.sub(onLog);

// Publish data (like emitter.emit)
logChannel.pub("[Log] User logged in successfully");

// Unsubscribe (like emitter.off)
logChannel.unsub(onLog);
```

## Using a ChannelMap (EventEmitter Style)

For multiple lazily created centralised events use **ChannelMap**
```typescript

import { ChannelMap } from '@ublitzjs/channel';

// 1. Define your Event Registry Map
interface AppEvents {
  'user:login': { id: number; username: string };
  'user:logout': { id: number };
}

// 2. Instantiate the Emitter Map
const emitter = new ChannelMap<AppEvents>();

// 3. Get the specific channel and subscribe
const loginChannel = emitter.on('user:login');

loginChannel.sub(({ username }) => {
  console.log(`Welcome back, ${username}!`);
});

// 4. Emit/Publish an event
loginChannel.pub({ id: 42, username: 'Neo' });
```

## Core Guide & Performance Optimization
1. Standard Subscription (sub / unsub)

Best used for listeners shared across multiple distinct channels or when you intend to subscribe the exact same function reference multiple times to a single channel.

    Unsubscription Cost: O(N) linear scan from the end of the array.

```typescript
channel.sub(myListener);
channel.unsub(myListener);
```

2. High-Performance Unique Subscription (sub_unique / unsub_unique)

Highly Recommended for hot code paths. By ensuring a listener is unique to this channel, the channel injects an internal tracking ID to achieve instant unsubscription.

    Unsubscription Cost: O(1) constant time.

```typescript
// The listener reference must be unique to this channel instance
const onDataReceived = (data) => processData(data);

channel.sub_unique(onDataReceived);

// Instantly removed in O(1) time complexity
channel.unsub_unique(onDataReceived); 
```

    🔴 Warning: Do not manually modify or rely on the id property appended to your callback function in your external application logic.

3. Single-Use / Self-Cleaning Listeners (unsubCurrent)

Perfect for implementing once() behavior. If listener is It is advised to call it at the top of a listener
```TypeScript

channel.sub((data) => {
  // Safely unsubscribes the callback while the channel is mid-publication
  channel.unsubCurrent();
  console.log("This will only run for the very first event dispatch:", data);
});

channel.sub(async (data)=>{
    channel.unsubCurrent();
    await doSomething(data);

    /* Do not call unsubCurrent() here */
})
```
