// Shared stand-in for next/link in jsdom component tests:
// vi.mock('next/link', async () => ({ default: (await import('@/test-utils/next-link-mock')).MockLink }))
export function MockLink({
  children,
  href,
  prefetch: _prefetch,
  scroll: _scroll,
  ...props
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  readonly href: string | { readonly pathname?: string }
  readonly prefetch?: boolean
  readonly scroll?: boolean
}): React.JSX.Element {
  const url = typeof href === 'string' ? href : (href.pathname ?? '')
  return (
    <a href={url} {...props}>
      {children}
    </a>
  )
}
