import type { AdminMediaOption } from '@/types/admin-content.types'

export function mapMediaOptions(
  assets: readonly {
    readonly id: string
    readonly url: string
    readonly alt: string
  }[]
): AdminMediaOption[] {
  return assets.map((asset) => ({
    id: asset.id,
    url: asset.url,
    alt: asset.alt,
  }))
}
