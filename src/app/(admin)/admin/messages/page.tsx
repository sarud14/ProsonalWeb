import type { Metadata } from 'next'

import { MessagesPageView } from '@/components/admin-page/Messages/MessagesPageView'
import { mapContactMessages } from '@/lib/admin/contact-message-mappers'
import { contactData } from '@/lib/data/contact.data'

export const metadata: Metadata = {
  title: 'Messages — Admin — FEOps Kit',
}

export default async function AdminMessagesPage(): Promise<React.JSX.Element> {
  const messages = await contactData.getAll()

  return <MessagesPageView initialMessages={mapContactMessages(messages)} />
}
