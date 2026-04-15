import { useEffect } from 'react'

export default function InstagramGallery() {
  useEffect(() => {
    // Load Elfsight script if not already loaded
    const script = document.createElement('script')
    script.src = 'https://elfsightcdn.com/platform.js'
    script.async = true

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')
    if (!existingScript) {
      document.body.appendChild(script)
    }

    return () => {
      // Cleanup: remove script when component unmounts
      if (!existingScript && script.parentNode) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="w-full">
      <div
        className="elfsight-app-98e554ef-fe0b-421b-8616-1fd7043f26ac"
        data-elfsight-app-lazy
      ></div>
    </div>
  )
}
