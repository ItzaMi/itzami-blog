import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import NavBarLink from '../NavBarLink'

const NavBar = () => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const availableRoutes = [
    { path: '/', text: 'Home' },
    { path: '/projects', text: 'Projects' },
    { path: '/agents', text: 'Agents' },
    { path: '/reading', text: 'Reading' },
    { path: '/blog', text: 'Blog' },
    { path: '/about', text: 'About' },
  ]

  const socialMediaLinks = [
    { title: 'GitHub', link: 'https://github.com/itzami' },
    { title: 'Twitter', link: 'https://twitter.com/HeyItzaMi' },
  ]

  const isRouteActive = (path: string) => {
    if (path === '/') {
      return router.pathname === path
    }

    return router.pathname.startsWith(path)
  }

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined
    }

    const closeOnScroll = () => {
      setIsMobileMenuOpen(false)
    }

    window.addEventListener('scroll', closeOnScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', closeOnScroll)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav className="fixed bottom-[30px] z-20 w-full max-w-[800px] rounded-[10px] border border-divider/80 bg-surface/90 p-2.5 shadow-[0_0_20px_rgba(149,157,165,0.15)] backdrop-blur-xl max-[880px]:max-w-[calc(100%-80px)] max-[640px]:hidden">
        <div className="flex items-center justify-between">
          <section className="flex h-full gap-1">
            {availableRoutes.map((route) => (
              <NavBarLink
                path={route.path}
                text={route.text}
                key={route.path}
              />
            ))}
          </section>

          <section className="mr-3 flex h-full items-center gap-5 max-[720px]:hidden">
            {socialMediaLinks.map((link) => (
              <Link
                href={link.link}
                key={link.title}
                className="text-xs tracking-tight text-muted no-underline transition-all duration-200 ease-in hover:text-primary"
                target="_blank"
                rel="noreferrer"
              >
                {link.title}
              </Link>
            ))}
          </section>
        </div>
      </nav>

      <nav className="fixed inset-x-10 bottom-[30px] z-20 hidden max-[640px]:block max-[500px]:inset-x-5">
        <details
          className="group relative"
          open={isMobileMenuOpen}
          onToggle={(event) => {
            setIsMobileMenuOpen(event.currentTarget.open)
          }}
        >
          <div className="absolute inset-x-0 bottom-[calc(100%+8px)] hidden rounded-[10px] border border-divider/80 bg-surface/95 p-2.5 shadow-[0_0_20px_rgba(149,157,165,0.18)] backdrop-blur-xl group-open:block">
            <div className="grid gap-1">
              {availableRoutes.map((route) => {
                const isActive = isRouteActive(route.path)

                return (
                  <Link
                    href={route.path}
                    key={route.path}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                    }}
                    className={`rounded-md px-3 py-2 text-sm leading-[17px] tracking-tight text-primary no-underline transition-all duration-200 ease-in hover:bg-hover-strong ${
                      isActive ? 'bg-hover font-medium' : ''
                    }`}
                  >
                    {route.text}
                  </Link>
                )
              })}

              <div className="mt-2 flex gap-4 border-t border-divider px-3 py-3">
                {socialMediaLinks.map((link) => (
                  <Link
                    href={link.link}
                    key={link.title}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-xs tracking-tight text-muted no-underline transition-all duration-200 ease-in hover:text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <summary className="flex cursor-pointer list-none items-center justify-between rounded-[10px] border border-divider/80 bg-surface/95 p-2.5 px-4 py-3 text-sm font-medium tracking-tight text-primary shadow-[0_0_20px_rgba(149,157,165,0.18)] backdrop-blur-xl marker:hidden">
            <span>Rui Sousa</span>
            <span className="text-muted">Menu</span>
          </summary>
        </details>
      </nav>
    </>
  )
}

export default NavBar
