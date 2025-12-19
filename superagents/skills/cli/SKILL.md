# CLI Tool Skill (Bun)

## When to Use
- Command-line tools and scripts
- Build tooling and automation
- Developer utilities
- File processing tools

## Technology Stack
- **Bun** - Runtime and bundler
- **@commander-js/extra-typings** - Argument parsing
- **chalk** - Terminal styling
- **ora** - Spinners
- **inquirer** - Interactive prompts

## Setup

```bash
bun init
bun add commander chalk ora inquirer
```

## Basic CLI Structure

```typescript
#!/usr/bin/env bun
// cli.ts

import { Command } from 'commander'

const program = new Command()

program
  .name('mytool')
  .description('My CLI tool')
  .version('1.0.0')

program
  .command('greet')
  .description('Greet someone')
  .argument('<name>', 'Name to greet')
  .option('-l, --loud', 'Shout the greeting')
  .action((name, options) => {
    const greeting = `Hello, ${name}!`
    console.log(options.loud ? greeting.toUpperCase() : greeting)
  })

program.parse()
```

## Make Executable

```json
// package.json
{
  "name": "mytool",
  "bin": {
    "mytool": "./cli.ts"
  }
}
```

```bash
# Make executable
chmod +x cli.ts

# Run directly
./cli.ts greet Dan

# Or via bun
bun cli.ts greet Dan
```

## Argument Parsing

```typescript
import { Command, Option } from 'commander'

const program = new Command()

program
  .command('process')
  .description('Process files')
  // Required argument
  .argument('<input>', 'Input file path')
  // Optional argument
  .argument('[output]', 'Output file path', 'output.txt')
  // Variadic argument
  .argument('<files...>', 'Files to process')
  // Options
  .option('-v, --verbose', 'Verbose output')
  .option('-c, --count <number>', 'Number of items', parseInt, 10)
  .option('-t, --type <type>', 'File type')
  .addOption(
    new Option('-e, --env <env>', 'Environment')
      .choices(['dev', 'staging', 'prod'])
      .default('dev')
  )
  .action((input, output, files, options) => {
    console.log({ input, output, files, options })
  })
```

## Terminal Styling

```typescript
import chalk from 'chalk'

// Colors
console.log(chalk.red('Error!'))
console.log(chalk.green('Success!'))
console.log(chalk.yellow('Warning!'))
console.log(chalk.blue('Info'))

// Styles
console.log(chalk.bold('Bold text'))
console.log(chalk.italic('Italic text'))
console.log(chalk.underline('Underlined'))

// Combinations
console.log(chalk.bold.red('Bold red error'))
console.log(chalk.bgRed.white(' ERROR '))

// Template literals
console.log(chalk`{bold.green Success:} Operation completed`)

// Hex colors
console.log(chalk.hex('#FF8800')('Orange text'))
```

## Spinners

```typescript
import ora from 'ora'

async function processFiles() {
  const spinner = ora('Processing files...').start()

  try {
    await doSomething()
    spinner.succeed('Files processed successfully')
  } catch (error) {
    spinner.fail('Failed to process files')
    throw error
  }
}

// Different states
const spinner = ora('Loading').start()
spinner.text = 'Still loading...'
spinner.color = 'yellow'
spinner.succeed('Done!')
spinner.fail('Failed!')
spinner.warn('Warning!')
spinner.info('FYI')
spinner.stop()
```

## Interactive Prompts

```typescript
import inquirer from 'inquirer'

async function configure() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: 'my-project'
    },
    {
      type: 'list',
      name: 'template',
      message: 'Select template:',
      choices: ['React', 'Vue', 'Svelte']
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Select features:',
      choices: [
        { name: 'TypeScript', checked: true },
        { name: 'ESLint' },
        { name: 'Prettier' }
      ]
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'Install dependencies?',
      default: true
    },
    {
      type: 'password',
      name: 'token',
      message: 'API token:',
      mask: '*'
    }
  ])

  return answers
}
```

## File Operations

