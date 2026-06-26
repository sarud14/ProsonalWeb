export type BadgeVariant = 'default' | 'outline' | 'success' | 'domain'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  readonly variant?: BadgeVariant
}
