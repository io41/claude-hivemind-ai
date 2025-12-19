#!/usr/bin/env bun

import {
  runHook,
  type PreToolUsePayload,
  type PreToolUseResponse,
  type UserPromptSubmitPayload,
  type UserPromptSubmitResponse,
  type SessionStartPayload,
  type SessionStartResponse,
  log,
} from './lib'

// Skill auto-activation keywords
const SKILL_KEYWORDS: Record<string, string[]> = {
  'api': ['api', 'endpoint', 'rest', 'trpc', 'hono', 'route'],
  'database': ['database', 'schema', 'migration', 'drizzle', 'sqlite', 'postgres', 'sql'],
  'frontend-react': ['react', 'component', 'hook', 'useState', 'useEffect'],
  'frontend-design': ['mantine', 'ui', 'design', 'style', 'theme', 'button', 'form', 'modal'],
  'pixi': ['pixi', 'game', 'sprite', 'canvas', 'render', 'animation'],
  'telegram-bot': ['telegram', 'bot', 'grammy', 'message', 'command'],
  'telegram-miniapp': ['tma', 'miniapp', 'mini app', 'telegram app'],
  'testing': ['test', 'vitest', 'jest', 'mock', 'assert', 'expect'],
  'debugging': ['debug', 'error', 'bug', 'fix', 'issue', 'problem'],
  'refactoring': ['refactor', 'clean', 'improve', 'restructure', 'rename'],
  'cli': ['cli', 'command line', 'terminal', 'argument', 'flag'],
  'rust-services': ['rust', 'axum', 'tokio', 'cargo'],
  'python-service': ['fastapi', 'python', 'pip', 'async'],
  'python-analytics': ['pandas', 'numpy', 'sklearn', 'data', 'analytics', 'ml'],
}

// Detect skills needed based on prompt keywords
function detectSkills(prompt: string): string[] {
  const lowerPrompt = prompt.toLowerCase()
  const detectedSkills: string[] = []

  for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      detectedSkills.push(skill)
    }
  }

  return detectedSkills
}

// Build additional context from detected skills
function buildSkillContext(skills: string[]): string {
  if (skills.length === 0) return ''

  const skillPaths = skills.map(skill => `.claude/skills/${skill}/SKILL.md`)
  return `\n\nRelevant skills detected: ${skills.join(', ')}\nConsider loading: ${skillPaths.join(', ')}`
}

// PreToolUse handler - validate workflow rules
const preToolUse = async (payload: PreToolUsePayload): Promise<PreToolUseResponse> => {
  const { tool_name, tool_input } = payload

  // For Edit/Write tools, we could enforce phase rules here
  // But for now, we'll let the agents handle this

  return {}
}

// UserPromptSubmit handler - auto-detect skills
const userPromptSubmit = async (payload: UserPromptSubmitPayload): Promise<UserPromptSubmitResponse> => {
  const { prompt } = payload

  // Detect relevant skills
  const detectedSkills = detectSkills(prompt)
  const skillContext = buildSkillContext(detectedSkills)

  // Build context files list
  const contextFiles: string[] = []

  // Always include core workflow files
  contextFiles.push('.agents/context/artifacts.md')

  // Add detected skill files
  for (const skill of detectedSkills) {
    contextFiles.push(`.claude/skills/${skill}/SKILL.md`)
  }

  return {
    decision: 'approve',
    contextFiles: contextFiles.length > 0 ? contextFiles : undefined,
    hookSpecificOutput: skillContext ? {
      hookEventName: 'UserPromptSubmit',
      additionalContext: skillContext,
    } : undefined,
  }
}

// SessionStart handler - welcome message
const sessionStart = async (payload: SessionStartPayload): Promise<SessionStartResponse> => {
  return {
    decision: 'approve',
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: `Superagents RPI workflow active. Commands: /work, /update-roadmap, /project-status, /fix-tests`,
    },
  }
}

// Run the hook
runHook({
  preToolUse,
  userPromptSubmit,
  sessionStart,
})
