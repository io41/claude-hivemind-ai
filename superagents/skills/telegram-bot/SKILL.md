# Telegram Bot Skill (grammY)

## When to Use
- Telegram bot backends
- Command handling
- Inline queries
- Conversations/dialogs
- Bot middleware

## Technology Stack
- **grammY** - Telegram Bot framework
- **@grammyjs/conversations** - Multi-step dialogs
- **@grammyjs/menu** - Interactive menus
- **@grammyjs/runner** - Scalable parallel processing

## Setup

```bash
pnpm add grammy
```

## Basic Bot

```typescript
import { Bot } from 'grammy'

const bot = new Bot(process.env.BOT_TOKEN!)

// Command handler
bot.command('start', async (ctx) => {
  await ctx.reply(`Welcome, ${ctx.from?.first_name}!`)
})

// Text message handler
bot.on('message:text', async (ctx) => {
  await ctx.reply(`You said: ${ctx.message.text}`)
})

// Error handling
bot.catch((err) => {
  console.error('Bot error:', err)
})

// Start (long polling)
bot.start()
```

## Context (`ctx`)

```typescript
bot.on('message', async (ctx) => {
  // Message info
  ctx.message          // The message object
  ctx.message.text     // Text content
  ctx.message.photo    // Photo array
  ctx.from             // User who sent message
  ctx.chat             // Chat info

  // Quick replies
  await ctx.reply('Text')
  await ctx.replyWithPhoto('url')
  await ctx.replyWithDocument(new InputFile('file.pdf'))

  // Raw API access
  await ctx.api.sendMessage(chatId, 'Direct API call')
})
```

## Message Filters

```typescript
// By message type
bot.on('message', handler)           // All messages
bot.on('message:text', handler)      // Text only
bot.on('message:photo', handler)     // Photos
bot.on('message:document', handler)  // Documents
bot.on('message:voice', handler)     // Voice messages
bot.on('message:video', handler)     // Videos
bot.on('message:sticker', handler)   // Stickers
bot.on('message:location', handler)  // Location

// Commands
bot.command('help', handler)         // /help
bot.command('start', handler)        // /start

// Pattern matching
bot.hears('hello', handler)          // Exact match
bot.hears(/echo (.+)/, handler)      // Regex

// Custom filter
bot.filter((ctx) => ctx.from?.is_premium === true, handler)
```

## Sending Messages

```typescript
// Basic reply
await ctx.reply('Hello!')

// With formatting
await ctx.reply('*Bold* and _italic_', { parse_mode: 'Markdown' })
await ctx.reply('<b>Bold</b> and <i>italic</i>', { parse_mode: 'HTML' })

// Reply to specific message
await ctx.reply('Reply', {
  reply_parameters: { message_id: ctx.message.message_id }
})

// Send to specific chat
await bot.api.sendMessage(chatId, 'Message')

// Media
await ctx.replyWithPhoto('https://example.com/image.jpg')
await ctx.replyWithPhoto(new InputFile('local/image.jpg'))
await ctx.replyWithDocument(new InputFile(buffer, 'file.pdf'))
```

## Inline Keyboards

```typescript
import { InlineKeyboard } from 'grammy'

const keyboard = new InlineKeyboard()
  .text('Option A', 'callback_a')
  .text('Option B', 'callback_b')
  .row()
  .url('Visit Site', 'https://example.com')

await ctx.reply('Choose:', { reply_markup: keyboard })

// Handle callbacks
bot.callbackQuery('callback_a', async (ctx) => {
  await ctx.answerCallbackQuery('You chose A!')
  await ctx.editMessageText('Selected: A')
})

// Pattern matching
bot.callbackQuery(/item_(\d+)/, async (ctx) => {
  const itemId = ctx.match![1]
  await ctx.answerCallbackQuery(`Item ${itemId}`)
})
```

## Menus Plugin

```typescript
import { Menu } from '@grammyjs/menu'

const mainMenu = new Menu('main')
  .text('Profile', (ctx) => ctx.reply('Your profile'))
  .text('Settings', (ctx) => ctx.reply('Settings'))
  .row()
  .submenu('More options', 'more')

const moreMenu = new Menu('more')
  .text('Option 1', handler)
  .text('Option 2', handler)
  .back('Back')

mainMenu.register(moreMenu)
bot.use(mainMenu)

bot.command('menu', async (ctx) => {
  await ctx.reply('Main menu:', { reply_markup: mainMenu })
})
```

## Sessions

