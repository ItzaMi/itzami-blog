import Link from 'next/link'
import Divider from '../Divider'

import NavBarLink from '../NavBarLink'

import css from './nav-bar.module.css'

const NavBar = () => {
  const availableRoutes = [
    {
      path: '/',
      text: 'Home',
    },
    {
      path: '/blog',
      text: 'Blog',
    },
    {
      path: '/about',
      text: 'About',
    },
  ]

  const socialMediaLinks = [
    {
      title: 'GitHub',
      link: 'https://github.com/itzami',
    },
    {
      title: 'Twitter',
      link: 'https://twitter.com/HeyItzaMi',
    },
  ]

  return (
    <nav className={css.host}>
      <div className={css.contentWrapper}>
        <section className={css.navLinksWrapper}>
          {availableRoutes.map((route) => (
            <NavBarLink path={route.path} text={route.text} />
          ))}
        </section>

        <section className={css.socialLinksWrapper}>
          {socialMediaLinks.map((link, key) => (
            <Link href={link.link} key={key}>
              <a className={css.socialLink}>{link.title}</a>
            </Link>
          ))}
        </section>
      </div>
    </nav>
  )
}

export default NavBar
