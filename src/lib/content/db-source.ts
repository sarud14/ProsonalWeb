import type { ContentSource } from '@/types/content.types'

export const dbSource: ContentSource = {
  async getAllWork() {
    return []
  },

  async getWorkBySlug(slug: string) {
    void slug
    return null
  },

  async getAllJournalPosts() {
    return []
  },

  async getJournalPostBySlug(slug: string) {
    void slug
    return null
  },
}
