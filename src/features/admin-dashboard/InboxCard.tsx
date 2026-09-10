import Link from 'next/link'

import { DASHBOARD_MESSAGES_HREF } from '@/constants/dashboard'

interface InboxCardProps {
  readonly unreadCount: number
}

export function InboxCard({ unreadCount }: InboxCardProps): React.JSX.Element {
  return (
    <Link
      href={DASHBOARD_MESSAGES_HREF}
      className="block rounded-xl bg-primary p-6 text-primary-foreground transition-opacity hover:opacity-95"
    >
      <div className="mb-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-foreground/80">
        Inbox
      </div>
      <div className="text-[52px] font-medium leading-none">{unreadCount}</div>
      <div className="mt-1.5 text-[13px] text-primary-foreground/90">unread messages →</div>
    </Link>
  )
}
