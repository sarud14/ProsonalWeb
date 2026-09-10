import type { Metadata } from 'next'

import { ContactPageView } from '@/features/contact/ContactPageView'
import { getSiteContact } from '@/lib/content/site-config'

export const metadata: Metadata = {
  title: 'Contact',
}

export default async function ContactPage(): Promise<React.JSX.Element> {
  const contact = await getSiteContact()

  return (
    <ContactPageView email={contact.email} location={contact.location} />
  )
}
