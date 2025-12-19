https://github.com/grammyjs/grammY
https://grammy.dev/guide/

`pnpm i grammy`

# grammY Framework - LLM Reference

## Overview
grammY is a TypeScript-first framework for building Telegram bots that runs on Node.js, Deno, and browsers. It provides a robust middleware system, extensive plugin ecosystem, and scalable architecture for bots of any complexity.

**Official Resources:**
- Docs: https://grammy.dev
- API Reference: https://grammy.dev/ref
- GitHub: https://github.com/grammyjs/grammY
- Community Chat: https://t.me/grammyjs

## Core Concepts

### Bot Instance
The `Bot` class is the main entry point. It handles updates and orchestrates middleware.

```typescript
import { Bot } from "grammy";
const bot = new Bot(process.env.BOT_TOKEN);
```

### Context (`ctx`)
Represents an incoming update with helpful shortcuts:
- `ctx.message` - Received message
- `ctx.callbackQuery` - Inline button click
- `ctx.reply()` - Reply in same chat
- `ctx.api` - Raw Bot API access

### Middleware System
Updates flow through a stack of middleware functions. Each middleware can:
- Process the update
- Modify context
- Pass control to next middleware (`await next()`)
- Short-circuit the chain

## Installation

### Node.js
```bash
npm install grammy
# or
yarn add grammy
# or
pnpm add grammy
```

### Deno
```typescript
import { Bot } from "https://deno.land/x/grammy@v1.38.3/mod.ts";
```

## Basic Bot Structure

```typescript
import { Bot } from "grammy";

const bot = new Bot("YOUR_BOT_TOKEN");

// Command handler
bot.command("start", async (ctx) => {
  await ctx.reply("Welcome!");
});

// Message handler with filtering
bot.on("message:text", async (ctx) => {
  await ctx.reply(`Echo: ${ctx.message.text}`);
});

// Error handling
bot.catch((err) => {
  console.error("Bot error:", err);
});

// Start bot (long polling)
bot.start();

// For webhooks: bot.start({ webhook: { domain: "..." } })
```

## Key APIs

### Message Handling
```typescript
bot.on("message", handler);                    // All messages
bot.on("message:text", handler);               // Text only
bot.on("message:photo", handler);              // Photos only
bot.command("help", handler);                  // /help command
bot.hears(/echo (.+)/, handler);               // Regex match
bot.filter((ctx) => condition, handler);       // Custom filter
```

### Sending Messages
```typescript
// Via context (convenience)
await ctx.reply("text", { parse_mode: "HTML" });

// Via bot.api (explicit)
await bot.api.sendMessage(chatId, "text", {
  parse_mode: "MarkdownV2",
  reply_parameters: { message_id: replyToId }
});

// Methods for all Telegram APIs: sendPhoto, sendDocument, etc.
```

### Media & Files
```typescript
// Sending files
await ctx.replyWithPhoto(fileIdOrUrl);
await ctx.replyWithDocument(new InputFile("local/path"));

// Downloading
const file = await ctx.getFile();
const data = await file.download();
```

## Plugin Ecosystem

### Essential Plugins

**Conversations** - Stateful multi-step dialogs
```typescript
import { conversations, createConversation } from "@grammyjs/conversations";

bot.use(conversations());

async function greeting(conversation, ctx) {
  await ctx.reply("What's your name?");
  const { message } = await conversation.waitFor("message:text");
  await ctx.reply(`Hello, ${message.text}!`);
}

bot.use(createConversation(greeting));
bot.command("greet", async (ctx) => await ctx.conversation.enter("greeting"));
```

**Sessions** - Per-user data persistence
```typescript
import { session } from "grammy";

bot.use(session({
  initial: () => ({ count: 0 }),
  storage: freeStorage(bot.token) // or redis, mongodb, etc.
}));

bot.on("message", async (ctx) => {
  ctx.session.count++;
  await ctx.reply(`Message count: ${ctx.session.count}`);
});
```

