'use client'

import { signOutAction } from '@/actions/auth.actions'

interface AdminUserMenuProps {
  readonly showLabel?: boolean
}

export function AdminUserMenu({ showLabel = false }: AdminUserMenuProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2.5">
      <form action={signOutAction}>
        <button
          type="submit"
          title="Sign out"
          className="flex size-[30px] cursor-pointer items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground"
        >
          A
        </button>
      </form>
      {showLabel && (
        <div className="text-xs">
          <div className="font-semibold">Admin</div>
          <div className="text-muted-foreground text-[11px]">Owner</div>
        </div>
      )}
    </div>
  )
}
