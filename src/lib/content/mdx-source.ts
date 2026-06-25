import type { ContentSource } from '@/types/content.types'

export const mdxSource: ContentSource = {
  async getAllWork() {
    return []
  },

  async getWorkBySlug(_slug: string) {
    return null
  },

  async getAllJournalPosts() {
    return []
  },

  async getJournalPostBySlug(_slug: string) {
    return null
  },
}
