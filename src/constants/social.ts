export const SOCIAL_LINKS = {
  instagram: {
    url: 'https://www.instagram.com/glycogrit',
    handle: '@glycogrit',
    embedUrl: 'https://www.instagram.com/glycogrit/embed',
  },
  whatsapp: {
    number: '6377031416',
    intlNumber: '+916377031416',
    message: 'Hello! I would like to know more about GlycoGrit cycling challenges.',
    url: 'https://wa.me/916377031416',
  },
  strava: {
    club: '', // Add your Strava club URL if you have one
  },
} as const

export const getWhatsAppLink = (customMessage?: string) => {
  const message = customMessage || SOCIAL_LINKS.whatsapp.message
  return `${SOCIAL_LINKS.whatsapp.url}?text=${encodeURIComponent(message)}`
}
