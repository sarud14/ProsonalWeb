import type { Metadata } from 'next'

interface WorkDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug} — Work — FEOps Kit`,
  }
}

export default async function WorkDetailPage({
  params,
}: WorkDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params
  return (
    <main>
      <h1>Work: {slug}</h1>
    </main>
  )
}
