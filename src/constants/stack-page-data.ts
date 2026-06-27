import type { StackPageData } from '@/types/stack.types'

export const STACK_PAGE_DATA = {
  groups: [
    {
      label: 'EDITOR & SHELL',
      tools: [
        { name: 'VS Code', note: 'vim mode' },
        { name: 'Ghostty', note: 'terminal' },
        { name: 'Zsh + Starship', note: 'shell' },
        { name: 'Raycast', note: 'launcher' },
      ],
    },
    {
      label: 'LANGUAGES',
      tools: [
        { name: 'TypeScript', note: 'daily' },
        { name: 'JavaScript', note: 'daily' },
        { name: 'SQL', note: 'postgres' },
        { name: 'Go', note: 'tooling' },
      ],
    },
    {
      label: 'FRAMEWORK',
      tools: [
        { name: 'Next.js', note: 'app router' },
        { name: 'React', note: 'rsc' },
        { name: 'Tailwind', note: 'styling' },
        { name: 'Zod', note: 'schema' },
      ],
    },
    {
      label: 'DATA & INFRA',
      tools: [
        { name: 'PostgreSQL', note: 'primary' },
        { name: 'Redis', note: 'cache' },
        { name: 'Vercel', note: 'edge / host' },
        { name: 'GitHub Actions', note: 'ci' },
      ],
    },
    {
      label: 'DESIGN & QA',
      tools: [
        { name: 'Figma', note: 'design' },
        { name: 'Storybook', note: 'components' },
        { name: 'Playwright', note: 'e2e' },
        { name: 'Vitest', note: 'unit' },
      ],
    },
    {
      label: 'AI-ASSISTED',
      tools: [
        { name: 'Claude', note: 'pair / design' },
        { name: 'Copilot', note: 'inline' },
        { name: 'Cursor', note: 'refactors' },
      ],
    },
  ],
} as const satisfies StackPageData

export function getStackToolCount(groups: StackPageData['groups']): number {
  return groups.reduce((total, group) => total + group.tools.length, 0)
}
