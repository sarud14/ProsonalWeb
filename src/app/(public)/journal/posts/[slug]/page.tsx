import type { Metadata } from 'next'

interface JournalPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: JournalPostPageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug} — Journal — FEOps Kit`,
  }
}

export default async function JournalPostPage({
  params,
}: JournalPostPageProps): Promise<React.JSX.Element> {
  const { slug } = await params
  return (
    <main>
      <h1>Journal: {slug}</h1>
    </main>
  )
}
