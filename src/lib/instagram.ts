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
    console.log('[Instagram] Starting fetch...')
    console.log('[Instagram] Access token exists:', !!accessToken)
    console.log('[Instagram] Access token length:', accessToken?.length || 0)
    console.log('[Instagram] Access token prefix:', accessToken?.substring(0, 20) || 'N/A')

    const fields = 'id,media_type,media_url,permalink,caption,timestamp,thumbnail_url'
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`

    console.log('[Instagram] Fetching URL:', url.substring(0, 100) + '...')

    const response = await fetch(url)

    console.log('[Instagram] Response status:', response.status)
    console.log('[Instagram] Response statusText:', response.statusText)
    console.log('[Instagram] Response ok:', response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Instagram] Error response body:', errorText)
      throw new Error(`Instagram API error: ${response.status} - ${errorText}`)
    }

    const data: InstagramResponse = await response.json()
    console.log('[Instagram] Data received:', {
      mediaCount: data.data?.length || 0,
      hasData: !!data.data,
      firstItem: data.data?.[0]?.id || 'none',
      hasPaging: !!data.paging
    })

    return data.data || []
  } catch (error) {
    console.error('[Instagram] Failed to fetch Instagram media:', error)
    console.error('[Instagram] Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack'
    })
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
