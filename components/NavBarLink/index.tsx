import { FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import css from './nav-bar-link.module.css'

interface Props {
  path: string
  text: string
}

const NavBarLink: FC<Props> = ({ path, text }) => {
  const router = useRouter()

  return (
    <Link href={path}>
      <a
        className={`${css.host} ${router.pathname === path ? css.active : ''}`}
      >
        {text}
      </a>
    </Link>
  )
}

export default NavBarLink
