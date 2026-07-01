'use client'

import { LogOutIcon } from 'lucide-react'
import { useTransition } from 'react'

import { signOutAction } from '@/actions/auth.actions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AdminSessionUser } from '@/types/auth.types'
import { cn } from '@/lib/utils'

interface AdminUserMenuProps {
  readonly user: AdminSessionUser
  readonly showLabel?: boolean
}

interface UserAvatarProps {
  readonly user: AdminSessionUser
  readonly className?: string
}

function UserAvatar({ user, className }: UserAvatarProps): React.JSX.Element {
  if (user.image) {
    return (
      <img
        src={user.image}
        alt=""
        className={cn('rounded-full object-cover', className)}
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-full bg-primary font-medium text-primary-foreground',
        className
      )}
    >
      {user.initials}
    </span>
  )
}

export function AdminUserMenu({
  user,
  showLabel = false,
}: AdminUserMenuProps): React.JSX.Element {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = (): void => {
    startTransition(() => {
      void signOutAction()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex cursor-pointer items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
        disabled={isPending}
      >
        <UserAvatar user={user} className="size-9 text-base" />
        {showLabel && (
          <div className="min-w-0 text-left">
            <div className="truncate text-base font-semibold leading-tight">{user.name}</div>
            {user.email && (
              <div className="truncate text-sm leading-tight text-muted-foreground">
                {user.email}
              </div>
            )}
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="h-auto w-auto min-w-max max-w-[min(24rem,calc(100vw-2rem))]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2 font-normal">
            <div className="flex flex-col gap-1">
              <span className="whitespace-nowrap text-base font-medium leading-tight">
                {user.name}
              </span>
              {user.email && (
                <span className="whitespace-nowrap text-sm leading-tight text-muted-foreground">
                  {user.email}
                </span>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer text-base"
            onClick={handleSignOut}
            disabled={isPending}
          >
            <LogOutIcon />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
