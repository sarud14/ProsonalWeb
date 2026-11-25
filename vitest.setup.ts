import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

afterEach(() => {
  if (typeof document !== 'undefined') {
    cleanup()
  }
})

// jsdom has no IntersectionObserver; scroll-reveal components only need a no-op.
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class NoopIntersectionObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: NoopIntersectionObserver })
}
