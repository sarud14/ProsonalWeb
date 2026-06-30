import Link from 'next/link'

import { DASHBOARD_QUICK_ACTIONS } from '@/constants/dashboard'
import { cn } from '@/lib/utils'

export function QuickActions(): React.JSX.Element {
  return (
    <div className="mb-9 flex flex-wrap gap-3">
      {DASHBOARD_QUICK_ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-[18px] py-3 text-[13px] font-semibold',
            action.primary
              ? 'bg-primary text-primary-foreground'
              : 'border border-border bg-background text-foreground'
          )}
        >
          <span className="font-mono">+</span>
          {action.label}
        </Link>
      ))}
    </div>
  )
}
