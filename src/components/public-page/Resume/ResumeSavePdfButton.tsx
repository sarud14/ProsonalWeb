'use client'

import { Button } from '@/components/ui/Button'

export function ResumeSavePdfButton(): React.JSX.Element {
  return (
    <Button
      type="button"
      data-noprint=""
      onClick={() => window.print()}
      className="h-auto gap-2 rounded-none px-[18px] py-[11px] font-mono text-[11px] tracking-[0.08em] uppercase hover:-translate-y-0.5"
    >
      ↓ Save PDF
    </Button>
  )
}
