import { useEffect } from "react"
import { useRouter } from "next/router"

import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  // https://flaviocopes.com/nextjs-google-analytics/
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = url => {
      window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
      })
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return <Component {...pageProps} />
}

export default MyApp
