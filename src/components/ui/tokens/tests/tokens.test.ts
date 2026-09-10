import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'

const TOKENS_DIR = path.join(__dirname, '..')

function readTokenFile(name: string): string {
  return readFileSync(path.join(TOKENS_DIR, name), 'utf8')
}

test('colors.css declares the semantic palette tokens', () => {
  const css = readTokenFile('colors.css')
  const required = [
    '--background',
    '--foreground',
    '--card',
    '--primary',
    '--muted-foreground',
    '--destructive',
    '--success',
    '--warning',
    '--border',
    '--grid-line',
  ] as const

  for (const token of required) {
    expect(css).toContain(`${token}:`)
  }
})

test('radius.css declares --radius and the Tailwind scale', () => {
  const css = readTokenFile('radius.css')
  expect(css).toContain('--radius:')
  expect(css).toContain('--radius-lg:')
})

test('spacing.css declares --grid-size', () => {
  expect(readTokenFile('spacing.css')).toContain('--grid-size:')
})

test('motion.css declares duration tokens used by landing classes', () => {
  const css = readTokenFile('motion.css')
  expect(css).toContain('--motion-duration-fade-up:')
  expect(css).toContain('landing-motion-fade-up')
  expect(css).toContain('prefers-reduced-motion')
})
