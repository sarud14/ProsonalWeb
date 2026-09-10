function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

interface DashboardGreetingProps {
  readonly userName: string
}

export function DashboardGreeting({ userName }: DashboardGreetingProps): React.JSX.Element {
  return (
    <div className="mb-8">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
        Welcome back
      </div>
      <h1 className="text-[40px] font-medium leading-tight tracking-[-0.02em]">
        {getTimeGreeting()}, {userName}.
      </h1>
    </div>
  )
}
