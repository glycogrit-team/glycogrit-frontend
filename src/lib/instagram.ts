// Instagram API Integration
// Using Instagram Basic Display API to fetch user media

export interface InstagramMedia {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  caption?: string
  timestamp: string
  thumbnail_url?: string
}

export interface InstagramResponse {
  data: InstagramMedia[]
  paging?: {
    cursors: {
      before: string
      after: string
    }
    next?: string
  }
}

/**
 * Fetch Instagram media for a user
 * @param accessToken - Instagram Access Token from Doppler secrets
 * @param limit - Number of posts to fetch (default: 12)
 */
export async function fetchInstagramMedia(
  accessToken: string,
  limit: number = 12
): Promise<InstagramMedia[]> {
  try {
    const fields = 'id,media_type,media_url,permalink,caption,timestamp,thumbnail_url'
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`)
    }

    const data: InstagramResponse = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Failed to fetch Instagram media:', error)
    return []
  }
}

/**
 * Get the display URL for an Instagram media item
 * For videos, use thumbnail_url, for images use media_url
 */
export function getMediaDisplayUrl(media: InstagramMedia): string {
  if (media.media_type === 'VIDEO' && media.thumbnail_url) {
    return media.thumbnail_url
  }
  return media.media_url
}
