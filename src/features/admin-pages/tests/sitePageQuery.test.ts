import { describe, expect, it } from 'vitest'

import type { NavItem } from '@/types/site.types'

import {
  normalizeNavOrders,
  toClientNav,
  toClientSocial,
  toPersistableNav,
  toPersistableSocial,
} from '../query/sitePageQuery'

const nav: readonly NavItem[] = [
  { key: 'work', label: 'Work', href: '/work', enabled: true, order: 9 },
  { key: 'home', label: 'Home', href: '/', enabled: true, order: 0 },
]

describe('normalizeNavOrders', () => {
  it('reindexes order from array position', () => {
    expect(normalizeNavOrders(nav).map((item) => item.order)).toEqual([0, 1])
  })
})

describe('toClientNav', () => {
  it('uses the nav key as clientId after normalizing order', () => {
    const client = toClientNav(nav)
    expect(client[0]).toMatchObject({ key: 'work', clientId: 'work', order: 0 })
    expect(client[1]).toMatchObject({ key: 'home', clientId: 'home', order: 1 })
  })
})

describe('toPersistableNav', () => {
  it('strips clientId and reindexes order', () => {
    expect(toPersistableNav(toClientNav(nav))).toEqual([
      { key: 'work', label: 'Work', href: '/work', enabled: true, order: 0 },
      { key: 'home', label: 'Home', href: '/', enabled: true, order: 1 },
    ])
  })
})

describe('toClientSocial / toPersistableSocial', () => {
  it('round-trips without leaking clientId', () => {
    const client = toClientSocial([{ label: 'GitHub', url: 'https://github.com' }])
    expect(client[0]?.clientId).toBe('social-GitHub-0')
    expect(toPersistableSocial(client)).toEqual([{ label: 'GitHub', url: 'https://github.com' }])
  })
})
