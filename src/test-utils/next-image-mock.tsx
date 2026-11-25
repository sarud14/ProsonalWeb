// Shared stand-in for next/image in jsdom component tests:
// vi.mock('next/image', async () => ({ default: (await import('@/test-utils/next-image-mock')).MockImage }))
export function MockImage({
  src,
  alt,
}: {
  readonly src: string
  readonly alt: string
}): React.JSX.Element {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} />
}
