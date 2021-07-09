import Link from "next/link"

import css from "./nav.module.css"

const Nav = () => {
  return (
    <div className={css.host}>
      <Link href="/blog">
        <a className={css.link}>Blog</a>
      </Link>
      <Link href="/about">
        <a className={css.link}>About</a>
      </Link>
    </div>
  )
}

export default Nav
