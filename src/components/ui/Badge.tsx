import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-secondary text-secondary-foreground',
        outline: 'border-border text-muted-foreground',
        success: 'border-success/30 bg-success/10 text-success',
        domain: 'border-border bg-muted text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps): React.JSX.Element {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
