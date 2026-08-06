import type { Metadata } from 'next'

import { ContactPageView } from '@/components/public-page/Contact/ContactPageView'
import { getSiteContact } from '@/lib/content/site-config'

export const metadata: Metadata = {
  title: 'Contact — FEOps Kit',
}

export default async function ContactPage(): Promise<React.JSX.Element> {
  const contact = await getSiteContact()

  return (
    <ContactPageView email={contact.email} location={contact.location} />
  )
}
