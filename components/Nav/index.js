import Link from "next/link"
import { useRouter } from "next/router"

import css from "./nav.module.css"

const Nav = () => {
  const router = useRouter()

  return (
    <div className={css.host}>
      <Link href="/blog">
        <a
          className={`${css.link} ${
            router.pathname.includes("blog") ? css.active : ""
          }`}
        >
          Blog
        </a>
      </Link>
      <Link href="/about">
        <a
          className={`${css.link} ${
            router.pathname === "/about" ? css.active : ""
          }`}
        >
          About
        </a>
      </Link>
    </div>
  )
}

export default Nav