```typescript
import { session } from 'grammy'

interface SessionData {
  count: number
  lastSeen: Date
}

bot.use(session({
  initial: (): SessionData => ({
    count: 0,
    lastSeen: new Date()
  })
}))

bot.on('message', async (ctx) => {
  ctx.session.count++
  ctx.session.lastSeen = new Date()
  await ctx.reply(`Message count: ${ctx.session.count}`)
})
```

### Persistent Sessions

```typescript
import { session } from 'grammy'
import { RedisAdapter } from '@grammyjs/storage-redis'
import Redis from 'ioredis'

const redis = new Redis()

bot.use(session({
  initial: () => ({ count: 0 }),
  storage: new RedisAdapter({ instance: redis })
}))
```

## Conversations

```typescript
import { conversations, createConversation } from '@grammyjs/conversations'

// Define conversation
async function onboarding(conversation, ctx) {
  await ctx.reply("What's your name?")
  const nameCtx = await conversation.waitFor('message:text')
  const name = nameCtx.message.text

  await ctx.reply(`Hi ${name}! What's your email?`)
  const emailCtx = await conversation.waitFor('message:text')
  const email = emailCtx.message.text

  // External operations must be wrapped
  const user = await conversation.external(() =>
    db.users.create({ data: { name, email } })
  )

  await ctx.reply(`Account created! ID: ${user.id}`)
}

// Register
bot.use(conversations())
bot.use(createConversation(onboarding))

// Start conversation
bot.command('signup', async (ctx) => {
  await ctx.conversation.enter('onboarding')
})
```

## Middleware

```typescript
// Custom middleware
bot.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`Response time: ${ms}ms`)
})

// Auth middleware
const adminOnly = async (ctx, next) => {
  if (ctx.from?.id !== ADMIN_ID) {
    return ctx.reply('Not authorized')
  }
  await next()
}

bot.command('admin', adminOnly, async (ctx) => {
  await ctx.reply('Admin panel')
})

// Composer for grouping
import { Composer } from 'grammy'

const adminComposer = new Composer()
adminComposer.use(adminOnly)
adminComposer.command('ban', banHandler)
adminComposer.command('stats', statsHandler)

bot.use(adminComposer)
```

## Error Handling

```typescript
bot.catch(async (err) => {
  const { ctx, error } = err

  console.error(`Error for ${ctx.update.update_id}:`, error)

  // Notify user
  try {
    await ctx.reply('Something went wrong. Please try again.')
  } catch {
    // Reply failed
  }

  // Notify admin
  await bot.api.sendMessage(
    ADMIN_CHAT_ID,
    `Bot error: ${error.message}`
  )
})
```

## Webhooks

```typescript
import { webhookCallback } from 'grammy'

// Express
app.post('/webhook', webhookCallback(bot, 'express'))

// Hono
app.post('/webhook', async (c) => {
  const handler = webhookCallback(bot, 'hono')
  return handler(c)
})

// Set webhook
await bot.api.setWebhook('https://yourdomain.com/webhook', {
  secret_token: process.env.WEBHOOK_SECRET
})
```

## Runner (Scaling)

```typescript
import { run } from '@grammyjs/runner'

// Instead of bot.start()
run(bot, {
  runner: {
    fetch: {
      limit: 100,  // Updates per fetch
      allowed_updates: ['message', 'callback_query']
    }
  }
})
```

## TypeScript Context

```typescript
import { Context, SessionFlavor } from 'grammy'
import { ConversationFlavor } from '@grammyjs/conversations'

interface SessionData {
  step: number
}

type MyContext = Context
  & SessionFlavor<SessionData>
  & ConversationFlavor

const bot = new Bot<MyContext>(token)
```

## Common Patterns

### Command with Arguments
```typescript
bot.command('remind', async (ctx) => {
  const args = ctx.match // Text after command
  if (!args) {
    return ctx.reply('Usage: /remind <message>')
  }
  await ctx.reply(`I'll remind you: ${args}`)
})
```

### Delete Messages
```typescript
bot.command('delete', async (ctx) => {
  await ctx.deleteMessage() // Delete command
  const msg = await ctx.reply('This will disappear')
  setTimeout(() => ctx.api.deleteMessage(ctx.chat.id, msg.message_id), 5000)
})
```

### Forward Messages
```typescript
bot.on('message', async (ctx) => {
  await ctx.forwardMessage(CHANNEL_ID)
})
```

### Edit Messages
```typescript
bot.callbackQuery('edit', async (ctx) => {
  await ctx.editMessageText('Updated text')
  await ctx.answerCallbackQuery()
})
```

## Related Skills
- `telegram-miniapp` - Mini App frontends
- `api/trpc` - Backend API
- `database` - Data persistence