```typescript
import { readFile, writeFile, readdir, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname, basename, extname } from 'path'

// Read file
const content = await Bun.file('input.txt').text()

// Write file
await Bun.write('output.txt', content)

// Read JSON
const config = await Bun.file('config.json').json()

// Check existence
if (existsSync('file.txt')) {
  // ...
}

// Create directory
await mkdir('output', { recursive: true })

// List files
const files = await readdir('src')
for (const file of files) {
  const ext = extname(file)
  const name = basename(file, ext)
  console.log({ file, ext, name })
}

// Glob (Bun built-in)
const glob = new Bun.Glob('**/*.ts')
for await (const file of glob.scan('.')) {
  console.log(file)
}
```

## Running Shell Commands

```typescript
// Simple command
const result = Bun.spawnSync(['ls', '-la'])
console.log(result.stdout.toString())

// With options
const proc = Bun.spawn(['npm', 'install'], {
  cwd: './project',
  env: { ...process.env, NODE_ENV: 'production' },
  stdout: 'inherit',
  stderr: 'inherit'
})

await proc.exited

// Capture output
const { stdout, stderr, exitCode } = Bun.spawnSync(['git', 'status'])
if (exitCode !== 0) {
  console.error(stderr.toString())
}
```

## Progress and Tables

```typescript
// Simple progress
function progress(current: number, total: number, label: string) {
  const percent = Math.round((current / total) * 100)
  const bar = '█'.repeat(percent / 2) + '░'.repeat(50 - percent / 2)
  process.stdout.write(`\r${label} [${bar}] ${percent}%`)
}

// Table output
function table(data: Record<string, any>[]) {
  console.table(data)
}

// Or manual formatting
function printTable(headers: string[], rows: string[][]) {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => (r[i] || '').length))
  )

  const line = headers.map((h, i) => h.padEnd(widths[i])).join(' | ')
  console.log(line)
  console.log('-'.repeat(line.length))

  for (const row of rows) {
    console.log(row.map((c, i) => (c || '').padEnd(widths[i])).join(' | '))
  }
}
```

## Environment and Config

```typescript
// Environment variables
const apiKey = process.env.API_KEY
if (!apiKey) {
  console.error('API_KEY required')
  process.exit(1)
}

// Config file
import { homedir } from 'os'
import { join } from 'path'

const configPath = join(homedir(), '.mytool', 'config.json')

async function loadConfig() {
  try {
    return await Bun.file(configPath).json()
  } catch {
    return {}
  }
}

async function saveConfig(config: object) {
  await mkdir(dirname(configPath), { recursive: true })
  await Bun.write(configPath, JSON.stringify(config, null, 2))
}
```

## Error Handling

```typescript
import chalk from 'chalk'

function error(message: string): never {
  console.error(chalk.red(`Error: ${message}`))
  process.exit(1)
}

function warn(message: string) {
  console.warn(chalk.yellow(`Warning: ${message}`))
}

// Global error handling
process.on('uncaughtException', (err) => {
  console.error(chalk.red('Unexpected error:'), err.message)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nInterrupted')
  process.exit(0)
})
```

## Complete Example

```typescript
#!/usr/bin/env bun

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'

const program = new Command()
  .name('scaffold')
  .description('Project scaffolding tool')
  .version('1.0.0')

program
  .command('init')
  .description('Initialize a new project')
  .argument('[name]', 'Project name')
  .option('-t, --template <template>', 'Template to use')
  .action(async (name, options) => {
    // Get name if not provided
    if (!name) {
      const answers = await inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Project name:',
        validate: (v) => v.length > 0 || 'Name required'
      }])
      name = answers.name
    }

    // Get template if not provided
    let template = options.template
    if (!template) {
      const answers = await inquirer.prompt([{
        type: 'list',
        name: 'template',
        message: 'Select template:',
        choices: ['react', 'node', 'cli']
      }])
      template = answers.template
    }

    const spinner = ora('Creating project...').start()

    try {
      await createProject(name, template)
      spinner.succeed(chalk.green(`Project ${name} created!`))
      console.log(`\n  cd ${name}\n  bun install\n  bun dev`)
    } catch (err) {
      spinner.fail(chalk.red('Failed to create project'))
      console.error(err)
      process.exit(1)
    }
  })

program.parse()
```

## Related Skills
- `testing` - Testing CLI tools
- `database` - Data persistence
