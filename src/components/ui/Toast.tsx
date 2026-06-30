'use client'

import { useCallback, useEffect } from 'react'

interface ToastProps {
  readonly message: string
  readonly open: boolean
  readonly onClose: () => void
  readonly duration?: number
}

export function Toast({
  message,
  open,
  onClose,
  duration = 3000,
}: ToastProps): React.JSX.Element | null {
  const handleAutoClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(handleAutoClose, duration)
    return () => clearTimeout(timer)
  }, [open, duration, handleAutoClose])

  if (!open) return null

  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm text-foreground shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-200">
      {message}
    </div>
  )
}
