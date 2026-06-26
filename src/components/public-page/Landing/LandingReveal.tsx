'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import type { LandingRevealProps, LandingRevealVariant } from '@/types/landing-reveal.types'

const VARIANT_CLASS: Record<LandingRevealVariant, string> = {
  'fade-up': 'landing-motion-fade-up',
  'fade-in': 'landing-motion-fade-in',
  'fade-right': 'landing-motion-fade-right',
  'line-grow': 'landing-motion-line-grow',
}

export function LandingReveal({
  children,
  className,
  delay = 0,
  trigger = 'inView',
  variant = 'fade-up',
}: LandingRevealProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(trigger === 'mount')
  const shouldRun = trigger === 'mount' || isInView

  useEffect(() => {
    if (trigger === 'mount') return

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [trigger])

  return (
    <div
      ref={ref}
      className={cn(
        VARIANT_CLASS[variant],
        shouldRun && 'landing-motion-run',
        className
      )}
      style={{ '--landing-motion-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
