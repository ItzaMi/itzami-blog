import Link from 'next/link'

import NavBarLink from '../NavBarLink'

const NavBar = () => {
  const availableRoutes = [
    { path: '/', text: 'Home' },
    { path: '/blog', text: 'Blog' },
    { path: '/about', text: 'About' },
  ]

  const socialMediaLinks = [
    { title: 'GitHub', link: 'https://github.com/itzami' },
    { title: 'Twitter', link: 'https://twitter.com/HeyItzaMi' },
  ]

  return (
    <nav className="fixed bottom-[30px] w-full max-w-[800px] rounded-[10px] bg-surface p-2.5 shadow-[0_0_20px_rgba(149,157,165,0.15)] max-[880px]:max-w-[calc(100%-80px)] max-[500px]:overflow-x-scroll max-[500px]:scrollbar-none">
      <div className="flex items-center justify-between">
        <section className="flex h-full gap-1 max-[500px]:pr-10">
          {availableRoutes.map((route) => (
            <NavBarLink path={route.path} text={route.text} key={route.path} />
          ))}
        </section>

        <section className="mr-3 flex h-full items-center gap-5 max-[500px]:pr-5">
          {socialMediaLinks.map((link) => (
            <Link
              href={link.link}
              key={link.title}
              className="text-xs tracking-tight text-muted no-underline transition-all duration-200 ease-in hover:text-primary"
              target="_blank"
            >
              {link.title}
            </Link>
          ))}
        </section>
      </div>
    </nav>
  )
}

export default NavBar
