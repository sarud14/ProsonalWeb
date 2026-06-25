import type { Metadata } from 'next'

interface EditWorkPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: EditWorkPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Edit Work ${id} — Admin — FEOps Kit`,
  }
}

export default async function EditWorkPage({
  params,
}: EditWorkPageProps): Promise<React.JSX.Element> {
  const { id } = await params
  return (
    <main>
      <h1>Edit Work: {id}</h1>
    </main>
  )
}