**Runner** - Scalable parallel processing
```typescript
import { run } from "@grammyjs/runner";

run(bot); // Instead of bot.start()
```

**Menus** - Interactive inline keyboards
```typescript
import { Menu } from "@grammyjs/menu";

const menu = new Menu("main")
  .text("A", (ctx) => ctx.reply("You clicked A"))
  .text("B", (ctx) => ctx.reply("You clicked B"));

bot.use(menu);
bot.command("start", async (ctx) => {
  await ctx.reply("Pick:", { reply_markup: menu });
});
```

### Other Notable Plugins
- **i18n** - Internationalization
- **Hydrate** - Auto-populate ctx.api methods
- **Auto-retry** - Automatic retry on 429 errors
- **Throttler** - Rate limiting outgoing requests
- **Ratelimiter** - Rate limit incoming messages
- **Parse Mode** - Template literals for formatting
- **Files** - Enhanced file handling
- **Chat Members** - Track member status

## Advanced Patterns

### Error Handling
```typescript
bot.catch(async (err) => {
  const { ctx, error } = err;
  console.error(`Error for ${ctx.update.update_id}:`, error);
  await ctx.reply("Something went wrong!");
});
```

### Middleware Composition
```typescript
bot.use(authentication); // Runs first
bot.use(logger);          // Runs second
bot.use(mainHandler);     // Runs last
```

### Scaling Architecture
```typescript
// Use grammY runner for high throughput
import { run } from "@grammyjs/runner";

run(bot, {
  runner: {
    fetch: {
      limit: 100,          // Max updates per fetch
      allowed_updates: ["message", "callback_query"]
    }
  }
});

// For webhooks on serverless:
export const webhook = webhookCallback(bot, "http");
```

### Webhooks vs Long Polling
- **Long polling**: `bot.start()` - Simple, good for development
- **Webhooks**: `bot.start({ webhook: {...} })` - Required for production/high scale

## Deployment Considerations

### Environment Setup
```typescript
// Use environment variables for secrets
const token = process.env.BOT_TOKEN;
const bot = new Bot(token);

// Enable logging
if (process.env.DEBUG === "grammy*") {
  // Enables debug output
}
```

### Database Storage
grammY supports multiple storage adapters for sessions:
- **Memory**: Default (development only)
- **Redis**: `redisStorage`
- **MongoDB**: `mongodbStorage`
- **PostgreSQL**: `psqlStorage`
- **DenoDB**: `denoDbStorage`
- **File**: `fileStorage`
- **Supabase**: `supabaseStorage`

### Security Best Practices
- Always validate user input
- Use `conversation.external()` for I/O operations
- Implement rate limiting
- Sanitize data before storing
- Use webhook secret tokens

## TypeScript Integration

grammY is fully typed. Use type inference for context:

```typescript
import { Context, SessionFlavor } from "grammy";

interface SessionData {
  count: number;
}
type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>("token");
```

## Common Pitfalls

1. **Async operations**: Always `await` API calls
2. **Conversation replay**: Wrap side effects in `conversation.external()`
3. **Memory leaks**: Avoid infinite conversation loops
4. **Error propagation**: Use try/catch in middleware
5. **Update types**: Check `ctx.updateType` when needed

## Testing

```typescript
import { Bot } from "grammy";
import { mockContext } from "@grammyjs/testing";

const bot = new Bot("dummy");
const ctx = mockContext("message:text", { text: "/start" });

await bot.handleUpdate(ctx.update);
```

## Performance Optimization

- Use `bot.filter()` early to skip unnecessary processing
- Leverage `runner` plugin for concurrent update handling
- Store session data efficiently (avoid large objects)
- Use webhooks for production
- Implement proper error boundaries

---

**For detailed API documentation, see:** https://grammy.dev/ref  
**For examples and tutorials:** https://github.com/grammyjs/examples  
**For community support:** https://t.me/grammyjs
